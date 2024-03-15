import Modals from "../../components/common/Modal";
import CreateGrade from "./CreateGrade";

function CreateGradeModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Grade Master"}
        show={open === "createGrade" || open === "editingGradeData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateGrade
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

export default CreateGradeModal;
