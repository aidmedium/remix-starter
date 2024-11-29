import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/text";

export function ShippingAddress({ errors }: { errors: any }) {
  const shippingInputs = shippingAddressInputs(errors);

  return (
    <>
      <Heading variant="h2" className="mt-4">
        Shipping Address
      </Heading>
      <div className="grid grid-cols-2 gap-2">
        {shippingInputs.map(({ className, name, label, error }) => (
          <FormItem key={name} error={error} className={className}>
            <FormLabel>{label} *</FormLabel>
            <FormControl>
              <Input name={name} />
            </FormControl>
            <FormMessage />
          </FormItem>
        ))}
      </div>
    </>
  );
}

export function BillingAddress({ errors }: { errors: any }) {
  const billingInputs = billingAddressInputs(errors);

  return (
    <>
      <Heading variant="h2" className="mt-4">
        Billing Address
      </Heading>
      <div className="grid grid-cols-2 gap-2">
        {billingInputs.map(({ className, name, label, error }) => (
          <FormItem key={name} error={error} className={className}>
            <FormLabel>{label} *</FormLabel>
            <FormControl>
              <Input name={name} />
            </FormControl>
            <FormMessage />
          </FormItem>
        ))}
      </div>
    </>
  );
}

const billingAddressInputs = (errors: any) =>
  [
    { name: "billing.first_name", label: "First Name" },
    { name: "billing.last_name", label: "Last Name" },
    { name: "billing.address", label: "Address", className: "col-span-2" },
    { name: "billing.city", label: "City" },
    { name: "billing.province", label: "State / Province" },
    { name: "billing.postal_code", label: "Zip" },
    { name: "billing.phone", label: "Phone" },
  ].map((input) => ({ ...input, error: errors?.[input.name] }));

const shippingAddressInputs = (errors: any) =>
  [
    { name: "shipping.first_name", label: "First Name" },
    { name: "shipping.last_name", label: "Last Name" },
    { name: "shipping.address", label: "Address", className: "col-span-2" },
    { name: "shipping.city", label: "City" },
    { name: "shipping.province", label: "State / Province" },
    { name: "shipping.postal_code", label: "Zip" },
    { name: "shipping.phone", label: "Phone" },
  ].map((input) => ({ ...input, error: errors?.[input.name] }));
