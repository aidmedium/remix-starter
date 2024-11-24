import { sdk } from "@/lib/config";
import medusaError from "@/lib/utils/medusa-error";

import { getCartId, setCartId, withAuthHeaders } from "./cookies";
import { getRegion } from "./regions";

export const retrieveCart = withAuthHeaders(async function (request, authHeaders) {
  const cartId = await getCartId(request.headers);

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

export const getOrSetCart = withAuthHeaders(async function (request, authHeaders, countryCode) {
  let cart = await retrieveCart(request);
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create({ region_id: region.id });
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
  {
    variantId,
    quantity,
    countryCode,
  }: {
    variantId: string;
    quantity: number;
    countryCode: string;
  }
) {
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
