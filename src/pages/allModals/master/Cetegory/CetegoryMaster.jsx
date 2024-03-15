import React, { useState } from "react";
import Modal from "../../../../components/common/Modal";
import { Form } from "react-bootstrap";
import TextBox from "../../../../components/common/FormComponent/textbox/TextBox";

import * as Yup from "yup";
import { useFormik } from "formik";
import CustomDropdown from "../../../../components/dropdown/CustomDropdown.jsx";

function CetegoryMaster({ open, setOpen }) {
  const [dataList, setDataList] = useState({
    first: "",
    second: "",
  });

  return (
    <div>
      {open && (
        <Modal
          title="Category master"
          show={open === "Category master" ? true : false}
          handleClose={() => setOpen("")}
        >
       <input type="radio" className="form-control"/>
        </Modal>
      )}
    </div>
  );
}

export default CetegoryMaster;
