import React, { useState } from "react";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";
import { Button } from "react-bootstrap";
import axios from "axios";
import CustomToast from "../../../../../components/Toast";
import axiosMain from "../../../../../http/axios/axios_main";

const MenualPublishDataTable = ({
  menualPublishrows,
  setMenualPublishRows,
  otherData,
  setOpenMenualValuation,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  const handleCheckboxChange = (auctionSessionDetailId) => {
    // Check if the row is already selected
    if (selectedRows.includes(auctionSessionDetailId)) {
      // If selected, remove it from the selected rows
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== auctionSessionDetailId)
      );
    } else {
      // If not selected, add it to the selected rows
      setSelectedRows((prevSelectedRows) => [
        ...prevSelectedRows,
        auctionSessionDetailId,
      ]);
    }
  };

  const handleMasterCheckboxChange = () => {
    // If all rows are selected, deselect all. If not, select all.
    if (selectedRows.length === menualPublishrows.length) {
      setSelectedRows([]);
    } else {
      // Extract unique auctionSessionDetailIds from rows and set as selected
      const uniqueIds = menualPublishrows.map(
        (item) => item.auctionSessionDetailId
      );
      setSelectedRows(uniqueIds);
    }
  };

  return (
    <div>
      <table
        className="table table-responsive w-100"
        style={{ border: "none" }}
      >
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === menualPublishrows.length}
                onChange={handleMasterCheckboxChange}
              />
            </th>
            <th>Name</th>
            <th>TeaType</th>
            <th>Category</th>
            <th>Sale Date</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>No Of Lots</th>
            <th>Minimum Bid Time</th>
            <th>Status</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {menualPublishrows?.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.auctionSessionDetailId)}
                  onChange={() =>
                    handleCheckboxChange(item.auctionSessionDetailId)
                  }
                />
              </td>
              {Object.keys(menualPublishrows?.at(0))
                ?.filter((ele) => ele !== "auctionSessionDetailId")
                ?.map((value, subIndex) => (
                  <td key={subIndex}>{item[value]}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <Button
          className="btn mt-3"
          onClick={() => {
            let data = {
              auctionSessionDetailIds: selectedRows.join(","),
              saleNo: otherData.saleNo,
              season: otherData.season?.toString(),
              auctionCenterId: auctionCenterId,
              userId: userId,
            };
            // axiosMain
            //   .post(
            //     "/preauction/KutchaCatalogue/GetPendingSessionsForManualPublish?role=" +
            //       roleCode,
            //     data
            //   )
            axiosMain
              .post(
                `/preauction/KutchaCatalogue/ManualPublishCatalog?role=` +
                  roleCode,
                data
              )
              .then((res) => {
                if (res.data.statusCode === 200) {
                  setOpenMenualValuation(false);
                  // setMenualPublishRows(res.data.responseData);
                  CustomToast.success(res.data.message);

                } else {
                  CustomToast.warning(res.data.message);
                }
              });
          }}
        >
          Publish
        </Button>
      </div>
      {/* <div>
        <p>Selected Rows: {selectedRows.join(", ")}</p>
      </div> */}
    </div>
  );
};

export default MenualPublishDataTable;
