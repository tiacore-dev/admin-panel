import React from "react";
import { Result, Button, Space, Typography } from "antd";
import { BackButton } from "../../components/buttons/backButton";

const { Text } = Typography;

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)", // Учитываем высоту навбара
        marginTop: "-24px", // Компенсируем стандартные отступы
        // padding: "16px", // Добавляем небольшой внутренний отступ
      }}
    >
      {/* Кнопка "Назад" в левом верхнем углу */}
      <div
        style={{
          position: "absolute",
          top: "6px",
          left: "6px",
          zIndex: 1,
        }}
      >
        <BackButton />
      </div>

      <Result
        status="404"
        title="404"
        subTitle="Извините, данной страницы не существует. Возможно, вы ошиблись в адресе или страница была удалена."
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "8px",
          marginTop: "0", // Убираем стандартный отступ Result
        }}
      />
    </div>
  );
};
