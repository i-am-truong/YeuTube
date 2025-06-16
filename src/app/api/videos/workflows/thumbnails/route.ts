import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType {
    userId: string;
    videoId: string;
    prompt: string
}


export const { POST } = serve(async (context) => {
    const utapi = new UTApi();
    const input = context.requestPayload as InputType
    const { videoId, userId, prompt } = input;

    const video = await context.run("get-video", async () => {
        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(
                eq(videos.id, videoId),
                eq(videos.userId, userId)
            ))
        if (!existingVideo) {
            throw new Error("Not Found!")
        }
        return existingVideo
    })

    const tempThumbnailUrl = await context.run("generate-thumbnail", async () => {
        const response = await fetch("https://two.keyai.shop/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt,
                n: 1,
                model: "dall-e-3",
                size: "1792x1024",
            }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as { data: { url: string }[] };
        const imageUrl = data.data[0]?.url;

        if (!imageUrl) {
            throw new Error("No thumbnail URL generated from API");
        }

        return imageUrl;
    });

    await context.run("cleanup-thumbnail", async () => {
        if (video.thumbnailKey) {
            await utapi.deleteFiles(video.thumbnailKey)
            await db
                .update(videos)
                .set({ thumbnailKey: null, thumbnailUrl: null })
                .where(and(
                    eq(videos.id, videoId),
                    eq(videos.userId, userId)
                ))
        }
    });

    const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
        const utapi = new UTApi();
        const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

        if (!data) {
            throw new Error("Bad request");
        }
        return data;
    })

    await context.run("update-video", async () => {
        await db
            .update(videos)
            .set({
                thumbnailKey: uploadedThumbnail.key,
                thumbnailUrl: uploadedThumbnail.ufsUrl,
            })
            .where(and(
                eq(videos.id, video.id),
                eq(videos.userId, video.userId)
            ))
    });
});