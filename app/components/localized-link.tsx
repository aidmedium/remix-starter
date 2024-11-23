import { Link, type LinkProps, useParams } from "@remix-run/react";

/**
 * Use this component to create a Remix `<LocalizedLink />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
export const LocalizedLink = ({ to, ...props }: LinkProps) => {
  const params = useParams();
  const countryCode = params.cc ?? "";

  return <Link to={`/${countryCode}${to}`} {...props} />;
};
