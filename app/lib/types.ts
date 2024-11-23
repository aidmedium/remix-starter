export type SortOptions = "price_asc" | "price_desc" | "created_at";

export type VariantPrice = {
  calculated_price_number: number;
  calculated_price: string;
  original_price_number: number;
  original_price: string;
  currency_code: string;
  price_type: string;
  percentage_diff: string;
};
