import Modals from "../../components/common/Modal";
import CreateSpuMasterDetail from "./createSpuMaster";

function CreateSpuMasterDetailModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Spu Master"}
        handleClose={() => setOpen("")}
        show={open === "createSpuMaster" || open === "editingSpuData"}
        size="xl"
      >
        <CreateSpuMasterDetail
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

export default CreateSpuMasterDetailModal;
