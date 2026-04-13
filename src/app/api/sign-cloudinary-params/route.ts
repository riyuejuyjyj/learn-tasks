import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-server";

// 配置 Cloudinary 服务端 SDK。
// 这里用 API Secret 生成签名，绝对不能放到前端。
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  // 只允许登录用户请求签名，避免匿名滥用上传接口。
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Next Cloudinary / Upload Widget 会把需要签名的参数传到这里。
    // 我们可以在服务端附加一些固定约束，比如 folder。
    const paramsToSign = {
      ...body.paramsToSign,
      folder: "avatars",
    };

    // 用 Cloudinary API Secret 生成签名。
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return NextResponse.json({
      signature,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      { error: "Failed to sign upload request" },
      { status: 500 },
    );
  }
}
