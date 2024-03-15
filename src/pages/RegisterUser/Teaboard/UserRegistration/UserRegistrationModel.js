import Modals from "../../components/common/Modal";
import UserRegistration from "./UserRegistration";

function UserRegistrationModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"TEABOARD User Registration"}
        show={open === "userRegistartion" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <UserRegistration
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

export default UserRegistrationModal;
