import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";

// import PreAuctionStatusReport from "../../pages/allModals/preAuctionStatusReport/preAuctionStatusReport";

const AccordionItem = ({
  title,
  content,
  handleAccordionItemClick,
  setModalNames,
  index,
  contentExpand,
  setModalRight,
}) => {
  // const [expandedTab, setExpandedTab] = useState("Master");
  // const handleAccordionChange = (panel) => (_, isExpanded) => {
  //   setExpandedTab(isExpanded ? panel : null);
  //   // setDisable(false);
  //   // setIsEdit(false);
  //   console.log(panel === title);
  // };
  const moduleList = useSelector(
    (state) => state?.ModuleReducer?.data?.responseData
  );

  const handleItemClick = (ele) => {
    console.log(ele, content, moduleList, "===>");

    setModalNames(ele?.name);
    setModalRight(ele?.rightIds);
  };
  // updated in dharmik
  return (
    <>
      <Accordion
        expanded={contentExpand?.at(index)}
        onChange={(e) =>
          handleAccordionItemClick(e.target.textContent.toString())
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {Array.isArray(content) ? (
              <ul className="SideMenu">
                {content?.map((ele, index) => (
                  <li className="text-capitalize" key={index}>
                    <div onClick={() => handleItemClick(ele)}>{ele?.title}</div>
                  </li>
                ))}
              </ul>
            ) : null}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionItem;
