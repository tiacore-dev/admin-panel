import type { ThemeConfig } from "antd";

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#0f00df",
    fontSize: 14,
    borderRadius: 6,
    padding: 16,
    margin: 16,
  },
  components: {
    Descriptions: {
      itemPaddingBottom: 8,
      padding: 12,
    },
    Card: {
      paddingLG: 24,
      padding: 16,
      borderRadiusLG: 8,
      colorBorderSecondary: "#f0f0f0",
      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
    },
    Table: {
      // Размер шрифта
      fontSize: 14,
      fontSizeSM: 13, // Для вспомогательного текста
      // Дополнительные настройки
      headerBg: "#fafafa",
      headerColor: "#5a5a5a",
      rowHoverBg: "#0f00df07",
      borderColor: "#f0f0f0",
    },
  },
};
