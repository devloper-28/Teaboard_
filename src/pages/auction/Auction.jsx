/* eslint-disable jsx-a11y/anchor-has-content */

/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import HeaderUI from "../../components/layout/header/Header";
import TableComponent from "../../components/tableComponent/TableComponent";
import AuctionData from "../../constants/Datas";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import "./Modal.css";
import { Accordion } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ICON } from "../../assets/images";
import { useSelector } from "react-redux";
import AccordionItem from "../../components/accordian/AccordianItem";
import ModalTable from "../../components/modaltable/ModalTable";
import CalenderComponent from "../../components/common/FormComponent/calender/CalenderComponent";
import { Button, Modal } from "react-bootstrap";

// const BooleanTypeProvider = (props) => (
//   <DataTypeProvider
//     formatterComponent={({ value }) => (
//       <span className="badge badge-secondary">{value ? "Active" : "No"}</span>
//     )}

//     {...props}
//   />
// );

const StatusList = ({ value }) => (
  <span className="badge badge-secondary w-100">{value}</span>
);

// const Lotno = ({ value }) => (
//   <span className="badge badge-secondary w-100 ">{value}</span>
// );
const updatedData = [
  { name: "LotNo" },
  { name: "Origin" },
  { name: "Type" },
  { name: "Subtype" },
  { name: "Ctgry" },
  { name: "Mark" },
  { name: "Grade" },
  { name: "Pkgs" },
  { name: "BasePrice" },
  { name: "Bidder" },
  { name: "Status" },
  { name: "Ntwt" },
  { name: "Grwt" },
  { name: "Total Ntwt" },
  { name: "Per. of Mfg" },
  { name: "PkgCmnts" },
  { name: "LotType" },
  { name: "GPNo" },
  { name: "GPDate" },
  { name: "Inv. No" },
  { name: "LSP/SP" },
  { name: "PriceIncrement" },
  { name: "PkgNo" },
  { name: "WarehouseName" },
  { name: "Increment" },
  { name: "Garden" },
  { name: "Special" },
  { name: "Quality" },
  { name: "Colour of" },
  { name: "Age of" },
  { name: "Brewers" },
  { name: "NumofBidders" },
  { name: "Active Since" },
  { name: "Price" },
  { name: "My" },
  { name: "Confirm" },
  { name: "IN" },
  { name: "OUT" },
];
const fixedColumn = [
  { name: "LotNo" },
  { name: "Origin" },
  { name: "Type" },
  { name: "Subtype" },
  { name: "Ctgry" },
  { name: "Mark" },
  { name: "Grade" },
  { name: "Pkgs" },
  { name: "BasePrice" },
  { name: "Bidder" },
  { name: "Status" },
  { name: "Ntwt" },
  { name: "Grwt" },
  { name: "Total Ntwt" },
  { name: "Per. of Mfg" },
  { name: "PkgCmnts" },
  { name: "LotType" },
  { name: "GPNo" },
  { name: "GPDate" },
  { name: "Inv. No" },
  { name: "LSP/SP" },
  { name: "PriceIncrement" },
  { name: "PkgNo" },
  { name: "WarehouseName" },
  { name: "Increment" },
  { name: "Garden" },
  { name: "Special" },
  { name: "Quality" },
  { name: "Colour of" },
  { name: "Age of" },
  { name: "Brewers" },
  { name: "NumofBidders" },
  { name: "Active Since" },
  { name: "Price" },
  { name: "My" },
  { name: "Confirm" },
  { name: "IN" },
  { name: "OUT" },
];

