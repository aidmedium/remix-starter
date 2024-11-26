import { useSearchParams } from "@remix-run/react";

const CART_SHEET_KEY = "cart-drawer";

export function useCartSheet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cartIsOpen = searchParams.get(CART_SHEET_KEY) === "true";

  function toggleCartOpen(open: boolean) {
    const params = new URLSearchParams(window.location.search);

    open ? params.set(CART_SHEET_KEY, "true") : params.delete(CART_SHEET_KEY);
    setSearchParams(params, { preventScrollReset: true });
  }

  return { cartIsOpen, toggleCartOpen };
}
