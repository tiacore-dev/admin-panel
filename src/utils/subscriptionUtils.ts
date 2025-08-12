export const createSubsMap = (
  subscriptions: Array<{ subscription_id: string; subscription_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  subscriptions.forEach((sub) => {
    map.set(sub.subscription_id, sub.subscription_name);
  });
  return map;
};
