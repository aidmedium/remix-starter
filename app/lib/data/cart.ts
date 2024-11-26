import { HttpTypes } from "@medusajs/types";
import lodash from "lodash";

import { sdk } from "@/lib/config";
import medusaError from "@/lib/utils/medusa-error";

import { getCartId, setCartId, withAuthHeaders } from "./cookies";
import { getProductsById } from "./products";
import { getRegion } from "./regions";

const { omit } = lodash;

export const retrieveCart = withAuthHeaders(async function (request, authHeaders) {
  const cartId = await getCartId(request.headers);
  console.log("cartId", cartId);

  if (!cartId) {
    return null;
  }

  return await sdk.store.cart
    .retrieve(cartId, {}, authHeaders)
    .then(({ cart }) => cart)
    .catch(() => {
      return null;
    });
});

export const getOrSetCart = withAuthHeaders(async function (
  request,
  authHeaders,
  countryCode: string
) {
  let cart = await retrieveCart(request);
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create({ region_id: region.id }, {}, authHeaders);
    cart = cartResp.cart;
    setCartId(request.headers, cart.id);
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, authHeaders);
  }

  return cart;
});

export const addToCart = withAuthHeaders(async function (
  request,
  authHeaders,
  data: { variantId: string; quantity: number; countryCode: string }
) {
  const { variantId, quantity, countryCode } = data;
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart(request, countryCode);
  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      authHeaders
    )
    .catch(medusaError);
});

export const updateLineItem = withAuthHeaders(async function (
  request,
  authHeaders,
  data: { lineId: string; quantity: number }
) {
  const { lineId, quantity } = data;

  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item");
  }

  const cartId = await getCartId(request.headers);
  if (!cartId) {
    throw new Error("Missing cart ID when updating line item");
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, authHeaders)
    .catch(medusaError);
});

export const deleteLineItem = withAuthHeaders(async function (
  request,
  authHeaders,
  lineId: string
) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item");
  }

  const cartId = await getCartId(request.headers);
  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }

  await sdk.store.cart.deleteLineItem(cartId, lineId, authHeaders).catch(medusaError);
});

export async function enrichLineItems(
  lineItems: HttpTypes.StoreCartLineItem[] | HttpTypes.StoreOrderLineItem[] | null,
  regionId: string
) {
  if (!lineItems) return [];

  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id!),
    regionId: regionId,
  };

  // Fetch products by their IDs
  const products = await getProductsById(queryParams);
  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return [];
  }

  // Enrich line items with product and variant information
  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p: any) => p.id === item.product_id);
    const variant = product?.variants?.find((v: any) => v.id === item.variant_id);

    // If product or variant is not found, return the original item
    if (!product || !variant) {
      return item;
    }

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, "variants"),
      },
    };
  }) as HttpTypes.StoreCartLineItem[];

  return enrichedItems;
}
