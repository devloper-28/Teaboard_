import React, { useEffect, useState } from "react";
import { getAllSupportLinkAction } from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import TableComponent from "../../components/tableComponent/TableComponent";
import { AccordionDetails, Typography } from "@mui/material";
const ContactLink = () => {
  const getSupportLinkData = useSelector(
    (state) => state.ContactLink.getAllSupportLink.responseData
  );
  const dispatch = useDispatch();
  const [rows, setRows] = useState(getSupportLinkData);

  useEffect(() => {
    setRows(getSupportLinkData);
  }, [getSupportLinkData]);

  useEffect(() => {
    dispatch(getAllSupportLinkAction());
  }, [dispatch]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "supportOfficeName",
      title: "Support Office Name",
    },
    {
      name: "supportOfficeAddress",
      title: "Support Office Address",
    },
    {
      name: "supportFax",
      title: "Support Fax",
    },
    {
      name: "mobileNumber",
      title: "Mobile Number",
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

export default ContactLink;
