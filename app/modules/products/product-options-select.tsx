import { HttpTypes } from "@medusajs/types";

import { Paragraph } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  disabled: boolean;
};

export function ProductOptionSelect({
  option,
  current,
  updateOption,
  disabled,
}: OptionSelectProps) {
  const filteredOptions = (option.values ?? []).map((v) => v.value);

  return (
    <div className="flex flex-col gap-y-2 border-t border-dashed py-2">
      <Paragraph className="text-sm font-semibold">{option.title}</Paragraph>
      <ToggleGroup
        type="single"
        variant="outline"
        value={current}
        onValueChange={(value) => updateOption(option.id, value)}
      >
        {filteredOptions.map((option) => (
          <ToggleGroupItem disabled={disabled} key={option} value={option}>
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
