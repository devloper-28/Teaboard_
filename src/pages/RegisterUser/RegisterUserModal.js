import Modals from "../../components/common/Modal";
import RegisterUser from "./RegisterUser";

function RegisterUserModal({ open, setOpen ,modalRight}) {
  console.log(modalRight,"modalRightmodalRight123")
  return (
    <>
      <Modals
        title={"Register User"}
        show={open === "registerUser"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <RegisterUser modalRight={modalRight} />
      </Modals>
    </>
  );
}

export default RegisterUserModal;
