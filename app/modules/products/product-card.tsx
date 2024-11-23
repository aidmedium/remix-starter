import { Link } from "@remix-run/react";

import { HttpTypes } from "@medusajs/types";

import { Heading } from "@/components/ui/text";
import { getProductPrice } from "@/lib/utils/get-product-price";

import { ProductPrice } from "./product-price";

export function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const sourceUrl = !product.images ? "" : product.images[0].url;
  const altText = product.title;

  const { cheapestPrice } = getProductPrice({
    product: product,
  });

  return (
    <Link className="block space-y-4" to={`/products/${product.handle}`}>
      <div className="relative bg-muted">
        {/* <AddToFavorites>
            <button className="absolute right-5 top-5 z-10 rounded-full bg-muted-foreground/20 p-1.5 text-white">
              <Star size={18} />
            </button>
          </AddToFavorites> */}

        <img src={sourceUrl} alt={altText} className="aspect-[9/12] w-full object-cover" />
      </div>
      <div className="grid gap-1 text-sm">
        <Heading variant="h4">{product.title}</Heading>
        {cheapestPrice && <ProductPrice price={cheapestPrice} />}
      </div>
    </Link>
  );
}
