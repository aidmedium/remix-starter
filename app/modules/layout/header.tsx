import { Link } from "@remix-run/react";
import { Suspense } from "react";

import { ShoppingBag, User } from "lucide-react";

import { CartSheet } from "@/cart/sheet";
import { AppLogo } from "@/common/ui/app-logo";
import { ClientLink } from "@/common/ui/link";
import { Paragraph } from "@/common/ui/text";
import { Sidebar } from "@/layout/side-bar";
import { Search } from "@/store/search";

import { NavItems } from "./nav-items";

export function Header() {
  return (
    <div className="fixed top-0 z-50 w-full border-b bg-background">
      <header className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:hidden">
          <Sidebar />
          <Suspense>
            <Search />
          </Suspense>
        </div>

        <div className="flex gap-16">
          <ClientLink href="/">
            <AppLogo showText />
          </ClientLink>
          <div className="hidden items-center gap-6 md:flex">
            <Sidebar />
            <Suspense>
              <Search />
            </Suspense>
          </div>
        </div>

        <Suspense>
          <NavItems />
        </Suspense>

        <div className="hidden items-center gap-16 md:flex [&>*]:text-sm [&>*]:font-medium">
          <a href="https://aidmedium.com/store">
            <Paragraph>Info</Paragraph>
          </a>
          <div className="flex items-center gap-6">
            <LocalizedLink to="/login">Account</Link>
            <CartSheet>Cart</CartSheet>
          </div>
        </div>

        <div className="flex items-center gap-6 md:hidden">
          <LocalizedLink to="/login">
            <User size={18} />
          </Link>
          <CartSheet>
            <ShoppingBag size={18} />
          </CartSheet>
        </div>
      </header>
    </div>
  );
}
