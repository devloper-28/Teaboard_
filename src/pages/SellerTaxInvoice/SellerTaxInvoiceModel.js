import Modals from "../../components/common/Modal";
import SellerTaxInvoice from "./SellerTaxInvoice";

function SellerTaxInvoiceModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Generate Seller Tax Invoice"}
        show={open === "sellerTaxInvoice"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <SellerTaxInvoice
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

export default SellerTaxInvoiceModal;
