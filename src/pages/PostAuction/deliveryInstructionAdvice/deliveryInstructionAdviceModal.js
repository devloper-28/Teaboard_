import Modals from "../../../components/common/Modal";
import DeliveryInstructionAdviceAuctioneer from "./deliveryInstructionAdviceAuctioneer";
import DeliveryInstructionAdviceBuyer from "./deliveryInstructionAdviceBuyer";
import DeliveryInstructionAdviceWarehouse from "./deliveryInstructionAdviceWarehouse";
 

function DeliveryInstructionAdviceModal({ open, setOpen, modalRight }) {
  const userRole =atob(sessionStorage.getItem('argument6'));
 console.log('AAA',atob(sessionStorage.getItem('argument6')))
  return (
    <>
      <Modals
        title = {userRole === 'BUYER' ? 'Delivery Instruction Advice Buyer' : userRole === 'AUCTIONEER' ? 'Delivery Instruction Advice Auctioneer' : userRole === 'WAREHOUSE' ? 'Delivery Instruction Advice Warehouse': ''}
        show={open === "deliveryInstructionAdviceModal"}
        handleClose={() => setOpen("")}
        size="xl"
      >          
          {userRole === "WAREHOUSE" && <DeliveryInstructionAdviceWarehouse modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>}
          {userRole === "BUYER" && <DeliveryInstructionAdviceBuyer modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>}
          {userRole === "AUCTIONEER" && <DeliveryInstructionAdviceAuctioneer modalRight={
            open === "createAuctionCenter" ||
            (open === "editingAuctionCenterData" || modalRight?.length > 0
              ? modalRight
              : [])
          }/>}
      </Modals>   
    </>
  );
}

export default DeliveryInstructionAdviceModal;
