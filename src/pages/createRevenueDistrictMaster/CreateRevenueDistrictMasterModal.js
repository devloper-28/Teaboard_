import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import CreateRevenueDistrictMaster from "./CreateRevenueDistrictMaster";

function CreateRevenueDistrictMasterModal({ open, setOpen, modalRight }) {
  console.log(modalRight, "modalRightmodalRightmodalRight");
  return (
    <>
      <Modals
        title={"Revenue District Master"}
        show={
          open === "createRevenueDistrictMaster" ||
          open === "editingRevenueData"
        }
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateRevenueDistrictMaster
          modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }
        />
      </Modals>
    </>
  );
}

export default CreateRevenueDistrictMasterModal;
