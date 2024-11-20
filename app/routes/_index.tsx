import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Heading, Paragraph } from "@/components/ui/text";

export const meta: MetaFunction = () => {
  return [{ title: "Remix Starter" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <Heading>Starter</Heading>
      <Paragraph>Welcome to Remix Starter!</Paragraph>
      <Link to="/login">Login</Link>
      <Link to="/account">Account</Link>
    </div>
  );
}
