import { useFetcher, useParams } from "@remix-run/react";

import { HttpTypes } from "@medusajs/types";

import { action } from "@/routes/$cc.cart";

import { LocalizedLink } from "@/components/localized-link";
import { Heading, Paragraph } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { convertToLocale } from "@/lib/utils/money";

import { ProductQuantitySelect } from "../products/product-quantity-select";

export function CartItem({
  lineItem,
  currencyCode,
}: {
  lineItem: HttpTypes.StoreCartLineItem;
  currencyCode: string;
}) {
  const countryCode = useParams().cc as string;
  const fetcher = useFetcher<typeof action>();

  const maxQuantity = lineItem.variant?.inventory_quantity || 0;
  const variantOptions = lineItem.variant?.options || [];

  function removeLineItem() {
    fetcher.submit({ lineId: lineItem.id }, { action: `/${countryCode}/cart`, method: "DELETE" });
  }

  function updateQuantity(quantity: number) {
    fetcher.submit(
      { lineId: lineItem.id, quantity },
      { action: `/${countryCode}/cart`, method: "PATCH" }
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-[6rem_1fr] gap-4",
        fetcher.state !== "idle" && "pointer-events-none animate-pulse opacity-70"
      )}
    >
      <LocalizedLink to={`/products/${lineItem.product_handle}`}>
        <img
          src={lineItem.thumbnail}
          className="aspect-[3/4] w-full rounded-md object-cover"
          alt={lineItem.product_title}
        />
      </LocalizedLink>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-4">
          <Heading variant="h4">{lineItem.product_title}</Heading>
          <Heading variant="h4">
            {convertToLocale({ amount: lineItem.unit_price || 0, currency_code: currencyCode })}
          </Heading>
        </div>

        <div>
          {variantOptions.map((option) => (
            <div key={option.id} className="flex gap-2">
              <Paragraph variant="label">{option.option?.title}:</Paragraph>
              <Paragraph variant="label">{option.value}</Paragraph>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-end gap-2">
          <ProductQuantitySelect
            quantity={lineItem.quantity}
            setQuantity={updateQuantity}
            maxQuantity={maxQuantity}
          />
          <button onClick={removeLineItem} className="link ml-auto text-sm">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
