import Modals from "../../components/common/Modal";
import GenerateSellerTaxInvoice from "./generateSellerTaxInvoice";

function GenerateSellerTaxInvoiceModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Generate Seller to Auctioneer Tax Invoice"}
        show={open === "generateSellerTaxInvoiceModal"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <GenerateSellerTaxInvoice
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

export default GenerateSellerTaxInvoiceModal;
