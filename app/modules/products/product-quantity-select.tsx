import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ItemQtySelectProps = {
  quantity: number;
  maxQuantity: number;
  setQuantity: (quantity: number) => void;
};

export function ProductQuantitySelect({
  quantity,
  maxQuantity,
  setQuantity: action,
}: ItemQtySelectProps) {
  return (
    <Select
      disabled={!maxQuantity}
      value={quantity.toString()}
      onValueChange={(quantity) => action(+quantity)}
    >
      <SelectTrigger
        className={cn("w-20", {
          "pointer-events-none opacity-60": maxQuantity === 0,
        })}
        aria-label="Choose quantity"
      >
        {quantity}
      </SelectTrigger>
      <SelectContent>
        {Array.from(
          {
            length: Math.min(maxQuantity, 10),
            // This limits the number of options to `maxQuantity` or not more than 10.
            // Switch to `length: maxQuantity` to allow users select as many as is available.
          },
          (_, i) => (
            <SelectItem key={i} value={String(i + 1)} className="">
              {i + 1}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}
