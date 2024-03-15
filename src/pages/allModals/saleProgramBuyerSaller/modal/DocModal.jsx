import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TableComponent from "../../../../components/tableComponent/TableComponent";
const handleDownload = (documentName, documentBytes ) => {
  // Decode base64 encoded documentBytes
  const decodedBytes = atob(documentBytes);

  // Create a Blob from the decoded bytes
  const blob = new Blob([
    new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
  ]);

  // Create an object URL from the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a hidden anchor element
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = blobUrl;
  anchor.download = documentName;

  // Append anchor to the body
  document.body.appendChild(anchor);

  // Programmatically click the anchor element
  anchor.click();

  // Clean up: remove the anchor and revoke the object URL
  document.body.removeChild(anchor);
  URL.revokeObjectURL(blobUrl);
};


const DocModal = ({
  show,
  data,
  onHide,
  onDelete,
  setRemark,
  remarkShow,
  title,
}) => {
  const column = [
  
    { name: "srNo", title: "Sr No." },
    { name: "documentName", title: "Document Name" },
    // { name: "documentPath", title: "" },,
    { name: "documentBrief", title: "Document Brief" },
    { name: "DocumentSize", title: "Document Size" },
    { name: "DateAndTime", title: "Date And Time" },
    
   
    { name: "status", title: "Status",
    getCellValue: ({ status }) => {
      switch (status) {
        case 0: {
          return "Pending";
        }
        case 1: {
          return "Active";
        }
        case 2: {
          return "Cancelled";
        }
        default:
          return "-";
      }
    } },
    {
      title: "Action",
      name: "Action",
      getCellValue: ({ ...row }) => (
        <>
          {/* <button
            type="button"
            onClick={() => {
              // setmodalRowData(row);
             
            }}
          >
            View Doc
          </button> */}
          {row.documentBytes!==""?(
            <span
            onClick={() => {
              console.log(row,"ssss")
              handleDownload(row.documentName,row.documentBytes);
            }}
          >
            <i className="fa fa-download"></i>
          </span>
          ):("")}
          
        </>
      ),
    },
  ];
  const [remark] = useState(remarkShow ? remarkShow : true);
  const handleDelete = (e) => {
    onDelete(e); // Perform actual delete action
  };

  return (
    <Modal show={show} data={data} onHide={onHide} animation={true} className="CustomModal">
      <form>
        <Modal.Header>
          <Modal.Title>Documents</Modal.Title>
          <i className="fa fa-times CloseModal"  onClick={onHide}></i>
        </Modal.Header>
        <Modal.Body>
          <h3>{title}</h3>
          <div>
                <TableComponent
                  columns={column}
                  rows={data?.length > 0 ? data : []}
                  // setRows={setRows}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                />
              </div>

          <div className="BtnGroup">
          <Button  onClick={onHide} className="SubmitBtn">
            Cancle
          </Button>
          {/* <Button  type={"submit"} className="SubmitBtn" onClick={handleDelete}>
            Delete
          </Button> */}
          </div>
         
        </Modal.Body>
         
          
      </form>
    </Modal>
  );
};

export default DocModal;
