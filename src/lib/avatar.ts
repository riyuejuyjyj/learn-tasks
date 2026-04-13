function encodeSeed(value: string) {
  return encodeURIComponent(value.trim());
}

export function getAvatarSeed(options: {
  name?: string | null;
  email?: string | null;
  id?: string | null;
}) {
  // 优先级：
  // 1. 用户名
  // 2. 邮箱
  // 3. 用户 id
  // 4. 默认字符串
  return options.name || options.email || options.id || "task-flow-user";
}

export function getAvatarUrl(options: {
  name?: string | null;
  email?: string | null;
  id?: string | null;
}) {
  const seed = encodeSeed(getAvatarSeed(options));

  // DiceBear 支持用任意 seed 稳定生成相同头像。
  // initials 适合做干净的占位头像；后面你也可以换成其他风格。
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundType=gradientLinear&fontWeight=600`;
}
