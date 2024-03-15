import React, { useEffect, useState } from "react";
import { getAllContactLinkAction } from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import TableComponent from "../../components/tableComponent/TableComponent";
import { AccordionDetails, Typography } from "@mui/material";
const SupportLink = () => {
  const getContactLinkData = useSelector(
    (state) => state.ContactLink.getAllContactLink.responseData
  );

  const dispatch = useDispatch();

  const [rows, setRows] = useState(getContactLinkData);

  useEffect(() => {
    dispatch(getAllContactLinkAction());
  }, [dispatch]);

  useEffect(() => {
    setRows(getContactLinkData);
  }, [getContactLinkData]);
  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center Name",
    },
    {
      name: "name",
      title: "Name",
    },
    {
      name: "contactNo",
      title: "Contact No",
    },
    {
      name: "emailId",
      title: "E-mail id",
    },
  ];
  return (
    <>
      <AccordionDetails>
        <Typography>
          <div className="row">
            <div className="col-lg-12 mt-4">
              <div className="TableBox CreateStateMaster">
                <TableComponent
                  columns={columns}
                  rows={
                    rows?.length > 0
                      ? rows?.map((row, index) => ({
                          ...row,
                          index: index + 1,
                        }))
                      : []
                  }
                  setRows={setRows}
                  sorting={true}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                />
              </div>
            </div>
          </div>
        </Typography>
      </AccordionDetails>
    </>
  );
};

export default SupportLink;
