import Modals from "../../components/common/Modal";
import ChargeCode from "./chargeCode";

function ChargeCodeModal({ open, setOpen, modalRight }) {
  return (
    <>
      <Modals
        title={"Charge Code"}
        show={open === "chargeCode" || open === "editingChargeCodeData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ChargeCode
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

export default ChargeCodeModal;
