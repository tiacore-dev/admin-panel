import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar/navbar";
import { Breadcrumbs } from "./components/breadcrumbs/breadcrumbs";

const ProtectedRoute: React.FC = () => {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
