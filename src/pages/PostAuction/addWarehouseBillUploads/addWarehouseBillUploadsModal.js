import Modals from "../../../components/common/Modal";
import AddWarehouseBillUploads from "./addWarehouseBillUploads";
 

function AddWarehouseBillUploadsModal({ open, setOpen }) {
 
  return (
    <>
      <Modals
        title = "Warehouse Bill Uploads"
        show={open === "addWarehouseBillUploads"}
        handleClose={() => setOpen("")}
        size="xl"
      >          
        <AddWarehouseBillUploads/>
      </Modals>   
    </>
  );
}

export default AddWarehouseBillUploadsModal;
