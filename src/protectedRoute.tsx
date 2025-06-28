import type React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Navbar } from "./components/navbar/navbar";

const { Content } = Layout;

const ProtectedRoute: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        <Content style={{ overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProtectedRoute;
