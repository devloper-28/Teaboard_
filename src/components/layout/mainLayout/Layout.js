import React from "react";
import Sidebar from "../../sidebar/Sidebar";

function Layout(props) {
  return (
    <>
      <Sidebar />
      <div>{props.children}</div>
    </>
  );
}

export default Layout;
