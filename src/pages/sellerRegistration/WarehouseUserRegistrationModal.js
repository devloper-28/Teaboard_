import Modals from "../../components/common/Modal";
import SellerRegistration from ".";



function WarehouseUserRegistrationModal({ open, setOpen }) {

  return (
    <>
      <Modals
        title={"Seller Registration"}
        show={open === "sellerRegistration"}
        handleClose={() => setOpen("")}
        size="md"
      >
        <SellerRegistration/>
      </Modals>

    
    </>
  );
}

export default WarehouseUserRegistrationModal;
