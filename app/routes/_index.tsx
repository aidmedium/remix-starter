import type { MetaFunction } from "@remix-run/node";

import { Heading, Paragraph } from "@/common/providers/components/ui/text";

export const meta: MetaFunction = () => {
  return [{ title: "Remix Starter" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <Heading>Starter</Heading>
      <Paragraph>Welcome to Remix Starter!</Paragraph>
    </div>
  );
}
