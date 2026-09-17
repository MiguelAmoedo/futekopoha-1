import { CampHeader } from "@/components/camp/camp-header";
import { CampNav } from "@/components/camp/camp-nav";
import { cn } from "@/lib/utils";

type CampShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  backHref?: string;
  className?: string;
  hideNav?: boolean;
  wide?: boolean;
};

export function CampShell({
  children,
  title,
  subtitle,
  eyebrow,
  backHref,
  className,
  hideNav = false,
  wide = false,
}: CampShellProps) {
  const frameWidth = wide ? "max-w-5xl" : "max-w-lg";

  return (
    <div className="camp-module camp-pitch-bg flex min-h-dvh flex-col">
      <header className="camp-ut-chrome-bar camp-chrome sticky top-0 z-40 border-b backdrop-blur-md">
        <div className={cn("mx-auto flex w-full flex-col gap-2 px-4 py-3", frameWidth)}>
          <CampHeader
            title={title}
            subtitle={subtitle}
            eyebrow={eyebrow}
            backHref={backHref}
          />
        </div>
      </header>
      <main
        className={cn(
          "mx-auto flex w-full flex-1 flex-col gap-3 px-4 py-4",
          frameWidth,
          !hideNav && "pb-24",
          className,
        )}
      >
        {children}
      </main>
      {!hideNav ? (
        <footer className="camp-ut-chrome-bar camp-chrome fixed inset-x-0 bottom-0 z-40 border-t px-4 py-2 backdrop-blur-md">
          <div
            className={cn(
              "mx-auto w-full pb-[max(0.5rem,env(safe-area-inset-bottom))]",
              frameWidth,
            )}
          >
            <CampNav />
          </div>
        </footer>
      ) : null}
    </div>
  );
}
