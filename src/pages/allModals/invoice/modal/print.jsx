import { Checkbox } from "@mui/material";
import { useState } from "react";
import PrintableTable from "../../../../components/common/PrintableTable";

const PrintInvoice = ({
    fields,showcheckboxlebels,rows,pageName
}) => {
    const [checkedFields, setCheckedFields] = useState(pageName==="Invoice"? fields:[]);
    // const [allcheckedFields, setallCheckedFields] = useState([]);
    
    const handleChange = (event, field,field1) => {
        if (event.target.checked) {
            setCheckedFields([...checkedFields, field]);
            // setallCheckedFields([...allcheckedFields, field1]);
        } else {
            setCheckedFields(checkedFields.filter((item) => item.name !== field.name));
            // setallCheckedFields(allcheckedFields.filter((item) => item.name !== field1.name));
        }
        console.log(checkedFields)
    };
    return (<>
        <div className="row">
            {showcheckboxlebels.map((field) => (
                <div key={field.name}>
                    <Checkbox
                        checked={checkedFields.some((item) => item.name === field.name)}
                        onChange={(e) => handleChange(e, field,field)}
                        inputProps={{ "aria-label": "primary checkbox" }}
                    />
                    {field.title}
                </div>
            ))}
        </div>
        <div>
            <button className="SubmitBtn" onClick={() => PrintableTable(
                checkedFields,
                rows,
                pageName
            )}>
                Print
            </button>
        </div >


    </>

    )
}
export default PrintInvoice;