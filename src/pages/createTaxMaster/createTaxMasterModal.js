import Modals from "../../components/common/Modal";
import CreateTaxMaster from "./createTaxMaster";

function CreateTaxMasterModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Tax Master"}
        handleClose={() => setOpen("")}
        show={open === "createTaxMaster" || open === "editingTaxData"}
        size="xl"
      >
        <CreateTaxMaster
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

export default CreateTaxMasterModal;
