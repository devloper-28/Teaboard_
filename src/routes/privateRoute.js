import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import ChangePassword from "../pages/auth/ChangePassword";
import Layout from "../components/layout/mainLayout/Layout";
import Sidebar from "../components/sidebar/Sidebar";

// Import Routes all

const PrivateRoutes = () => {
  return sessionStorage.getItem("argument1") ? (
    sessionStorage.getItem("isLogged") === "1" ? (
      <>
        <Navigate to="change-password" />
        <ChangePassword />
      </>
    ) : (
      <>
        {/* <Navigate to="dashboard" /> */}
        <Outlet />
      </>
    )
  ) : (
    <Navigate to="login" />
  );
};

export default PrivateRoutes;
