import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getProductsList } from "@/lib/data/products";
import { ProductCard } from "@/modules/products/product-card";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const countryCode = params.cc || "ng";

  const { response } = await getProductsList({ countryCode });

  return { products: response.products };
};

export default function Store() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <section>
      <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
