import Modals from "../../components/common/Modal";
import SupoortLink from "./SupportLink";

function SupportLinkModel({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Support"}
        show={open === "support"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <SupoortLink />
      </Modals>
    </>
  );
}

export default SupportLinkModel;
