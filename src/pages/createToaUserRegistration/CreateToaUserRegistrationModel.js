import Modals from "../../components/common/Modal";
import ToaUserRegistration from "./CreateToaUserRegistration";

function ToaUserRegistrationModel({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"TAO User Registration"}
        show={open === "toauserRegistration"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ToaUserRegistration />
      </Modals>
    </>
  );
}

export default ToaUserRegistrationModel;
