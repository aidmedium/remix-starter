import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getProductByHandle } from "@/lib/data/products";
import { ProductActions } from "@/modules/products/product-actions";
import { ProductImageGallery } from "@/modules/products/product-image-gallery";
import { ProductAdditionalInfo, ProductInfo } from "@/modules/products/product-info";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const countryCode = params.cc || "ng";

  const handle = params.handle;
  if (!handle) {
    throw redirect(`/${countryCode}/store`);
  }

  const product = await getProductByHandle(handle, countryCode);
  if (!product) {
    throw redirect(`/${countryCode}/store`);
  }

  return { product };
};

export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  console.log(product);

  return (
    <div className="relative grid gap-8 py-6 sm:gap-20 lg:grid-cols-2">
      <ProductImageGallery images={product.images ?? []} />

      <div className="flex h-fit w-full flex-col gap-12 lg:sticky lg:top-40 lg:mr-20 lg:max-w-md">
        <ProductInfo product={product} />
        <ProductActions product={product} />
        <ProductAdditionalInfo product={product} />
      </div>
    </div>
  );
}
