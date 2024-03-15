import Modals from "../../components/common/Modal";
import ToaUserRegistration from "./CreateToaUserRegistration";

function ToaUserRegistrationModel({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"TAO User Registration"}
        show={open === "toauserRegistration"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ToaUserRegistration
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

export default ToaUserRegistrationModel;
