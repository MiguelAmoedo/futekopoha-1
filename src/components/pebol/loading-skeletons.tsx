import { Skeleton } from "@/components/ui/skeleton";
import { PitchCard } from "@/components/pebol/page-shell";

export function AgendaListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <PitchCard key={i} className="flex flex-col gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </PitchCard>
      ))}
    </div>
  );
}

export function AgendaPageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <PitchCard className="flex flex-col gap-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </PitchCard>
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <PitchCard className="flex flex-col gap-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </PitchCard>
    </div>
  );
}

export function PlayerCardSkeleton() {
  return (
    <PitchCard className="flex flex-col items-center gap-4 py-8">
      <Skeleton className="size-28 rounded-full" />
      <Skeleton className="h-8 w-48" />
      <div className="grid w-full grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </PitchCard>
  );
}
