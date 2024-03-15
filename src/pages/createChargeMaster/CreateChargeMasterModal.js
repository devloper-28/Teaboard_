import Modals from "../../components/common/Modal";

import CreateChargeMaster from "./CreateChargeMaster";

function CreateChargeMasterModal({ open, setOpen ,modalRight}) {
  const handleClose = () => {
    setOpen("");
  };
  return (
    <>
      <Modals
        title={"Charge Master"}
        show={open === "createChargeMaster" || open === "editingChargeData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateChargeMaster modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>
      </Modals>
    </>
  );
}

export default CreateChargeMasterModal;
