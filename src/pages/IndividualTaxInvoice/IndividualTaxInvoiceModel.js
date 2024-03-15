import Modals from "../../components/common/Modal";
import TaxInvoice from "./IndividualTaxInvoice";

function TaxInvoiceModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Individual Buyer Tax Invoice Generation"}
        show={open === "individualTaxInvoice"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <TaxInvoice
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

export default TaxInvoiceModal;
