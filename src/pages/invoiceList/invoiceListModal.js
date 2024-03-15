import Modals from "../../components/common/Modal";
import InvoiceList from "./invoiceList";

function InvoiceListModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Invoice List"}
        show={open === "InvoiceListModal"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <InvoiceList
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

export default InvoiceListModal;
