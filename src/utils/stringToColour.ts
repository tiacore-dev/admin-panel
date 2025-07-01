const APP_COLORS = [
  "magenta",
  "red",
  "volcano",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
  //   "orange",
  //   "#f50",
  //   "#2db7f5",
  //   "#87d068",
  //   "#108ee9",
  //   "#FF6B6B",
  //   "#FF9F43",
  //   "#FFC154",
  //   "#47B39C",
  //   "#6C5CE7",
];

// Функция для получения цвета на основе строки
export const getTegColorForString = (appName: string) => {
  if (!appName) return "default";

  // Хешируем строку в индекс палитры
  let hash = 0;
  for (let i = 0; i < appName.length; i++) {
    hash = appName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % APP_COLORS.length;

  return APP_COLORS[index];
};
