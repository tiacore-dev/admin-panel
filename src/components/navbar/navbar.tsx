import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Button, Dropdown, Drawer } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCompany } from "../../context/companyContext";
import "./navbar.css";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { useMobileDetection } from "../../hooks/useMobileDetection";
import { CompanyFormModal } from "../../pages/companiesPage/components/companyFormModal";

const LOGO_TEXT = "ADMIN | Tiacore"; // Замените на ваш текст лого

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileDetection();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);

  const {
    selectedCompanyId,
    setSelectedCompanyId,
    availableCompanies,
    isSuperadmin,
  } = useCompany();

  const { data: companiesData } = useCompanyQuery();
  const companies = companiesData?.companies || [];

  const mainItems = [
    { label: "Главная", key: "/home" },
    { label: "Контрагенты", key: "/legal-entities/buyers" },
    { label: "Организации", key: "/legal-entities/sellers" },
    { label: "Компании", key: "/companies" },
  ];

  const settingsItems = [
    ...// (isSuperadmin
    //   ?
    [
      { label: "Пользователи", key: "/users" },
      { label: "Управление доступом", key: "/role_permissions_relations" },
    ],
    // : []),
  ];

  // Пункты меню для обычного пользователя (аккаунт и выход)
  const userMenuItems = [
    { label: "Аккаунт", key: "/account", icon: <UserOutlined /> },
    { label: "Выйти", key: "logout", icon: <LogoutOutlined /> },
  ];

  // Объединяем все пункты меню для мобильной версии
  const mobileMenuItems = [
    ...mainItems,
    ...settingsItems,
    ...(!isSuperadmin ? userMenuItems : []),
  ];

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const allItems = isMobile
      ? mobileMenuItems
      : [...mainItems, ...(showSettings ? settingsItems : [])];
    const matchedItem = allItems.find((item) =>
      currentPath.startsWith(item.key)
    );
    return matchedItem ? [matchedItem.key] : [];
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const companyMenuItems = availableCompanies.map((companyId) => {
    const company = companies.find((c) => c.company_id === companyId);
    return {
      key: companyId,
      label: company ? company.company_name : companyId,
      onClick: () => setSelectedCompanyId(companyId),
    };
  });

  const selectedCompanyName =
    companies.find((c) => c.company_id === selectedCompanyId)?.company_name ||
    selectedCompanyId;

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      localStorage.clear();
      window.location.href = "/login";
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
              {!isSuperadmin && (
                <>
                  {selectedCompanyId && (
                    <Dropdown
                      menu={{ items: companyMenuItems }}
                      placement="bottomRight"
                    >
                      <Button className="company-selector">
                        {selectedCompanyName}
                      </Button>
                    </Dropdown>
                  )}
                  {!selectedCompanyId && (
                    <Button onClick={() => setCompanyModalVisible(true)}>
                      Добавить компанию
                    </Button>
                  )}
                </>
              )}

              {isSuperadmin && (
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
              )}
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
                  window.location.href = "/login";
                } else {
                  navigate(key);
                }
                toggleDrawer();
              }}
            />
          </Drawer>
          {!isSuperadmin && (
            <CompanyFormModal
              visible={companyModalVisible}
              onCancel={() => setCompanyModalVisible(false)}
              onSuccess={() => {
                setCompanyModalVisible(false);
              }}
              mode="create"
            />
          )}
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

          {showSettings && (
            <Menu
              className="settings-menu"
              mode="horizontal"
              items={settingsItems}
              selectedKeys={getSelectedKeys()}
              onClick={({ key }) => navigate(key)}
            />
          )}
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
            {!isSuperadmin && (
              <>
                {selectedCompanyId && (
                  <Dropdown
                    menu={{ items: companyMenuItems }}
                    placement="bottomRight"
                  >
                    <Button className="company-selector">
                      {selectedCompanyName}
                    </Button>
                  </Dropdown>
                )}
                {!selectedCompanyId && (
                  <Button onClick={() => setCompanyModalVisible(true)}>
                    Добавить компанию
                  </Button>
                )}
              </>
            )}
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
          {!isSuperadmin && (
            <CompanyFormModal
              visible={companyModalVisible}
              onCancel={() => setCompanyModalVisible(false)}
              onSuccess={() => {
                setCompanyModalVisible(false);
              }}
              mode="create"
            />
          )}
        </div>
      )}
    </>
  );
};
