import { useState, useEffect } from "react";
import WarehouseUserRegistration from "./WarehouseUserRegistration/WarehouseUserRegistration";
import SellerRegistration from "./Seller/sellerRegistration";
import BuyerRegistration from "./Buyer/BuyerRegistration/BuyerRegistration";
import ToaUserRegistration from "./TAOUser/createToaUserRegistration/CreateToaUserRegistration";
import CreateUser from "./Auctioneer/createRegistration/CreateRegistration";
import UserRegistration from "./Teaboard/UserRegistration/UserRegistration";

function RegisterUser({ requestedRole, modalRight }) {
  const [profile, setProfile] = useState(0);
  const [roles, setRoles] = useState([
    // { roleName: "Select Role", linkId: 0 },
    { roleName: "Tea Board", linkId: 17 },
    { roleName: "TAO User", linkId: 18 },
    { roleName: "Auctioneer", linkId: 19 },
    { roleName: "Buyer", linkId: 22 },
    { roleName: "Warehouse", linkId: 25 },
    { roleName: "Seller", linkId: 27 },
  ]);

  const [role, setRole] = useState("");
  const [showRole, setShowRole] = useState("");

  useEffect(() => {
    if (
      requestedRole != null &&
      requestedRole != "" &&
      requestedRole != undefined
    ) {
      if (requestedRole == "BUYER") {
        setShowRole("Buyer");
        setProfile(1);
      } else if (requestedRole == "TEABOARDUSER") {
        setShowRole("Tea Board");
        setProfile(1);
      } else if (requestedRole == "AUCTIONEER") {
        setShowRole("Auctioneer");
        setProfile(1);
      } else if (requestedRole == "SELLER") {
        setShowRole("Seller");
        setProfile(1);
      } else if (requestedRole == "WAREHOUSE") {
        setShowRole("Warehouse");
        setProfile(1);
      } else if (requestedRole == "TAOUSER") {
        setShowRole("TAO User");
        setProfile(1);
      }else if (requestedRole == "ASSOCIATEBUYER" || requestedRole == "POSTAUCTIONASSOCIATEBUYER") {
        setShowRole("Buyer");
        setProfile(2);
      }
    }
  }, []);

  const selectRole = (role) => {
    setRole(role);
  };

  const handleSubmit = () => {
    if (role === "Select Role") {
      setShowRole("");
    } else {
      setShowRole(role);
    }
  };

  return (
    <>
      {requestedRole != null &&
      requestedRole != "" &&
      requestedRole != undefined ? (
        ""
      ) : (
        <div className="row mb-3 align-items-end">
          <div className="col-xl-3 col-lg-4 col-md-6 col-md-12">
            <div className="SelectRole">
              <label>Select Role </label>
              <select
                className="select-form form-control"
                onChange={(e) => selectRole(e.target.value)}
              >
                <option value="0">Select Role</option>
                {roles
                  ?.map((item) =>
                    modalRight
                      .map((ele) => (ele.linkId === item.linkId ? item : ""))
                      .filter((eles) => eles !== "")
                  )
                  .reduce((acc, curr) => acc.concat(curr), [])
                  .map((role, index) => (
                    <option key={index} value={role.roleName}>
                      {role.roleName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-auto">
            <div className="BtnGroup">
              <button className="SubmitBtn" onClick={() => handleSubmit()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showRole === "Auctioneer" && (
        <CreateUser
          isProfile={profile}
          modalRight={modalRight?.filter(
            (item) =>
              item.linkId ===
              roles?.find((ele) => ele.roleName === showRole)?.linkId
          )}
          childUser={modalRight}
        />
      )}
      {showRole === "Warehouse" && (
        <WarehouseUserRegistration
          isProfile={profile}
          modalRight={modalRight?.filter(
            (item) =>
              item.linkId ===
              roles?.find((ele) => ele.roleName === showRole)?.linkId
          )}
          childUser={modalRight}
        />
      )}
      {showRole === "Buyer" && (
        <BuyerRegistration
          childUser={modalRight}
          isProfile={profile}
          modalRight={modalRight?.filter(
            (item) =>
              item.linkId ===
              roles?.find((ele) => ele.roleName === showRole)?.linkId
          )}
        />
      )}
      {showRole === "Seller" && (
        <SellerRegistration
        childUser={modalRight}
          isProfile={profile}
          modalRight={modalRight?.filter(
            (item) =>
              item.linkId ===
              roles?.find((ele) => ele.roleName === showRole)?.linkId
          )}
        />
      )}
      {showRole === "TAO User" && (
        <ToaUserRegistration
          isProfile={profile}
          modalRight={modalRight?.filter(
            (item) =>
              item.linkId ===
              roles?.find((ele) => ele.roleName === showRole)?.linkId
          )}
        />
      )}
      {showRole === "Tea Board" && (
        <UserRegistration
          isProfile={profile}
          modalRight={modalRight?.filter(
            (item) =>
              item.linkId ===
              roles?.find((ele) => ele.roleName === showRole)?.linkId
          )}
        />
      )}
    </>
  );
}

export default RegisterUser;
