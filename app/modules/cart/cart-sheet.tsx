import { useLoaderData } from "@remix-run/react";

import { HttpTypes } from "@medusajs/types";

import { loader } from "@/routes/$cc";

import { LocalizedLink } from "@/components/localized-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Paragraph } from "@/components/ui/text";
import { convertToLocale } from "@/lib/utils/money";

import { CartItem } from "./cart-item";
import { useCartSheet } from "./use-cart-sheet";

export function CartSheet() {
  const { cart } = useLoaderData<typeof loader>();
  const { cartIsOpen, toggleCartOpen } = useCartSheet();

  const items = cart?.items || [];
  const currencyCode = cart?.region?.currency_code || "NGN";

  let cartFooter = (
    <SheetFooter className="mt-auto gap-4 border-t pt-4">
      <div className="flex w-full flex-col font-semibold [&>div]:flex [&>div]:justify-between">
        <div>
          <Paragraph variant="label">Shipping</Paragraph>
          <Paragraph variant="label">Calculated at checkout</Paragraph>
        </div>
        <div>
          <Paragraph variant="label">Taxes</Paragraph>
          <Paragraph variant="label">
            {convertToLocale({ amount: cart?.tax_total || 0, currency_code: currencyCode })}
          </Paragraph>
        </div>
        <div>
          <Paragraph>Subtotal</Paragraph>
          <Paragraph>
            {convertToLocale({ amount: cart?.subtotal || 0, currency_code: currencyCode })}
          </Paragraph>
        </div>
      </div>

      <SheetTrigger asChild>
        <LocalizedLink to="/checkout">
          <Button className="w-full" variant="secondary">
            Checkout
          </Button>
        </LocalizedLink>
      </SheetTrigger>
    </SheetFooter>
  );

  if (!items.length) {
    cartFooter = (
      <SheetFooter className="mt-auto gap-4">
        <Paragraph>
          Your shopping cart is empty. Explore{" "}
          <LocalizedLink className="text-muted-foreground" to="/store">
            Our Categories
          </LocalizedLink>{" "}
          to find something you like.
        </Paragraph>
        <SheetTrigger asChild>
          <Button variant="secondary">Browse products</Button>
        </SheetTrigger>
      </SheetFooter>
    );
  }

  return (
    <Sheet open={cartIsOpen} onOpenChange={toggleCartOpen}>
      <SheetContent className="flex flex-col gap-0">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>
            Cart <Badge>{items?.length}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 overflow-y-auto py-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              lineItem={item as HttpTypes.StoreCartLineItem}
              currencyCode={currencyCode}
            />
          ))}
        </div>

        {cartFooter}
      </SheetContent>
    </Sheet>
  );
}
