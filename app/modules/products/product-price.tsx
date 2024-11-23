import { Paragraph } from "@/components/ui/text";
import { VariantPrice } from "@/lib/types";

export function ProductPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null;
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Paragraph className="text-muted-foreground line-through">{price.original_price}</Paragraph>
      )}
      <Paragraph>{price.calculated_price}</Paragraph>
    </>
  );
}
