import React, { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import { Accordion } from "react-bootstrap";
import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreatePlannerfrom from "./CreatePlannerfrom";

function CreatePlanner({
  openMyPlanner,
  setOpenMyPlanner,
  myCatalogDetails,
  isEdit,
  editData,
  saleProgramId,
  sessionTypeId,
  modalRight,
  baseUrlEngBuyer,
}) {
  return (
    <div className="invoice-modal">
      {openMyPlanner && (
        <Modal
          size="xl"
          title="Create My Planner"
          show={openMyPlanner}
          handleClose={() => setOpenMyPlanner(false)}
        >
          <CreatePlannerfrom
            myCatalogDetails={myCatalogDetails}
            isEdit={isEdit}
            editData={editData}
            saleProgramId={saleProgramId}
            sessionTypeId={sessionTypeId}
            modalRight={modalRight}
            baseUrlEngBuyer={baseUrlEngBuyer}
          />
        </Modal>
      )}
    </div>
  );
}

export default CreatePlanner;
