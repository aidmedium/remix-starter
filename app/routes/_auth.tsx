import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="container mt-40">
      <Outlet />
    </div>
  );
}
