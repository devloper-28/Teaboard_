import Modals from "../../components/common/Modal";
import CreateTeaType from "./CreateTeaType";

function CreateTeaTypeModal({ open, setOpen, modalRight }) {
  const handleClose = () => {
    setOpen("");
  };
  return (
    <>
      <Modals
        title={"Tea Type Master"}
        show={open === "createTeaType" || open === "editingTeaTypeData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateTeaType
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

export default CreateTeaTypeModal;
