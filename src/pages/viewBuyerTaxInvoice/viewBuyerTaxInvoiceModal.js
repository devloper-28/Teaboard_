import Modals from "../../components/common/Modal";
import ViewBuyerTaxInvoice from "./viewBuyerTaxInvoice";

function BuyerTaxInvoiceModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"View Buyer Tax Invoice"}
        show={open === "ViewBuyerTaxInvoice"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ViewBuyerTaxInvoice
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
