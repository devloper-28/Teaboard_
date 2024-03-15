import Modals from "../../components/common/Modal";
import ChangePwd from "./ChangePwd";

function ChangePwdModel({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Change Password"}
        show={open === "changePwd" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ChangePwd />
      </Modals>
    </>
  );
}

export default ChangePwdModel;
