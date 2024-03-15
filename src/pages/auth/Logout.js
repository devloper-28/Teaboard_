import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.getItem("argument1")
      ? navigate("dashboard")
      : navigate("login");
  });
}

export default Logout;
