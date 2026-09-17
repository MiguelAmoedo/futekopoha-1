import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CampCardTier = "default" | "gold" | "silver" | "bronze";

type CampCardProps = {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  tier?: CampCardTier;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
};

const TIER_CLASS: Record<CampCardTier, string> = {
  default: "ring-1 ring-foreground/5",
  gold: "camp-card--tier-gold ring-0",
  silver: "camp-card--tier-silver ring-0",
  bronze: "camp-card--tier-bronze ring-0",
};

/** Card claro com tokens camp — painel estilo EA FC UT sobre chrome escuro. */
export function CampCard({
  title,
  description,
  header,
  tier = "default",
  className,
  headerClassName,
  contentClassName,
  children,
}: CampCardProps) {
  const hasHeader = header || title || description;

  return (
    <Card className={cn("camp-surface camp-card", TIER_CLASS[tier], className)}>
      {hasHeader ? (
        <CardHeader className={cn("gap-3", headerClassName)}>
          {header}
          {title ? (
            <CardTitle className="font-heading text-lg font-semibold uppercase tracking-wide">
              {title}
            </CardTitle>
          ) : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      {children ? (
        <CardContent className={contentClassName}>{children}</CardContent>
      ) : null}
    </Card>
  );
}
