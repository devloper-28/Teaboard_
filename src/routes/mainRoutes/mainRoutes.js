import React, { Suspense } from "react";
// import Login from "../../pages/auth/Login";
// import Auction from "../../pages/auction/Auction";
// import Dashboard from "../../pages/dashboard/Dashboard";
import Logout from "../../pages/auth/Logout";

//preauction
import SaleProgram from "../../pages/allModals/saleprogram/SaleProgram";

//SideBar
import Layout from "../../components/layout/mainLayout/Layout";
import ForgotPassword from "../../pages/auth/ForgetPassword";
import ChangePassword from "../../pages/auth/ChangePassword";
import ResetPassword from "../../pages/auth/ResetPassword";

import AuctionPage from "../../pages/auctionPage";
import { CircularProgress } from "@mui/material";
const Login = React.lazy(() => import("../../pages/auth/Login"));
const Dashboard = React.lazy(() => import("../../pages/dashboard/Dashboard"));
const Auction = React.lazy(() => import("../../pages/auction/Auction"));

const userRoutes = [
  {
    path: "dashboard",
    element: (
      <Layout>
        <Suspense fallback={<CircularProgress color="success" />}>
          <Dashboard />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "auction",
    element: (
      <Layout>
        <Auction />
      </Layout>
    ),
  },
  {
    path: "auctionPage/:type/:type/:type/:type",
    element: (
      <Layout>
        <Suspense fallback={<CircularProgress color="success" />}>
          <AuctionPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "change-password",
    element: (
      <Layout>
        <ChangePassword />
      </Layout>
    ),
  },
  {
    path: "sale-program",
    element: <SaleProgram />,
  },
];

const authRoutes = [
  {
    path: "*",
    element: <Logout />,
  },
  {
    path: "login",
    element: (
      <Suspense fallback="...">
        <Login />
      </Suspense>
    ),
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password/:usercode",
    element: <ResetPassword />,
  },
];

export { userRoutes, authRoutes };
