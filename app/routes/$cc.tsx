import { Outlet } from "@remix-run/react";

export default function StoreLayout() {
  return (
    <div className="container md:px-10">
      <Outlet />
    </div>
  );
}
