import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function DiscountCodeForm() {
  return (
    <FormItem>
      <FormLabel>Discount Code</FormLabel>
      <div className="flex gap-2">
        <FormControl>
          <Input name="discount_code" placeholder="Enter your discount code" />
        </FormControl>
        <Button>Apply</Button>
      </div>
      <FormMessage />
    </FormItem>
  );
}
