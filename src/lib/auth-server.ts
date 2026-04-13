import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// 服务端读取当前 session。
// 后面在页面保护、服务端取当前用户时都会复用这个函数。
export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
