import Modals from "../../components/common/Modal";
import ManageRole from "./ManageRoles";

function ManageRolesModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Manage Roles"}
        show={open === "manageRole"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ManageRole />
      </Modals>
    </>
  );
}

export default ManageRolesModal;
