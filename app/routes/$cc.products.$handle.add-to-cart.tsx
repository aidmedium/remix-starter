import { ActionFunctionArgs } from "@remix-run/node";

import { z } from "zod";

import { addToCart } from "@/lib/data/cart";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const variantId = z.string().safeParse(formData.get("variantId"));
  const quantity = z.number().safeParse(formData.get("quantity"));
  const countryCode = z.string().safeParse(formData.get("countryCode"));

  if (!variantId.success || !quantity.success || !countryCode.success) {
    return { error: "Invalid request data" };
  }

  await addToCart(request, {
    variantId: variantId.data,
    quantity: quantity.data,
    countryCode: countryCode.data,
  });

  return {};
};
