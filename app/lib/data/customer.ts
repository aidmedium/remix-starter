import { redirect } from "@remix-run/react";

import { HttpTypes } from "@medusajs/types";

import { sdk } from "@/lib/config";
import medusaError from "@/lib/utils/medusa-error";

import { removeAuthToken, setAuthToken, withAuthHeaders } from "./auth";

export const getCustomer = withAuthHeaders(async function (request, authHeaders) {
  return await sdk.store.customer
    .retrieve({}, authHeaders)
    .then(({ customer }) => customer)
    .catch(() => null);
});

export const updateCustomer = withAuthHeaders(async function (
  request,
  authHeaders,
  body: HttpTypes.StoreUpdateCustomer
) {
  const updateRes = await sdk.store.customer
    .update(body, {}, authHeaders)
    .then(({ customer }) => customer)
    .catch(medusaError);

  return updateRes;
});

export const signup = withAuthHeaders(async function (
  request,
  authHeaders,
  data: { email: string; password: string; first_name: string; last_name: string; phone: string }
) {
  const password = data.password;
  const customerForm = {
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
  };

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    });

    const customHeaders = { authorization: `Bearer ${token}` };

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      customHeaders
    );

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    });

    setAuthToken(request.headers, loginToken as string);

    return createdCustomer;
  } catch (error: any) {
    return error.toString();
  }
});

export const login = withAuthHeaders(async function (
  request,
  authHeaders,
  { email, password }: { email: string; password: string }
) {
  try {
    const loginToken = await sdk.auth.login("customer", "emailpass", { email, password });
    setAuthToken(request.headers, loginToken as string);
  } catch (error: any) {
    return error.toString();
  }
});

export const signout = withAuthHeaders(async function (request) {
  await sdk.auth.logout();
  removeAuthToken(request.headers);
  redirect("/login");
});

export const addCustomerAddress = withAuthHeaders(async function (
  request,
  authHeaders,
  data: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postal_code: string;
    province: string;
    country_code: string;
    phone: string;
  }
) {
  return sdk.store.customer
    .createAddress(data, {}, authHeaders)
    .then(() => ({ success: true, error: null }))
    .catch((err) => ({ success: false, error: err.toString() }));
});

export const deleteCustomerAddress = withAuthHeaders(async function (
  request,
  authHeaders,
  addressId: string
) {
  await sdk.store.customer
    .deleteAddress(addressId, authHeaders)
    .then(() => ({ success: true, error: null }))
    .catch((err) => ({ success: false, error: err.toString() }));
});

export const updateCustomerAddress = withAuthHeaders(async function (
  request,
  authHeaders,
  currentState: Record<string, unknown>,
  data: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postal_code: string;
    province: string;
    country_code: string;
    phone: string;
  }
) {
  const addressId = currentState.addressId as string;

  return sdk.store.customer
    .updateAddress(addressId, data, {}, authHeaders)
    .then(() => ({ success: true, error: null }))
    .catch((err) => ({ success: false, error: err.toString() }));
});

export const resetPassword = withAuthHeaders(async function (
  request,
  authHeaders,
  { email }: { email: string }
) {
  try {
    await sdk.auth.resetPassword("customer", "emailpass", { identifier: email });
  } catch (error: any) {
    return error.toString();
  }
});

export const changePassword = withAuthHeaders(async function (
  request,
  authHeaders,
  { email, password }: { email: string; password: string }
) {
  try {
    await sdk.auth.updateProvider("customer", "emailpass", { email, password });
  } catch (error: any) {
    return error.toString();
  }
});
