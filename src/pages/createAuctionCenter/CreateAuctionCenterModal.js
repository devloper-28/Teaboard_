import React from "react";
import Modals from "../../components/common/Modal";
import CreateAuctionCenter from "./CreateAuctionCenter";

function CreateAuctionCenterModal({ open, setOpen, modalRight }) {
  const handleClose = () => {
    setOpen("");
  };

  return (
    <>
      <Modals
        title={"Auction Center Master"}
        show={
          open === "createAuctionCenterModal" ||
          open === "editingAuctionCenterDataModal"
        }
        handleClose={handleClose}
        size="xl"
      >
        <CreateAuctionCenter
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

export default CreateAuctionCenterModal;
