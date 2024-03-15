import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import GroupMasterModalForm from "./modal/GroupMasterModal";

function GroupMaster({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Group Master"
          show={open === "groupMaster" ? true : false}
          handleClose={() => setOpen("")}
        >
          <GroupMasterModalForm
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default GroupMaster;
