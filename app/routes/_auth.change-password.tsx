import { ActionFunctionArgs, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";
import { changePassword } from "@/lib/data/customer";

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password" },
    {
      name: "description",
      content: "Reset your password for your account.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");

  if (!code) {
    return { error: true };
  }

  // TODO: validate code and get email
  const email = "user@example.com";

  return { email, error: false };
};

const invalidLinkMessage =
  "This link is invalid or has expired. Please check the link and try again.";

export default function AuthLogin() {
  const { state } = useNavigation();
  const { email, error } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  let body = (
    <Form method="post" className="flex flex-col gap-2">
      <div className="space-y-1">
        <Label>Email</Label>
        <Input name="email" type="email" value={email} readOnly />
      </div>

      <div className="space-y-1">
        <Label>Password</Label>
        <Input name="password" type="password" placeholder="********" />
        <Paragraph className="text-sm font-medium text-destructive">{errors?.password}</Paragraph>
      </div>

      <div className="space-y-1">
        <Label>Confirm Password</Label>
        <Input name="confirmPassword" type="password" placeholder="********" />
        <Paragraph className="text-sm font-medium text-destructive">
          {errors?.confirmPassword}
        </Paragraph>
      </div>

      <Button className="mt-2" type="submit" isLoading={state === "submitting"}>
        Send reset link
      </Button>
    </Form>
  );

  if (error) {
    body = (
      <div className="flex flex-col gap-2 py-10 text-center">
        <Paragraph>{invalidLinkMessage}</Paragraph>
      </div>
    );
  }

  return (
    <div className="mx-auto my-20 w-full max-w-sm space-y-4">
      <header className="space-y-1 pb-2 text-center">
        <Heading>Reset password</Heading>
        <Paragraph variant="label">Set a new password for your account.</Paragraph>
      </header>

      {errors?.message && (
        <Alert variant="destructive">
          <AlertDescription>{errors.message}</AlertDescription>
        </Alert>
      )}

      {body}

      <Paragraph className="text-center">
        <Link className="link" to="/login">
          Back to login
        </Link>
      </Paragraph>

      <Paragraph className="text-center">
        Don&apos;t have an account?&nbsp;&nbsp;
        <Link className="link" to="/register">
          Register
        </Link>
      </Paragraph>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  // Confirm email was successfully filled in
  const emailData = z.string().email().safeParse(formData.get("email"));
  if (!emailData.success) {
    return { message: invalidLinkMessage };
  }

  const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });
  const passwordData = passwordSchema.safeParse(formData.get("password"));
  const confirmPasswordData = passwordSchema.safeParse(formData.get("confirmPassword"));

  if (!passwordData.success || !passwordData.success) {
    return {
      password: passwordData.error?.issues[0]?.message,
      confirmPassword: confirmPasswordData.error?.issues[0]?.message,
    };
  }

  if (passwordData.data !== confirmPasswordData.data) {
    return {
      confirmPassword: "Passwords do not match",
    };
  }

  const result = await changePassword(request, {
    email: emailData.data,
    password: passwordData.data,
  });

  if (result) {
    return { message: result };
  }

  return redirect("/login", { headers: request.headers });
};
