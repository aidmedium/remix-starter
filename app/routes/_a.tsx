import { LoaderFunction } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";

import { getCustomer } from "@/lib/data/customer";

export const loader: LoaderFunction = async ({ request }) => {
  const customer = await getCustomer(request);
  if (!customer) {
    return redirect("/login");
  }

  return { customer };
};

export default function AuthLayout() {
  return (
    <div className="container mt-40">
      <Outlet />
    </div>
  );
}
