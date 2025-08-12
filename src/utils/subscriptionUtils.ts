export const createSubsMap = (
  subscriptions: Array<{ subscription_id: string; subscription_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  subscriptions.forEach((sub) => {
    map.set(sub.subscription_id, sub.subscription_name);
  });
  return map;
};
export const createSubPricesMap = (
  subscriptions: Array<{ subscription_id: string; price: number }>
): Map<string, number> => {
  const map = new Map<string, number>();
  subscriptions.forEach((sub) => {
    map.set(sub.subscription_id, sub.price);
  });
  return map;
};
export const createSubAppMap = (
  subscriptions: Array<{ subscription_id: string; application_id: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  subscriptions.forEach((sub) => {
    map.set(sub.subscription_id, sub.application_id);
  });
  return map;
};
