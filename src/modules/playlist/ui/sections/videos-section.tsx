"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface VideosSectionProps {
    playlistId: string;
}

export const VideosSection = (props: VideosSectionProps) => {
    return (
        <Suspense fallback={<VideoSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}
const VideoSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {Array.from({ length: 20 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 20 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} size="compact" />
                ))}
            </div>
        </div>
    )
}

const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
    const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT, playlistId },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        }
    );
    const utils = trpc.useUtils();

    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success("Video added to playlist successfully");
            utils.playlists.getMany.invalidate();
            utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
            utils.playlists.getOne.invalidate({ id: data.playlistId });
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
        },
        onError: () => {
            toast.error("Failed to add video to playlist");
        },
    });

    return (
        <>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
                ))}
            </div>
            <div className="hidden flex-col gap-4 md:flex">
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoRowCard key={video.id} data={video} size="compact" onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
                ))}
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </>
    )
}