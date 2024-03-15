import Modals from "../../components/common/Modal";
import BuyerTaxInvoice from "./buyerTaxInvoice";

function BuyerTaxInvoiceModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Generate Buyer Tax Invoice"}
        show={open === "buyerTaxInvoice"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <BuyerTaxInvoice
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

export default BuyerTaxInvoiceModal;
