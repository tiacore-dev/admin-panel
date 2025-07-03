"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Button, Dropdown, Drawer, message } from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
  BankOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  // RocketOutlined,
} from "@ant-design/icons";
import "./navbar.css";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { useMobileDetection } from "../../hooks/useMobileDetection";
import { CompanyFormModal } from "../../pages/companiesPage/components/companyFormModal";
import { logoutApi } from "../../api/authApi";

const LOGO_TEXT = "ADMIN | Tiacore";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileDetection();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);

  const { data: companiesData } = useCompanyQuery();
  const companies = companiesData?.companies || [];

  const mainItems: MenuProps["items"] = [
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BankOutlined style={{ fontSize: "16px" }} />
          Юр. лица
        </span>
      ),
      key: "/legal-entities",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShopOutlined style={{ fontSize: "16px" }} />
          Компании
        </span>
      ),
      key: "/companies",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UsergroupAddOutlined style={{ fontSize: "16px" }} />
          Пользователи
        </span>
      ),
      key: "/users",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SafetyOutlined style={{ fontSize: "16px" }} />
          Управление доступом
        </span>
      ),
      key: "/role_permissions_relations",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <EnvironmentOutlined style={{ fontSize: "16px" }} />
          Города
        </span>
      ),
      key: "/cities",
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    // {
    //   label: (
    //     <span
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         gap: "8px",
    //         padding: "4px 0",
    //         fontWeight: 400,
    //       }}
    //     >
    //       <UserOutlined />
    //       Мой аккаунт
    //     </span>
    //   ),
    //   key: "/account",
    // },
    {
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 0",
            fontWeight: 500,
          }}
        >
          <LogoutOutlined />
          Выйти
        </span>
      ),
      key: "logout",
      danger: true,
    },
  ];

  const mobileMenuItems: MenuProps["items"] = [
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BankOutlined style={{ fontSize: "16px" }} />
          Юр. лица
        </span>
      ),
      key: "/legal-entities",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShopOutlined style={{ fontSize: "16px" }} />
          Компании
        </span>
      ),
      key: "/companies",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UsergroupAddOutlined style={{ fontSize: "16px" }} />
          Пользователи
        </span>
      ),
      key: "/users",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SafetyOutlined style={{ fontSize: "16px" }} />
          Управление доступом
        </span>
      ),
      key: "/role_permissions_relations",
    },
    {
      type: "divider",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserOutlined />
          Мой аккаунт
        </span>
      ),
      key: "/account",
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LogoutOutlined />
          Выйти
        </span>
      ),
      key: "logout",
      danger: true,
    },
  ];

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const allItems = isMobile ? mobileMenuItems : mainItems;
    const matchedItem = allItems?.find(
      (item) =>
        item &&
        typeof item === "object" &&
        "key" in item &&
        typeof item.key === "string" &&
        currentPath.startsWith(item.key)
    );
    return matchedItem && "key" in matchedItem
      ? [matchedItem.key as string]
      : [];
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      navigate("/login");
      message.success("Вы успешно вышли из системы");
    } catch (error) {
      message.error("Ошибка при выходе из системы");
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      handleLogout();
    } else {
      navigate(key);
    }
  };

  return (
    <>
      {isMobile && (
        <>
          <div className="navbar-container mobile">
            <div className="mobile-logo-container">
              <Button
                className="mobile-menu-button"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
              />
              <div className="mobile-logo" onClick={() => navigate("/home")}>
                {/* <RocketOutlined style={{ marginRight: "8px" }} /> */}
                {LOGO_TEXT}
              </div>
            </div>
            <div className="buttons-container">
              <button className="animated-btn" onClick={handleLogout}>
                <div className="sign">
                  <LogoutOutlined />
                </div>
                <div className="text">Выйти</div>
              </button>
            </div>
          </div>

          <Drawer
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {/* <RocketOutlined style={{ fontSize: "18px" }} /> */}
                Навигация
              </div>
            }
            placement="left"
            onClose={toggleDrawer}
            open={drawerVisible}
            width={300}
            styles={{
              header: {
                background: "linear-gradient(135deg, #0f00df 0%, #3b82f6 100%)",
                borderBottom: "none",
              },
              body: {
                padding: 0,
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              },
            }}
          >
            <Menu
              mode="vertical"
              items={mobileMenuItems}
              selectedKeys={getSelectedKeys()}
              onClick={({ key }) => {
                if (key === "logout") {
                  handleLogout();
                } else {
                  navigate(key);
                }
                toggleDrawer();
              }}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "15px",
              }}
            />
          </Drawer>
        </>
      )}

      {!isMobile && (
        <div className="navbar-container desktop">
          <div className="navbar-logo" onClick={() => navigate("/home")}>
            {/* <RocketOutlined style={{ marginRight: "8px", fontSize: "18px" }} /> */}
            {LOGO_TEXT}
          </div>

          <div className="navbar-menu-wrapper">
            <Menu
              className="navbar-menu"
              mode="horizontal"
              items={mainItems}
              selectedKeys={getSelectedKeys()}
              onClick={({ key }) => navigate(key)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "15px",
                flex: 1,
                justifyContent: "center",
              }}
            />
          </div>

          <div className="buttons-container">
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                className="user-menu-button"
                // icon={<UserOutlined style={{ fontSize: "16px" }} />}
              >
                {" "}
                <UserOutlined style={{ fontSize: "16px" }} />{" "}
              </Button>
            </Dropdown>
          </div>
        </div>
      )}

      <CompanyFormModal
        visible={companyModalVisible}
        onCancel={() => setCompanyModalVisible(false)}
        onSuccess={() => {
          setCompanyModalVisible(false);
        }}
        mode="create"
      />
    </>
  );
};
