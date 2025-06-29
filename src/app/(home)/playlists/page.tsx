import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistsView } from "@/modules/playlist/ui/views/playlist-view";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async () => {
    void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
    return (
        <HydrateClient>
            <PlaylistsView />
        </HydrateClient>
    )
}

export default Page;