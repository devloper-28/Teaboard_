import Modals from "../../components/common/Modal";

import AuctionSearchBidBook from "./AuctionSearchBidBook";

function AuctionSearchBidBookModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen("");
  };
  return (
    <>
      <Modals
        title={"Auction Search Bid Book Modal"}
        show={open === "auctionSearchBidBookModal"}
        handleClose={handleClose}
        size="xl"
      >
        <AuctionSearchBidBook />
      </Modals>
    </>
  );
}

export default AuctionSearchBidBookModal;
