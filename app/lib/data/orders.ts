"use server";

import { sdk } from "@/lib/config";
import medusaError from "@/lib/utils/medusa-error";

import { withAuthHeaders } from "./auth";

export const retrieveOrder = withAuthHeaders(async function (request, authHeaders, id: string) {
  return sdk.store.order
    .retrieve(id, { fields: "*payment_collections.payments" }, authHeaders)
    .then(({ order }) => order)
    .catch((err) => medusaError(err));
});

export const listOrders = withAuthHeaders(async function (
  request,
  authHeaders,
  limit: number = 10,
  offset: number = 0
) {
  return sdk.store.order
    .list({ limit, offset }, authHeaders)
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err));
});
