import { ActionFunctionArgs, data } from "@remix-run/node";

import { z } from "zod";

import { addToCart } from "@/lib/data/cart";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const variantId = z.string().safeParse(formData.get("variantId"));
  const quantity = z.string().safeParse(formData.get("quantity"));
  const countryCode = z.string().safeParse(formData.get("countryCode"));

  if (!variantId.success || !quantity.success || !countryCode.success) {
    return { error: "Invalid request data" };
  }

  try {
    await addToCart(request, {
      variantId: variantId.data,
      quantity: parseInt(quantity.data),
      countryCode: countryCode.data,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }

  return data({ error: null }, { headers: request.headers });
};
