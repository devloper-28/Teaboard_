import Modals from "../../components/common/Modal";
import CreatepackageSize from "./CreatepackageSize";

function CreatepackageSizeModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Create Package Size"}
        show={open === "CreatepackageSize" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreatepackageSize
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

export default CreatepackageSizeModal;
