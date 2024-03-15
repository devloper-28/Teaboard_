import Modals from "../../components/common/Modal";
import ContactLink from "./ContactUs";

function ContactLinkModel({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Contact Us"}
        show={open === "contactUs"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <ContactLink />
      </Modals>
    </>
  );
}

export default ContactLinkModel;
