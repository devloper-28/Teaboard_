import Modals from "../../components/common/Modal";
import CreateSubTeaType from "./CreateSubTeaType";

function CreateSubTeaTypeModal({ open, setOpen, modalRight }) {
  const handleClose = () => {
    setOpen("");
  };

  return (
    <>
      <Modals
        title={"Sub TeaType Master"}
        show={open === "createSubTeaType" || open === "editingSubTeaTypeData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateSubTeaType
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

export default CreateSubTeaTypeModal;
