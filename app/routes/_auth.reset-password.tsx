import { type ActionFunction, type MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import { z } from "zod";

import { LocalizedLink } from "@/components/localized-link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";
import { resetPassword } from "@/lib/data/customer";

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password" },
    {
      name: "description",
      content: "Enter your email and we'll send you a link to reset your password.",
    },
  ];
};

export default function AuthLogin() {
  const { state } = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="mx-auto my-20 w-full max-w-sm space-y-4">
      <header className="space-y-1 pb-2 text-center">
        <Heading>Reset your password</Heading>
        <Paragraph variant="label">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Paragraph>
      </header>

      {actionData?.message && (
        <Alert variant="destructive">
          <AlertDescription>{actionData.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <Label>Email address</Label>
          <Input name="email" type="email" placeholder="user@example.com" />
          <Paragraph className="text-sm font-medium text-destructive">
            {actionData?.email}
          </Paragraph>
        </div>

        <Button className="mt-2" type="submit" isLoading={state === "submitting"}>
          Send reset link
        </Button>
      </div>

      <Paragraph className="text-center">
        <LocalizedLink className="link" to="/login">
          Back to login
        </LocalizedLink>
      </Paragraph>

      <Paragraph className="text-center">
        Don&apos;t have an account?&nbsp;&nbsp;
        <LocalizedLink className="link" to="/register">
          Register
        </LocalizedLink>
      </Paragraph>
    </Form>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const emailData = z
    .string()
    .email({ message: "Invalid email address" })
    .safeParse(formData.get("email"));

  if (!emailData.success) {
    return { email: emailData.error?.issues[0]?.message };
  }

  const result = await resetPassword(request, { email: emailData.data });

  if (result) return { message: result };

  return { success: true };
};
