"use client";

import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export function PageShell({ children, className, header, footer }: PageShellProps) {
  return (
    <div className="pitch-grid-bg flex min-h-dvh flex-col">
      {header ? (
        <header className="sticky top-0 z-40 border-b border-green-950/15 bg-primary/95 text-primary-foreground backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-lg items-center px-4 py-3">
            {header}
          </div>
        </header>
      ) : null}
      <main
        className={cn(
          "mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-5",
          className,
        )}
      >
        {children}
      </main>
      {footer ? (
        <footer className="border-t border-green-950/15 bg-primary/95 px-4 py-4 text-primary-foreground backdrop-blur-md">
          <div className="mx-auto w-full max-w-lg">{footer}</div>
        </footer>
      ) : null}
    </div>
  );
}

/** Card estilo gramado — bordas brancas, sombra de campo. */
export function PitchCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "pitch-card rounded-2xl p-4",
        hover && "pitch-card-hover cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** @deprecated Use PitchCard */
export const ClayCard = PitchCard;
