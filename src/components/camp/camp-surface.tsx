import { cn } from "@/lib/utils";

type CampSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "nav";
};

/** Superfície clara com tokens legíveis dentro do módulo camp (fundo escuro). */
export function CampSurface({
  children,
  className,
  as: Tag = "div",
}: CampSurfaceProps) {
  return <Tag className={cn("camp-surface", className)}>{children}</Tag>;
}
