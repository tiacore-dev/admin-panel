export const createUsersMap = (
  users: Array<{ user_id: string; full_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  users.forEach((user) => {
    map.set(user.user_id, user.full_name);
  });
  return map;
};
