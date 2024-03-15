/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import { Accordion } from "react-bootstrap";
import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuctionCatalogfrom from "../../allModals/prsAuctionCatalog/AuctionCatalogform"

function AuctionCatalog({ open, setOpen }) {
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
        <Modal
          size="xl"
          title="Auction Catalog"
          show={open === "auctioncatalog" ? true : false}
          handleClose={() => setOpen("")}
        >
          <AuctionCatalogfrom />
        </Modal>
      )}
    </div>
  );
}

export default AuctionCatalog;
