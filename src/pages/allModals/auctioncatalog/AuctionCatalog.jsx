/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// import Modal from "../../../components/common/Modal";
import { Accordion } from "react-bootstrap";
import {
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuctionCatalogfrom from "./AuctionCatalogform";
import { Suspense } from "react";
const Modal = React.lazy(() => import("../../../components/common/Modal"));

function AuctionCatalog({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="invoice-modal">
      {open && (
        <Suspense fallback={<CircularProgress color="success" />}>
          <Modal
            size="xl"
            title="Auction Catalog"
            show={
              open === "auctioncatalog" || open === "auctioncatalogBuyer"
                ? true
                : false
            }
            handleClose={() => setOpen("")}
          >
            <AuctionCatalogfrom modalRight={modalRight} />
          </Modal>
        </Suspense>
      )}
    </div>
  );
}

export default AuctionCatalog;
