import type { ThemeConfig } from "antd";

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#667eea", // Изменено на первый цвет градиента
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
      fontSize: 14,
      fontSizeSM: 13,
      headerBg: "#fafafa",
      headerColor: "#5a5a5a",
      rowHoverBg: "#0f00df07",
      borderColor: "#f0f0f0",
    },
    Button: {
      colorPrimary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      colorPrimaryHover:
        "linear-gradient(135deg,rgba(102, 126, 234, 0.8) 0%,rgba(118, 75, 162, 0.8) 100%)",
      colorPrimaryActive: "linear-gradient(135deg, #465eca 0%, #562b82 100%)",
    },
  },
};
