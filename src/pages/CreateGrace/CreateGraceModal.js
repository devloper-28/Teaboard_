import Modals from "../../components/common/Modal";
import CreateGrace from "./CreateGrace";

function CreateGraceModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Create Grace"}
        show={open === "CreateGrace" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateGrace
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

export default CreateGraceModal;