const Auction = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const activeClass = useSelector((state) => state.toggle.activeClass);

  const [columns, setColumns] = useState(
    updatedData?.map((item) => ({ ...item, title: item.name }))
  );
  const [fixedColumns, setFixedColumns] = useState(
    fixedColumn?.map((item) => ({ ...item, title: item.name }))
  );

  const [selectedColumns, setSelectedColumns] = useState(
    updatedData?.map((item) => ({
      ...item,
      name: item.name,
      checked: fixedColumns?.map((ele) => ele.name).includes(item.name), // Assign either true or false as desired
    }))
  );

  const [leftNo, setLeftNo] = useState(0);
  const [rightNo, setRightNo] = useState(0);
  const [stickyInput, setStickyInput] = useState({
    leftNo: 0,
    rightNo: 0,
  });
  const [dataMenu, setdataMenu] = useState(false);

  const [tableColumnExtensions] = useState([
    { columnName: "LotNo", width: 125 },
    { columnName: "Session Period" },
    { columnName: "Session Status" },
    { columnName: "Session Type" },
  ]);

  const handleStickySubmit = () => {
    setRightNo(stickyInput.rightNo);
    setLeftNo(stickyInput.leftNo);
    setShow(false);
  };

  const lastIndex = fixedColumns?.map((ele) => ele);
  lastIndex.reverse();

  const [rows, setRows] = useState(AuctionData);

  const [leftColumns, setLeftColumns] = useState([]);
  const [rightColumns, setRightColumns] = useState([]);

  useEffect(() => {
    const leftColumnsArray =
      Number.isInteger(leftNo) && leftNo >= 0
        ? [...Array(leftNo)]?.map((_, index) => fixedColumns[index].name)
        : [];
    setLeftColumns(leftColumnsArray);
  }, [leftNo, fixedColumns]);

  useEffect(() => {
    const rightColumnsArray =
      Number.isInteger(rightNo) && rightNo >= 0
        ? [...Array(rightNo)]?.map((_, index) => lastIndex[index].name)
        : [];
    setRightColumns(rightColumnsArray);
  }, [rightNo, fixedColumns]);

  const custmizeColumn = [
    {
      column:
        Number.isInteger(leftNo) && leftNo >= 0
          ? [...Array(leftNo)]?.map((_, index) => fixedColumns[index].name)
          : [],
      functionName: (props) => (
        <DataTypeProvider formatterComponent={StatusList} {...props} />
      ),
    },
    {
      column:
        Number.isInteger(rightNo) && rightNo >= 0
          ? [...Array(rightNo)]?.map((_, index) => lastIndex[index].name)
          : [],
      functionName: (props) => (
        <DataTypeProvider formatterComponent={StatusList} {...props} />
      ),
    },
  ];
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Table Setting</Modal.Title>
          <i className="fa fa-times CloseModal" onClick={handleClose}></i>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="FomrGroup">
                <label>Left Column</label>
                <input
                  type="text"
                  className="form-control"
                  min={0}
                  max={5}
                  value={stickyInput.leftNo >= 0 ? stickyInput.leftNo : ""}
                  onChange={(e) =>
                    setStickyInput({
                      ...stickyInput,
                      leftNo:
                        e.target.value <= 5 ? parseFloat(e.target.value) : "",
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="FomrGroup">
                
                <label>Right Column</label>
                <input
                  type="text"
                  className="form-control"
                  value={stickyInput.rightNo >= 0 ? stickyInput.rightNo : ""}
                  min={0}
                  max={columns.length}
                  onChange={(e) =>
                    setStickyInput({
                      ...stickyInput,
                      rightNo:
                        e.target.value <= 5 ? parseFloat(e.target.value) : "",
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="FomrGroup">
                <label>Select Column</label>
                <select className="form-control select-form">
                  <option value="">LotNo</option>
                  <option value="">Origin</option>
                  <option value="">Type</option>
                  <option value="">Subtype</option>
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="SubmitBtn" onClick={() => handleStickySubmit()} >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={activeClass ? "active MainComponent" : "MainComponent "}>
        <div className="container-fluid">
          <div className="AuctionScreen">
            {/* <div>
              <input
                min={0}
                max={5}
                value={leftNo >= 0 ? leftNo : ""}
                onChange={(e) =>
                  setLeftNo(
                    e.target.value <= 5 ? parseFloat(e.target.value) : ""
                  )
                }
              />
              <input
                value={rightNo >= 0 ? rightNo : ""}
                min={0}
                max={columns.length}
                onChange={(e) =>
                  setRightNo(
                    e.target.value <= 5 ? parseFloat(e.target.value) : ""
                  )
                }
              />
            </div> */}

            <div className="TabsMenu">
              <ul>
                <li
                  className={`${activeTab === 1 ? "active" : ""}`}
                  onClick={() => handleTabClick(1)}
                >
                  Auctioneer Catalog
                </li>
                <li
                  className={`${activeTab === 2 ? "active" : ""}`}
                  onClick={() => handleTabClick(2)}
                >
                  Summary
                </li>
                <li
                  className={`${activeTab === 3 ? "active" : ""}`}
                  onClick={() => handleTabClick(3)}
                >
                  My Catalog
                </li>
                <li
                  className={`${activeTab === 4 ? "active" : ""}`}
                  onClick={() => handleTabClick(4)}
                >
                  My Planner
                </li>
              </ul>
              <a
                className="TableSetting"
                onClick={() => {
                  setShow(true);
                }}
              >
                <i className="fa fa-wrench" aria-hidden="true"></i>
              </a>
            </div>

            <div className="LiveAuction">
              <div className={`TableBox ${dataMenu == true ? "active" : ""}`}>
                <TableComponent
                  columns={selectedColumns}
                  updatedData={updatedData}
                  setColumns={setColumns}
                  rows={rows}
                  setRows={setRows}
                  leftColumns={leftColumns}
                  rightColumns={rightColumns}
                  tableColumnExtensions={tableColumnExtensions}
                  custmize={custmizeColumn}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  selectedColumns={selectedColumns}
                  setSelectedColumns={setSelectedColumns}
                  dragdrop={true}
                  fixedColumnsOn={true}
                  resizeingCol={true}
                  sorting={false}
                />
              </div>

              <div
                className={`LiveAuctionMenu ${
                  activeTab === 2 ? "active " : ""
                } ${activeClass && "ShowSideBar"}`}
              >
                {activeTab === 2 && (
                  <div className="Summery">
                    <span
                      className="Close"
                      onClick={() => {
                        setdataMenu(false);
                      }}
                    >
                      x
                    </span>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="Shadow">
                          <div className="Title">Summary of Tea Sold</div>
                          <div className="TableBox">
                            {/* <TableComponent
                              columns={selectedColumns}
                              updatedData={updatedData}
                              setColumns={setColumns}
                              rows={rows}
                              setRows={setRows}
                              leftColumns={leftColumns}
                              rightColumns={rightColumns}
                              tableColumnExtensions={tableColumnExtensions}
                              custmize={custmizeColumn}
                              fixedColumns={fixedColumns}
                              setFixedColumns={setFixedColumns}
                              selectedColumns={selectedColumns}
                              setSelectedColumns={setSelectedColumns}
                            /> */}
                            <ModalTable />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="Shadow">
                          <div className="Title">
                            Auctioneer Market Summaryd{" "}
                          </div>
                          <ul className="AuctioneerList">
                            <li>GPT</li>
                            <li>RCP</li>
                            <li>PTM</li>
                            <li>ABL</li>
                            <li>CBL</li>
                            <li>JTC</li>
                            <li>PIP</li>
                            <li>ATB</li>
                            <li>GPT</li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="Shadow">
                          <div className="Title">Market Summary </div>
                          <div className="TableBox">
                            <ModalTable />
                            {/* <TableComponent
                              columns={selectedColumns}
                              updatedData={updatedData}
                              setColumns={setColumns}
                              rows={rows}
                              setRows={setRows}
                              leftColumns={leftColumns}
                              rightColumns={rightColumns}
                              tableColumnExtensions={tableColumnExtensions}
                              custmize={custmizeColumn}
                              fixedColumns={fixedColumns}
                              setFixedColumns={setFixedColumns}
                              selectedColumns={selectedColumns}
                              setSelectedColumns={setSelectedColumns}
                            /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 1 && <div>Content for Tab 1</div>}
                {activeTab === 3 && <div>Content for Tab 3</div>}
                {activeTab === 4 && <div>Content for Tab 4</div>}
              </div>
            </div>
          </div>
        </div>{" "}
      </div>{" "}
    </>
  );
};

export default Auction;
