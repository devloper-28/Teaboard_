import Modals from "../../components/common/Modal";
import CreatepackageType from "./CreatepackageType";

function CreatepackageTypeModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Create Package Type"}
        show={open === "CreatepackageType" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreatepackageType
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

export default CreatepackageTypeModal;
