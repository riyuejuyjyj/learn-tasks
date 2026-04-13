import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-server";

export async function POST(request: Request): Promise<NextResponse> {
  // 先确认当前用户已登录
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname) => {
        // 这里是在真正上传前签发客户端上传 token。
        // 我们把文件限制在 avatars/ 目录下，方便管理。
        if (!pathname.startsWith("avatars/")) {
          throw new Error("Invalid upload path");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: session.user.id,
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // 这里先只打印日志，确认上传成功。
        // 头像真正写入 Better Auth 的 user.image，
        // 我们会在前端拿到 blob.url 后再 updateUser。
        console.log("Avatar upload completed", {
          blob,
          tokenPayload,
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Avatar upload failed", error);

    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}
