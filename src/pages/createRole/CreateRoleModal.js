import Modals from "../../components/common/Modal";
import CreateRole from "./CreateRole";

function CreateRoleModal({ open, setOpen, modalRight }) {

  return (
    <>
      <Modals
        title={"Role Master"}
        show={open === "createRole" || open === "editingRoleData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateRole  modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>
      </Modals>

    
    </>
  );
}

export default CreateRoleModal;
