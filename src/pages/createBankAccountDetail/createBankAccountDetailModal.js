import Modals from "../../components/common/Modal";
import CreateBankAccountDetail from "./createBankAccountDetail";

function CreateBankAccountDetailModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Bank Account Detail"}
        handleClose={() => setOpen("")}
        show={open === "createBankAccountDetail" || open === "editingBankData"}
        size="xl"
      >
        <CreateBankAccountDetail
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

export default CreateBankAccountDetailModal;
