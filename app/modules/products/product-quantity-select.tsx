import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ItemQtySelectProps = {
  quantity: number;
  maxQuantity: number;
  action: (quantity: number) => void;
};

export function ProductQuantitySelect({ quantity, maxQuantity, action }: ItemQtySelectProps) {
  return (
    <Select
      disabled={!maxQuantity}
      value={quantity}
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
          },
          (_, i) => (
            <SelectItem key={i} value={String(i + 1)} className="w-[108px]">
              {i + 1}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}
