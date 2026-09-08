"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME, BRAND_ASSETS } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  variant?: "header" | "hero" | "mark";
  className?: string;
};

export function BrandLogo({
  href = "/",
  variant = "header",
  className,
}: BrandLogoProps) {
  if (variant === "mark") {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center transition-opacity hover:opacity-85",
          className,
        )}
        aria-label={APP_NAME}
      >
        <Image
          src={BRAND_ASSETS.icon}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-xl shadow-sm"
          priority
        />
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <Image
          src={BRAND_ASSETS.icon}
          alt=""
          width={96}
          height={96}
          className="size-24 rounded-[1.75rem] shadow-lg shadow-black/20"
          priority
        />
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-heading text-[clamp(3.25rem,14vw,4.75rem)] leading-[0.9] tracking-wider text-foreground drop-shadow-sm">
            PEBOL
          </h1>
          <p className="font-heading text-[clamp(1.35rem,6vw,1.85rem)] tracking-[0.28em] text-primary">
            KOPOHA
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-85",
        className,
      )}
      aria-label={APP_NAME}
    >
      <Image
        src={BRAND_ASSETS.icon}
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-lg shadow-sm"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl tracking-wide text-primary-foreground">
          PEBOL
        </span>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
          Kopoha
        </span>
      </span>
    </Link>
  );
}
