import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import CreateFactoryType from "./CreateFactoryType";

function CreateFactoryTypeModal({ open, setOpen , modalRight}) {
  return (
    <>
      <Modals
        title={"Factory Type"}
        show={open === "createFactoryType" || open === "editingFactoryTypeData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateFactoryType  modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>
      </Modals>
    </>
  );
}

export default CreateFactoryTypeModal;
