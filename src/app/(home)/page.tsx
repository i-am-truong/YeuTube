import { DEFAULT_LIMIT } from "@/constants";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { trpc, HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { categoryId?: string };
}

const Page = async ({ searchParams }: PageProps) => {
  void trpc.categories.getMany.prefetch();
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT
  });

  return (
    <HydrateClient>
      <HomeView categoryId={searchParams.categoryId} />
    </HydrateClient>
  );
};

export default Page;
