import Modals from "../../../components/common/Modal";
import TransferDealBook from "./transferDealBook";

function TransferDealBookModal({ open, setOpen, modalRight }) { 
  return (
    <>
      <Modals
        title = "Transfer Deal Book "
        show={open === "transferDealBookModal"}
        handleClose={() => setOpen("")}
        size="xl"
      >          
           <TransferDealBook modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>
        
      </Modals>   
    </>
  );
}

export default TransferDealBookModal;
