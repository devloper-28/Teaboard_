import Modals from "../../../components/common/Modal";
import RejectWarehouseBill from "./rejectWarehouseBill";
 

function RejectWarehouseBillModal({ open, setOpen }) {
 
  return (
    <>
      <Modals
        title = "Reject Warehouse Bill"
        show={open === "rejectWarehouseBill"}
        handleClose={() => setOpen("")}
        size="xl"
      >          
        <RejectWarehouseBill/>
      </Modals>   
    </>
  );
}

export default RejectWarehouseBillModal;
