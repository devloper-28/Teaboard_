import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import TableComponent from "../../../../../components/tableComponent/TableComponent";
import axiosMain from "../../../../../http/axios/axios_main";
import MenualForm from "./MenualForm";
import CustomToast from "../../../../../components/Toast";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";

function ExcelUploadComponent({
  isDisable,
  isEdit,
  seasonpass,
  saleNopass,
  setExpandedTab,
}) {
  const {
    auctionDetailId,
    auctionCenterUserId,
    roleCode,
    auctionCenterId,
    userId,
    auction,
    auctionTypeMasterCode,
  } = useAuctionDetail();
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEng =
    auction === "ENGLISH" ? "EnglishAuctionSampleShortage" : "SampleShortage";
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [viewData, setViewData] = useState([]);

  const fileInputRef = useRef(null);

  const isValid = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet in the Excel file contains data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet data into a JSON object
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData, "jsonDatajsonData");

        // Check for mandatory columns and blank cells
        const mandatoryColumns = [
          "InspectionChgs",
          "LOTNO",
          "PACKAGENO",
          "ReInspectionChgs",
          "SAMPLEWT",
          "SHORTWT",
        ];
        let isValidData = true;

        jsonData.forEach((row, rowIndex) => {
          for (const column of mandatoryColumns) {
            if (!row[column] === "") {
              CustomToast.error(
                `Row ${rowIndex + 2}: ${column} is missing data`
              );
              isValidData = false;
              fileInputRef.current.value = "";
            }
          }
        });
        let fileData = jsonData.map((ele) => {
          let data = {
            LotNo: ele.LOTNO?.toString(),
            packageNo: ele.PACKAGENO?.toString(),
            createdBy: userId, //auctioner
            // season: ele.season?.toString(),
            // saleNo: parseInt(ele.saleNo === "" ? 0 : ele.saleNo),
            auctionCenterId: auctionCenterId,
          };
          return data;
        });

        axiosMain
          .post(`/preauction/${baseUrlEng}/CheckPackageNoByLotNo`, fileData)
          .then((res) => {
            if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              isValidData = true;
            } else {
              CustomToast.error(res.data.message);
              isValidData = false;
            }
          });
        return isValidData;
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      CustomToast.error("Please select one or more files to upload");
      return;
    }
    fileInputRef.current.value = "";

    // console.log(rows, "rowrowrow");
    let data = rows.map((ele) => {
      let results = {
        LotNo: ele.LOTNO?.toString(),
        packageNo: ele.PACKAGENO?.toString(),
        sampleWeight: parseFloat(ele.SAMPLEWT),
        shortWeight: parseFloat(ele.SHORTWT),
        inspectionCharges: parseFloat(ele.InspectionChgs),
        reInspectionCharges: parseFloat(ele.ReInspectionChgs),
        isActive: true,
        createdBy: userId, //auctioner
        updatedBy: userId, //auctioner
        // season: ele.season?.toString(),
        // saleNo: parseInt(ele.saleNo === "" ? 0 : ele.saleNo),
        auctionCenterId: auctionCenterId,
      };

      return results;
    });

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/UploadSampleShortage?role=` + roleCode,
        data
      )
      .then((res) => {
        if (res.data.statusCode === 200) {
          CustomToast.success(res.data.message);
          setRows([]);
        } else {
          CustomToast.error(res.data.message);
        }
      });
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((selectedFile) => {
      if (selectedFile.size > 10 * 1024 * 1024) {
        CustomToast.error(
          `The file ${selectedFile.name} size should not exceed 10MB`
        );
        return;
      }

      const fileNameParts = selectedFile.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (fileExtension !== "xls" && fileExtension !== "xlsx") {
        CustomToast.error(
          `Only Excel files are allowed for ${selectedFile.name}`
        );
        return;
      }

      // Your validation logic for predefined format here

      // If validation fails, display the error message
      if (!isValid(selectedFile)) {
        CustomToast.error(
          `Validation is unsuccessful for ${selectedFile.name}`
        );
        return;
      }

      processFile(selectedFile);
      CustomToast.success(`File ${selectedFile.name} uploaded successfully`);
    });

    setFiles(selectedFiles);
    // handleSubmit();
  };

  const processFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet in the Excel file contains data
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet data into a JSON object
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Check for mandatory columns and blank cells
      // jsonData.forEach((row, rowIndex) => {
      //   if (!row["MandatoryColumn1"] || !row["MandatoryColumn2"]) {
      //     CustomToast.error(
      //       `Row ${rowIndex + 2}: Mandatory columns are missing data`
      //     );
      //   }
      // });

      // Process jsonData further or save it as needed
      console.log("JSON Data:", jsonData);
      setRows([...rows, ...jsonData]);
    };

    reader.readAsArrayBuffer(file);
  };

  const sampleshortage = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },

    {
      name: "LOTNO",
      title: "Lot No",
    },
    {
      name: "PACKAGENO",
      title: "Package No",
    },
    {
      name: "InspectionChgs",
      title: "InspectionCharges",
    },
    {
      name: "ReInspectionChgs",
      title: "ReInspectionCharges",
    },
    {
      name: "SAMPLEWT",
      title: "SampleWeight",
    },
    {
      name: "SHORTWT",
      title: "ShortWeight",
    },

    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];
  const handleDownload = () => {
    let documentName = "SampleShortage.xlsx";

    axiosMain
      .post(
        "/preauction/SampleShortage/DownloadSampleShortageExcel",
        {
          auctionCenterId: auctionCenterId,
          Season: seasonpass,
          saleNo: parseInt(saleNopass),
          auctioneerId: userId,
          markId: 0,
        }
        // rows?.map((ele) => {
        //   return { LotNo: ele.LotNo };
        // })
      )
      .then((res) => {
        let documentBytes = res?.data?.responseData[0]?.byteDatas;

        // Decode base64 encoded documentBytes
        const decodedBytes = atob(documentBytes);

        // Create a Blob from the decoded bytes
        const blob = new Blob([
          new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
        ]);

        // Create an object URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a hidden anchor element
        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = blobUrl;
        anchor.download = documentName;

        // Append anchor to the body
        document.body.appendChild(anchor);

        // Programmatically click the anchor element
        anchor.click();

        // Clean up: remove the anchor and revoke the object URL
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.log(err));
  };
  const createMenually = () => {
    let data = rows.map((ele) => {
      let rowData = {
        LotNo: ele.LOTNO?.toString(),
        packageNo: ele.packageNo?.toString(),
        createdBy: userId,
        season: ele.season?.toString(),
        saleNo: parseInt(ele.saleNo === "" ? 0 : ele.saleNo),
        auctionCenterId: auctionCenterId,
      };
      return rowData;
    });

    axiosMain
      .post(`/preauction/${baseUrlEng}/CheckPackageNoByLotNo`, data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          // CustomToast.success(res.data.message);

          let data = rows.map((ele) => {
            let results = {
              LotNo: ele.LOTNO?.toString(),
              packageNo: ele.PACKAGENO?.toString(),
              sampleWeight: parseFloat(ele.SAMPLEWT),
              shortWeight: parseFloat(ele.SHORTWT),
              inspectionCharges: parseFloat(ele.InspectionChgs),
              reInspectionCharges: parseFloat(ele.ReInspectionChgs),
              isActive: true,
              createdBy: userId, //auctioner
              updatedBy: userId, //auctioner
              // season:ele.season?.toString(),
              // saleNo:parseInt(ele.saleNo===""?0:ele.saleNo),
              auctionCenterId: auctionCenterId,
            };

            return results;
          });
          axiosMain
            .post(
              `/preauction/${baseUrlEng}/UploadSampleShortage?role=` + roleCode,
              data
            )
            .then((res) => {
              if (res.data.statusCode === 200) {
                CustomToast.success(res.data.message);
              } else {
                CustomToast.error(res.data.message);
              }
            });
        } else {
          CustomToast.error(res.data.massage);
        }
      });

    console.log(rows, "rowsrows");
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <MenualForm
        rows={rows}
        setRows={setRows}
        handleSubmit={createMenually}
        viewData={viewData}
        isDisable={isDisable}
        seasonpass={seasonpass}
        saleNopass={saleNopass}
        isEdit={isEdit}
        setExpandedTab={setExpandedTab}
      />
      {isDisable || isEdit ? (
        ""
      ) : (
        <>
          <div className="row mt-3">
            <div className="col-md-12">
              <ul style={{ listStyle: "disc", padding: "1%" }}>
                <li>Any number of excel file can be uploaded. </li>
                <li> Maximum file size should not exceed {"<10>"} MB</li>
                <li>Acceptable file types: (*.xls and.xlsx)</li>
              </ul>
            </div>
            <div className="col-md-12">
              <div className="browse-file FileUpload px-0">
                <button
                  className="SubmitBtn"
                  type="button"
                  onClick={handleButtonClick}
                >
                  Browse
                </button>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <button className="SubmitBtn creat-btn" onClick={handleSubmit}>
                  Upload
                </button>
              </div>
            </div>
          </div>
          <div id="invoiceTable" className="mt-4">
            <TableComponent
              columns={sampleshortage}
              rows={rows}
              setRows={setRows}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
              selectionCol={true}
              sorting={true}
            />
          </div>

          <div className="row">
            <div className="col-12">
              {/* {modalRight?.includes("7") && ( */}
              <button
                type="button"
                className="btn SubmitBtn me-2"
                onClick={handleDownload}
              >
                Download Sample
              </button>
              {/* )} */}
            </div>
          </div>
        </>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
}

export default ExcelUploadComponent;
