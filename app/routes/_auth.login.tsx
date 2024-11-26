import { ActionFunctionArgs, type MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import { z } from "zod";

import { LocalizedLink } from "@/components/localized-link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";
import { login } from "@/lib/data/customer";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign in" },
    { name: "description", content: "Sign in to access an enhanced shopping experience." },
  ];
};

export default function AuthLogin() {
  const { state } = useNavigation();
  const errors = useActionData<typeof action>();

  return (
    <Form method="post" className="mx-auto my-20 w-full max-w-sm space-y-4">
      <header className="space-y-1 pb-2 text-center">
        <Heading>Welcome back!</Heading>
        <Paragraph variant="label">Sign in to access an enhanced shopping experience.</Paragraph>
      </header>

      {errors?.message && (
        <Alert variant="destructive">
          <AlertDescription>{errors.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <Label>Email address</Label>
          <Input name="email" type="email" placeholder="user@example.com" />
          <Paragraph className="text-sm font-medium text-destructive">{errors?.email}</Paragraph>
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input name="password" type="password" placeholder="**********" />
          <Paragraph className="text-sm font-medium text-destructive">{errors?.password}</Paragraph>
        </div>

        <Button className="mt-2" type="submit" isLoading={state === "submitting"}>
          Login
        </Button>
      </div>

      <Paragraph className="text-center">
        <LocalizedLink className="link" to="/reset-password">
          Forgot password?
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const emailData = z
    .string()
    .email({ message: "Invalid email address" })
    .safeParse(formData.get("email"));
  const passwordData = z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .safeParse(formData.get("password"));

  if (!emailData.success || !passwordData.success) {
    return {
      email: emailData.error?.issues[0]?.message,
      password: passwordData.error?.issues[0]?.message,
    };
  }

  try {
    const result = await login(request, {
      email: emailData.data,
      password: passwordData.data,
    });
    if (result) {
      return { message: result };
    }

    return redirect("/account", { headers: request.headers });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }
};
