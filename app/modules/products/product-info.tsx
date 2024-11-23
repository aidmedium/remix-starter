import { HttpTypes } from "@medusajs/types";
import { PackageCheck, RefreshCw, UndoDot } from "lucide-react";

import { LocalizedLink } from "@/components/localized-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Heading, Paragraph } from "@/components/ui/text";

type ProductInfoProps = { product: HttpTypes.StoreProduct };

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {product.collection && (
        <LocalizedLink to={`/collections/${product.collection.handle}`}>
          <Badge>{product.collection.title}</Badge>
        </LocalizedLink>
      )}
      <Heading>{product.title}</Heading>
      <Paragraph>{product.description}</Paragraph>
    </div>
  );
}

export function ProductAdditionalInfo({ product }: ProductInfoProps) {
  const items = [
    {
      label: "Additional Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ];

  return (
    <Accordion type="single" collapsible>
      {items.map((item) => (
        <AccordionItem key={item.label} value={item.label}>
          <AccordionTrigger>{item.label}</AccordionTrigger>
          <AccordionContent>{item.component}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const ProductInfoTab = ({ product }: ProductInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 py-4">
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-semibold">Material</span>
          <p>{product.material ? product.material : "-"}</p>
        </div>
        <div>
          <span className="font-semibold">Country of origin</span>
          <p>{product.origin_country ? product.origin_country : "-"}</p>
        </div>
        <div>
          <span className="font-semibold">Type</span>
          <p>{product.type ? product.type.value : "-"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-semibold">Weight</span>
          <p>{product.weight ? `${product.weight} g` : "-"}</p>
        </div>
        <div>
          <span className="font-semibold">Dimensions</span>
          <p>
            {product.length && product.width && product.height
              ? `${product.length}L x ${product.width}W x ${product.height}H`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ShippingInfoTab = () => {
  return (
    <div className="grid gap-y-8 py-4 [&>div]:flex [&>div]:items-start [&>div]:gap-3">
      <div>
        <PackageCheck />
        <div>
          <span className="font-semibold">Fast delivery</span>
          <p className="max-w-sm">
            Your package will arrive in 1-3 business days at your pick up location or in the comfort
            of your home.
          </p>
        </div>
      </div>
      <div>
        <RefreshCw />
        <div>
          <span className="font-semibold">Simple exchanges</span>
          <p className="max-w-sm">
            Is the pick not quite right? No worries - we&apos;ll exchange your product for a new
            one.
          </p>
        </div>
      </div>
      <div>
        <UndoDot />
        <div>
          <span className="font-semibold">Easy returns</span>
          <p className="max-w-sm">
            Just return your product and we&apos;ll refund your money. No questions asked –
            we&apos;ll do our best to make sure your return is hassle-free.
          </p>
        </div>
      </div>
    </div>
  );
};
