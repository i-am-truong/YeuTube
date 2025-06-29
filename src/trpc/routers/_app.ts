import { categoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { videoReactionRouter } from '@/modules/video-reactions/server/procedures';
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionRouter } from '@/modules/comment-reactions/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';
import { playlistsRouter } from '@/modules/playlist/server/procedures';
export const appRouter = createTRPCRouter({
    studio: studioRouter,
    videos: videosRouter,
    search: searchRouter,
    comments: commentsRouter,
    playlists: playlistsRouter,
    categories: categoriesRouter,
    videoViews: videoViewsRouter,
    subscriptions: subscriptionsRouter,
    videoReactions: videoReactionRouter,
    suggestions: suggestionsRouter,
    commentReactions: commentReactionRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;