import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./components/navbar/navbar";
import { Breadcrumbs } from "./components/breadcrumbs/breadcrumbs";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);
  //
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
