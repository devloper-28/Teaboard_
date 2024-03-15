import { useEffect } from "react";
import Modals from "../../components/common/Modal";
import CreatePlantationDistrictMaster from "./CreatePlantationDistrictMaster";

function CreatePlantationDistrictMasterModal({ open, setOpen, modalRight }) {
  console.log(modalRight, "districtmodal");

  return (
    <>
      <Modals
        title={"Plantation District Master"}
        show={
          open === "createPlantationDistrictMaster" ||
          open === "editingPlantationData"
        }
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreatePlantationDistrictMaster
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

export default CreatePlantationDistrictMasterModal;
