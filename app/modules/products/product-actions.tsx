import { useFetcher, useParams } from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { HttpTypes } from "@medusajs/types";
import lodash from "lodash";
import { toast } from "sonner";

import { action } from "@/routes/$cc.products.$handle.add-to-cart";

// import MobileActions from "./mobile-actions";
import { Button } from "@/components/ui/button";

import { useCartSheet } from "../cart/use-cart-sheet";
import { ProductOptionSelect } from "./product-options-select";
import { ProductPrice } from "./product-price";
import { ProductQuantitySelect } from "./product-quantity-select";

const { isEqual } = lodash;

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant["options"]) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

export function ProductActions({ product }: { product: HttpTypes.StoreProduct }) {
  const { toggleCartOpen } = useCartSheet();
  const fetcher = useFetcher<typeof action>();
  const isAdding = fetcher.state !== "idle";

  const [options, setOptions] = useState<Record<string, string | undefined>>({});
  const countryCode = useParams().cc as string;

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    } else {
      toast.success("Product added to cart");
      toggleCartOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options);
      setOptions(variantOptions ?? {});
    }
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return;

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [product.variants, options]);

  const [quantity, setQuantity] = useState(1);
  const maxQuantity = selectedVariant?.inventory_quantity || 0;

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) return true;

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) return true;

    // If there is inventory available, we can add to cart
    if (selectedVariant?.manage_inventory && (selectedVariant?.inventory_quantity || 0) > 0)
      return true;

    // Otherwise, we can't add to cart
    return false;
  }, [selectedVariant]);

  const actionsRef = useRef<HTMLDivElement>(null);

  // const inView = useInView(actionsRef, "0px");

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;

    fetcher.submit(
      { variantId: selectedVariant.id, quantity },
      { action: `/${countryCode}/cart`, method: "POST" }
    );
  };

  return (
    <div className="flex flex-col gap-y-4" ref={actionsRef}>
      {(product.variants?.length ?? 0) > 1 && (
        <div className="flex flex-col gap-y-2">
          {(product.options || []).map((option) => (
            <div key={option.id}>
              <ProductOptionSelect
                option={option}
                current={options[option.id]}
                updateOption={setOptionValue}
                disabled={isAdding}
              />
            </div>
          ))}
          {/* <Divider /> */}
        </div>
      )}

      <ProductPrice product={product} variant={selectedVariant} />

      <div className="flex items-center gap-2">
        <ProductQuantitySelect
          quantity={quantity}
          maxQuantity={maxQuantity}
          setQuantity={setQuantity}
        />
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant}
          isLoading={isAdding}
          className="flex-1"
        >
          {!selectedVariant ? "Select variant" : !inStock ? "Out of stock" : "Add to cart"}
        </Button>
        {/* <AddToWishlist productId={product.id} /> */}
      </div>

      {/* <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          maxQuantity={maxQuantity}
          setQuantity={setQuantity}
        /> */}
    </div>
  );
}
