import Modals from "../../components/common/Modal";
import CreateConfigureParameterBharat from "./CreateConfigureParameterBharat";
import CreateConfigureParameterEng from "./CreateConfigureParameterEng";
import { useState } from "react";

function CreateConfigureParameterModal({ open, setOpen, modalRight }) {
  const [auctionType, setAuctionType] = useState("");

  return (
    <>
      <Modals
        title={"Configure Parameter"}
        show={open === "CreateConfigureParameter" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <div className="col-md-4">
          <div className="FormGroup">
            <label>Auction Type</label>
            <select
              className="form-control select-form"
              value={auctionType}
              onChange={(e) => setAuctionType(e.target.value)}
            >
              <option value="">Please Select Auction Type</option>
              <option value={1}>Bharat</option>
              <option value={2}>English</option>
            </select>
          </div>
        </div>

        {1 == auctionType ? (
          <CreateConfigureParameterBharat
            modalRight={
              open === "createAuctionCenter" ||
              (open === "editingAuctionCenterData" || modalRight?.length > 0
                ? modalRight
                : [])
            }
          />
        ) : 2 == auctionType ? (
          <CreateConfigureParameterEng
            modalRight={
              open === "createAuctionCenter" ||
              (open === "editingAuctionCenterData" || modalRight?.length > 0
                ? modalRight
                : [])
            }
          />
        ) : (
          ""
        )}
      </Modals>
    </>
  );
}

export default CreateConfigureParameterModal;
