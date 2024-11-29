import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { useState } from "react";

import { HttpTypes } from "@medusajs/types";

import { loader } from "@/routes/$cc";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/text";
import { placeOrder } from "@/lib/data/cart";
import { AddressArgs } from "@/lib/data/customer";
import { convertToLocale } from "@/lib/utils/money";
import { CartItem } from "@/modules/cart/cart-item";
import { BillingAddress, ShippingAddress } from "@/modules/checkout/address-inputs";
import { DiscountCodeForm } from "@/modules/checkout/promo-code";
import { validateCheckoutForm } from "@/modules/checkout/validate";

export const meta: MetaFunction = () => {
  return [{ title: "Checkout" }];
};

export default function Checkout() {
  const data = useRouteLoaderData<typeof loader>("routes/$cc");
  const cart = data?.cart;
  const currencyCode = cart?.region?.currency_code || "NGN";

  const fetcher = useFetcher<typeof action>();
  const [showBilling, setShowBilling] = useState(false);

  return (
    <fetcher.Form method="post" className="mb-10 grid gap-10 lg:grid-cols-2">
      <div className="grid gap-4">
        <Heading variant="h2">Customer Info</Heading>
        <FormItem error={fetcher.data?.email}>
          <FormLabel>Email *</FormLabel>
          <FormControl>
            <Input name="email" type="email" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <ShippingAddress errors={fetcher.data} />

        <Heading className="mt-4" variant="h2">
          Shipping Method
        </Heading>
        <div className="grid gap-2 sm:grid-cols-2"></div>

        <Heading className="mt-4" variant="h2">
          Payment
        </Heading>
        <div className="grid gap-4">
          <FormItem error={fetcher.data?.same_as_billing}>
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  defaultChecked={!showBilling}
                  onCheckedChange={(checked) => setShowBilling(!checked)}
                  name="same_as_billing"
                />
              </FormControl>
              <FormLabel>Billing address same as shipping address</FormLabel>
            </div>
            <FormMessage />
          </FormItem>

          <DiscountCodeForm />
        </div>

        {showBilling && <BillingAddress errors={fetcher.data} />}
      </div>

      <div className="sticky top-10 flex flex-col justify-between gap-6 bg-muted p-4 lg:min-h-[90dvh] lg:p-8">
        <div className="mb-24 flex flex-col gap-6 overflow-y-auto">
          <Heading variant="h2" className="flex items-center gap-2">
            Order Summary <Badge>{cart?.items?.length ?? 0}</Badge>
          </Heading>

          {cart?.items?.map((item) => (
            <CartItem
              key={item.id}
              lineItem={item as HttpTypes.StoreCartLineItem}
              currencyCode={currencyCode}
            />
          ))}
        </div>

        {fetcher.data?.error && (
          <Alert variant="destructive">
            <AlertDescription>{fetcher.data?.error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex w-full flex-col font-semibold [&>div]:flex [&>div]:justify-between">
            <div>
              <Paragraph>Subtotal</Paragraph>
              <Paragraph>
                {convertToLocale({ amount: cart?.subtotal || 0, currency_code: currencyCode })}
              </Paragraph>
            </div>
            <div>
              <Paragraph variant="label">Shipping</Paragraph>
              <Paragraph variant="label">
                {convertToLocale({
                  amount: cart?.shipping_total || 0,
                  currency_code: currencyCode,
                })}
              </Paragraph>
            </div>
            <div>
              <Paragraph variant="label">Taxes</Paragraph>
              <Paragraph variant="label">
                {convertToLocale({ amount: cart?.tax_total || 0, currency_code: currencyCode })}
              </Paragraph>
            </div>
            <div className="my-2 border-b" />
            <div>
              <Heading variant="h2">Total</Heading>
              <Heading variant="h2">
                {convertToLocale({ amount: cart?.total || 0, currency_code: currencyCode })}
              </Heading>
            </div>
          </div>

          <Button isLoading={fetcher.state !== "idle"} type="submit">
            Place Order
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<
  Partial<AddressArgs & { email: string; same_as_billing: string; error: string }>
> {
  const countryCode = params.cc as string;

  const formData = await request.formData();
  const { data, errors } = validateCheckoutForm(formData);

  if (!data) {
    return errors;
  }

  try {
    const result = await placeOrder(request, {
      email: data.email,
      same_as_billing: data.same_as_billing,
      shipping_address: {
        first_name: data["shipping.first_name"],
        last_name: data["shipping.last_name"],
        address_1: data["shipping.address"],
        address_2: "",
        city: data["shipping.city"],
        postal_code: data["shipping.postal_code"],
        province: data["shipping.province"],
        phone: data["shipping.phone"],
        company: "",
        country_code: countryCode,
      },
      billing_address: {
        first_name: data["billing.first_name"],
        last_name: data["billing.last_name"],
        address_1: data["billing.address"],
        address_2: "",
        city: data["billing.city"],
        postal_code: data["billing.postal_code"],
        province: data["billing.province"],
        phone: data["billing.phone"],
        company: "",
        country_code: countryCode,
      },
    });

    if (result?.error) {
      return { error: result.error };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong" };
  }

  return {};
}
