import Modals from "../../components/common/Modal";

import CreateCategory from "./CreateCategory";

function CreateCategoryModal({ open, setOpen, modalRight }) {
  const handleClose = () => {
    setOpen("");
  };
  return (
    <>
      <Modals
        title={"Category Master"}
        show={open === "createCategory" || open === "editingCategoryData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateCategory
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

export default CreateCategoryModal;
