/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};

  // 优先使用 role 字段，兼容 userRole
  const userRole = currentUser?.role ?? currentUser?.userRole;

  return {
    // role = 0 表示超级管理员/管理员
    canAdmin: currentUser && userRole === 0,
  };
}
