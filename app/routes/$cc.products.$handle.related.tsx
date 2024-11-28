import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { HttpTypes } from "@medusajs/types";

import { Heading, Paragraph } from "@/components/ui/text";
import { getProductByHandle, getProductsList } from "@/lib/data/products";
import { getRegion } from "@/lib/data/regions";
import { ProductCard } from "@/modules/products/product-card";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const countryCode = params.cc || "ng";

  const region = await getRegion(countryCode);

  if (!region) return null;

  const handle = params.handle;
  if (!handle) return null;

  const product = await getProductByHandle(handle, countryCode);
  if (!product) return null;

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductParams = {};
  if (region?.id) {
    queryParams.region_id = region.id;
  }
  if (product.collection_id) {
    queryParams.category_id = [product.collection_id];
  }
  if (product.tags) {
    queryParams.tag_id = product.tags.map((t) => t.id).filter(Boolean) as string[];
  }
  queryParams.is_giftcard = false;
  queryParams.limit = 6;
  queryParams.category_id = !product.categories ? [] : product.categories?.map((c) => c.id);

  const products = await getProductsList({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter((responseProduct) => responseProduct.id !== product.id);
  });

  return { products };
};

export function RelatedProducts() {
  const { data, submit } = useFetcher<typeof loader>();

  useEffect(() => {
    // fetch related products from the product detail page
    submit({}, { method: "GET", action: "related" });
  }, []);

  // if (state === "loading") return <div>Loading...</div>;

  if (!data?.products) return null;

  return (
    <div className="my-20 space-y-16">
      <div className="mx-auto flex max-w-lg flex-col text-center">
        <Heading variant="h2">Related products</Heading>
        <Paragraph>You might also want to check out these products.</Paragraph>
      </div>

      <ul className="grid grid-cols-2 gap-10 md:grid-cols-3">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
