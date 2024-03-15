import React from "react";
import Modals from "../../components/common/Modal";
import CreateStateMaster from "./CreateStateMaster";

function CreateStateMasterModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"State Master"}
        show={open === "createStateMaster" || open === "editingStateData"}
        size="xl"
        handleClose={() => setOpen("")}
      >
        <CreateStateMaster
          modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }
        />
      </Modals>
    </>
  );
}

export default CreateStateMasterModal;
