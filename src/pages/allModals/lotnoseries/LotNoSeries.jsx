import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import ModalForm from "./modal/Modal";

function LotNoSeries({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Lot No Series"
          show={open === "lotnoseries" ? true : false}
          handleClose={() => setOpen("")}
        >
          <ModalForm
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default LotNoSeries;
