import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Button, Dropdown, Drawer } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./navbar.css";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { useMobileDetection } from "../../hooks/useMobileDetection";
import { CompanyFormModal } from "../../pages/companiesPage/components/companyFormModal";
import { logoutApi } from "../../api/authApi";

const LOGO_TEXT = "ADMIN | Tiacore"; // Замените на ваш текст лого

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileDetection();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);

  const { data: companiesData } = useCompanyQuery();
  const companies = companiesData?.companies || [];

  const mainItems = [
    // { label: "Главная", key: "/home" },
    { label: "Контрагенты", key: "/legal-entities/buyers" },
    { label: "Организации", key: "/legal-entities/sellers" },
    { label: "Компании", key: "/companies" },
    { label: "Пользователи", key: "/users" },
    { label: "Управление доступом", key: "/role_permissions_relations" },
  ];

  // Пункты меню для обычного пользователя (аккаунт и выход)
  const userMenuItems = [
    { label: "Аккаунт", key: "/account", icon: <UserOutlined /> },
    { label: "Выйти", key: "/login", icon: <LogoutOutlined /> },
  ];

  // Объединяем все пункты меню для мобильной версии
  const mobileMenuItems = [...mainItems, ...userMenuItems];

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const allItems = isMobile ? mobileMenuItems : [...mainItems];
    const matchedItem = allItems.find((item) =>
      currentPath.startsWith(item.key)
    );
    return matchedItem ? [matchedItem.key] : [];
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      logoutApi();
      // navigate("/login");
    } else {
      navigate(key);
    }
  };
  return (
    <>
      {isMobile && (
        <>
          <div className="navbar-container">
            <div className="mobile-logo-container">
              <Button
                className="mobile-menu-button"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
              />
              <div className="mobile-logo" onClick={() => navigate("/home")}>
                {LOGO_TEXT}
              </div>
            </div>
            <div className="buttons-container">
              <button
                className="animated-btn"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                <div className="sign">
                  <LogoutOutlined />
                </div>
              </button>
            </div>
          </div>

          <Drawer
            title="Меню"
            placement="left"
            onClose={toggleDrawer}
            visible={drawerVisible}
            width={280}
          >
            <Menu
              mode="vertical"
              items={mobileMenuItems}
              selectedKeys={getSelectedKeys()}
              onClick={({ key }) => {
                if (key === "logout") {
                  localStorage.clear();
                  navigate("/login");
                } else {
                  navigate(key);
                }
                toggleDrawer();
              }}
            />
          </Drawer>
          <CompanyFormModal
            visible={companyModalVisible}
            onCancel={() => setCompanyModalVisible(false)}
            onSuccess={() => {
              setCompanyModalVisible(false);
            }}
            mode="create"
          />
        </>
      )}

      {!isMobile && (
        <div
          className={`navbar-container ${showSettings ? "settings-open" : ""}`}
        >
          <div className="navbar-logo" onClick={() => navigate("/home")}>
            {LOGO_TEXT}
          </div>
          <Menu
            className="navbar-menu"
            mode="horizontal"
            items={mainItems}
            selectedKeys={getSelectedKeys()}
            onClick={({ key }) => navigate(key)}
          />

          <div className="buttons-container">
            {/* <button className="animated-settings-btn" onClick={toggleSettings}>
              <div className="sign">
                <div className="text">Настройки</div>
                <SettingOutlined
                  className={`rotate-icon ${
                    showSettings
                      ? "rotate-icon-anticlockwise"
                      : "rotate-icon-clockwise"
                  }`}
                />
              </div>
            </button> */}

            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Button className="user-menu-button" icon={<UserOutlined />} />
            </Dropdown>
          </div>
          <CompanyFormModal
            visible={companyModalVisible}
            onCancel={() => setCompanyModalVisible(false)}
            onSuccess={() => {
              setCompanyModalVisible(false);
            }}
            mode="create"
          />
        </div>
      )}
    </>
  );
};
