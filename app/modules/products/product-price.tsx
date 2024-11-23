import { HttpTypes } from "@medusajs/types";

import { Heading } from "@/components/ui/text";
import { getProductPrice } from "@/lib/utils/get-product-price";

export function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  });

  const selectedPrice = variant ? variantPrice : cheapestPrice;

  if (!selectedPrice) {
    return <div className="block h-9 w-32 animate-pulse bg-gray-100" />;
  }

  return (
    <div className="flex flex-col">
      <Heading variant="h2">
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </Heading>
      {selectedPrice.price_type === "sale" && (
        <>
          <Heading variant="h2" className="text-muted-foreground">
            <span>Original: </span>
            <span className="line-through">{selectedPrice.original_price}</span>
          </Heading>
          <Heading variant="h2">-{selectedPrice.percentage_diff}%</Heading>
        </>
      )}
    </div>
  );
}
