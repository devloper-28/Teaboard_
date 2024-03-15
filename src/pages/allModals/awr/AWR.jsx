import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import ModalForm from "./modal/Modal";

function Awr({ open, setOpen,modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="AWR"
          show={open === "awr" ? true : false}
          handleClose={() => setOpen("")}
        >
          <ModalForm dataList={dataList} modalRight={modalRight} setDataList={setDataList} />
        </Modal>
      )}
    </div>
  );
}

export default Awr;
