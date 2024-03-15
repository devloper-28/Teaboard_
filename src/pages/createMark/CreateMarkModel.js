import Modals from "../../components/common/Modal";
import CreateMark from "./CreateMark";

function CreateMarkModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Create Mark"}
        show={open === "CreateMark" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateMark
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

export default CreateMarkModal;
