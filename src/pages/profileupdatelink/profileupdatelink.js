import { useEffect } from "react";
import Modals from "../../components/common/Modal";
import RegisterUser from "../RegisterUser/RegisterUser";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
closemodel,
} from "../../store/actions";
function Profileupdatelink({ open, setOpen,modalRight }) {
  const dispatch = useDispatch();
  const closestatusjpgp = useSelector(
    (state) => state.createBuyer.closemodel
  );
  useEffect(() => {
    setOpen(false);
 },[closestatusjpgp]);
  return (
    <>
      <Modals
        show={open === "profileupdatelink"}
        handleClose={() => setOpen(false)}
        size="xl"
      >
        <RegisterUser requestedRole={atob(sessionStorage.getItem("argument6"))} 
        
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

export default Profileupdatelink;
