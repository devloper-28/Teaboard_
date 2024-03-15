import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import ModalForm from "./modal/Modal";

function Invoice({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );
  console.log(modalRight, "modalRightmodalRightmodalRight");

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Invoice Details"
          show={open === "invoice" ? true : false}
          handleClose={() => setOpen("")}
        >
          <ModalForm
            dataList={dataList}
            setDataList={setDataList}
            setOpen={setOpen}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default Invoice;
