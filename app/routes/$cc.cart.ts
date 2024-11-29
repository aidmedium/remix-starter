import { ActionFunctionArgs, data } from "@remix-run/node";

import { z } from "zod";

import { addToCart, deleteLineItem, updateLineItem } from "@/lib/data/cart";

export const action = async (args: ActionFunctionArgs) => {
  switch (args.request.method) {
    case "POST":
      return addToCartHandler(args);
    case "PATCH":
      return updateCartItemHandler(args);
    case "DELETE":
      return removeCartItemHandler(args);
    default:
      return { error: "Method not allowed" };
  }
};

async function addToCartHandler({ request, params }: ActionFunctionArgs) {
  const countryCode = params.cc;
  if (!countryCode) {
    return { error: "Missing country code" };
  }

  const formData = await request.formData();
  const variantId = z.string().safeParse(formData.get("variantId"));
  const quantity = z.string().safeParse(formData.get("quantity"));

  if (!variantId.success || !quantity.success) {
    return { error: "Invalid request data" };
  }

  try {
    await addToCart(request, {
      variantId: variantId.data,
      quantity: parseInt(quantity.data),
      countryCode,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }

  return data({ error: null }, { headers: request.headers });
}

async function updateCartItemHandler({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const lineId = z.string().safeParse(formData.get("lineId"));
  const quantity = z.string().safeParse(formData.get("quantity"));

  if (!lineId.success || !quantity.success) {
    return { error: "Invalid request data" };
  }

  try {
    await updateLineItem(request, {
      lineId: lineId.data,
      quantity: parseInt(quantity.data),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }

  return data({ error: null }, { headers: request.headers });
}

async function removeCartItemHandler({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const lineId = z.string().safeParse(formData.get("lineId"));

  if (!lineId.success) {
    return { error: "Invalid request data" };
  }

  try {
    await deleteLineItem(request, lineId.data);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }

  return data({ error: null }, { headers: request.headers });
}
