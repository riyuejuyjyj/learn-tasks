import { createAuthClient } from "better-auth/react";

// Better Auth 的 React 客户端实例。
// 如果前后端在同一个域名下，baseURL 可以不写；
// 这里显式写出来，方便你以后理解认证请求发到哪里。
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
