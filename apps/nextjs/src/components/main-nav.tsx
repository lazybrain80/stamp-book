"use client";

import type { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

import { cn } from "@saasfly/ui";
import * as Icons from "@saasfly/ui/icons";

import { MobileNav } from "~/components/mobile-nav";
import type { MainNavItem } from "~/types";

interface MainNavProps {
  user: Pick<User, "name" | "image" | "email"> | undefined;
  items?: MainNavItem[];
  children?: React.ReactNode;
  params: {
    lang: string;
  };
}

export function MainNav({user, items, children, params: { lang } }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const handleMenuItemClick = () => {
    toggleMenu();
  };
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href={`/${lang}`} className="hidden items-center space-x-2 md:flex">
        <div>
          <Image
            src="/images/avatars/secure-stamp-logo.svg"
            width="36"
            height="36"
            alt=""
          />
        </div>
        <div className="text-2xl font-semibold">SecureStamp</div>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            !item.auth
              ?<Link
                key={index}
                href={item.disabled ? "#" : `/${lang}${item.href}`}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  item.href.startsWith(`/${segment}`)
                    ? "text-foreground"
                    : "text-foreground/60",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                {item.title}
              </Link>
            : user
              ?<Link
                key={index}
                href={item.disabled ? "#" : `/${lang}${item.href}`}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  item.href.startsWith(`/${segment}`)
                    ? "text-foreground"
                    : "text-foreground/60",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                {item.title}
              </Link>
              : <></>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.Close /> : <Icons.Logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items} menuItemClick={handleMenuItemClick}>
          {children}
        </MobileNav>
      )}
    </div>
  );
}
