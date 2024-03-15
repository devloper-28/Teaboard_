import Modals from "../../components/common/Modal";
import UserRegistration from "./UserRegistration";

function UserRegistrationModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"TEABOARD User Registration"}
        show={open === "userRegistartion" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <UserRegistration />
      </Modals>
    </>
  );
}

export default UserRegistrationModal;
