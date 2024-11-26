import { LoaderFunctionArgs, data } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { HttpTypes } from "@medusajs/types";

import { Button } from "@/components/ui/button";
import { enrichLineItems, getOrSetCart } from "@/lib/data/cart";
import { CartSheet } from "@/modules/cart/cart-sheet";
import { useCartSheet } from "@/modules/cart/use-cart-sheet";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const countryCode = params.cc || "ng";
  const cart = await getOrSetCart(request, countryCode).catch((e) => console.log(e));

  if (cart?.items?.length && cart.region_id) {
    const enrichedCart = await enrichLineItems(cart.items, cart.region_id);
    cart.items = enrichedCart as HttpTypes.StoreCartLineItem[];
  }

  return data({ cart }, { status: 200, headers: request.headers });
};

export default function StoreLayout() {
  const { toggleCartOpen } = useCartSheet();

  return (
    <div className="container md:px-10">
      <section className="my-10">
        <Button onClick={() => toggleCartOpen(true)}>cart</Button>
      </section>

      <Outlet />
      <CartSheet />
    </div>
  );
}
