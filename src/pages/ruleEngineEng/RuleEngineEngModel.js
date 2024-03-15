import Modals from "../../components/common/Modal";
import RuleEngineEng from "./RuleEngineEng";
import RuleEngineBharat from "./RuleEngineBharat";
import { useState, useEffect } from "react";

function RuleEngineModelEng({
  open,
  setOpen,
  modalRight,
  auctionTypeBharat,
  auctionTypeEnglish,
}) {
  const [auctionType, setAuctionType] = useState("");

  useEffect(() => {
    if (open == "") {
      setAuctionType("");
    }
  });

  return (
    <>
      <Modals
        title={"Manage Rule Engine"}
        show={open === "ruleEngine" ? true : false}
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
        {auctionType == 1 ? (
          <RuleEngineBharat
            modalRight={modalRight}
            auctionType={auctionType}
            // modalRight
            // modalRight={
            //   open === "createAuctionCenter" ||
            //   (open === "editingAuctionCenterData" || modalRight?.length > 0
            //     ? modalRight
            //     : [])
            // }
          />
        ) : auctionType == 2 ? (
          <RuleEngineEng
            modalRight={modalRight}
            auctionType={auctionType}

            // modalRight={
            //   open === "createAuctionCenter" ||
            //   (open === "editingAuctionCenterData" || modalRight?.length > 0
            //     ? modalRight
            //     : [])
            // }
          />
        ) : (
          ""
        )}
      </Modals>
    </>
  );
}

export default RuleEngineModelEng;
