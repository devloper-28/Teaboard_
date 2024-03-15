import Modals from "../../../components/common/Modal";
import ViewDealBookAuctioneer from "./viewDealBookAuctioneer";
import ViewDealBookBuyer from "./viewDealBookBuyer";
import ViewDealBookTao from "./ViewDealBookTao";

function ViewDealBookModal({ open, setOpen, modalRight }) {
  const userRole = atob(sessionStorage.getItem('argument6'));
  
 
  return (
    <>
      <Modals
        title = {userRole === 'TAOUSER' ? 'View Deal Book TAO' : userRole === 'BUYER' ? 'View Deal Book Buyer' : userRole === 'AUCTIONEER' ? 'View Deal Book Auctioneer': 'View Deal Book'}
        show={open === "viewDealBookModal"}
        handleClose={() => setOpen("")}
        size="xl">          
          {userRole === "TAOUSER" && <ViewDealBookTao modalRight={
          open === "createAuctionCenter" ||
          (open === "editingAuctionCenterData" || modalRight?.length > 0
            ? modalRight
            : [])
        }/>}
          {userRole === "BUYER" && <ViewDealBookBuyer modalRight={
          open === "createAuctionCenter" ||
          (open === "editingAuctionCenterData" || modalRight?.length > 0
            ? modalRight
            : [])
        }/>}
          {userRole === "AUCTIONEER" && <ViewDealBookAuctioneer modalRight={
          open === "createAuctionCenter" ||
          (open === "editingAuctionCenterData" || modalRight?.length > 0
            ? modalRight
            : [])
        }/>}
      </Modals>   
    </>
  );
}

export default ViewDealBookModal;
