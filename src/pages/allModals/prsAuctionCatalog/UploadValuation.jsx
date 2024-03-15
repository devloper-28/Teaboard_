import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import axiosMain from "../../../http/axios/axios_main";
import { useEffect } from "react";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../../components/common/Modal";
import { readFileAndCheckHeaders } from "../../../components/common/uploadFile/utils";
import CustomToast from "../../../components/Toast";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";

const UploadValuationForm = ({ auctionCatalogDetail, loggedUser }) => {
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [valuationData, setValuationData] = useState([]);
  const [saleProgramid, setSaleProgramid] = useState(null);
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  useEffect(() => {
    getSaleProgramId(auctionCatalogDetail.season, auctionCatalogDetail.saleNo);
  }, []);

  const fileInputRef = useRef(null);
  function fixKeyNames(obj) {
    const newObj = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let fixedKey = key.replace("/", "_"); // Replace '/' with '_'
        fixedKey = fixedKey.replace(".No", "No");
        newObj[fixedKey] = obj[key];
      }
    }

    return newObj;
  }

  const handleSubmit = () => {
    // if (files.length === 0) {
    //   CustomToast.error("Please select one or more files to upload");
    //   return;
    // }
    fileInputRef.current.value = "";
    console.log(auctionCatalogDetail, valuationData, "rowsrowsrowsrows");
    const filteredData = valuationData.filter((item) => item.LotNo !== null);
    axiosMain
      .post(
        loggedUser?.userCode === "buyer"
          ? "/preauction/Buyer/AddValuation"
          : "/preauction/AuctionCatalog/UploadValuation?role=" + roleCode,
        filteredData
      )
      .then((res) => {
        if (res.data.statusCode === 200) {
          CustomToast.success(res.data.message);
          setValuationData([]);
        } else if (res.data.statusCode === 204) {
          CustomToast.warning(res.data.message);
          setValuationData([]);
        } else {
          CustomToast.error(res.data.message);
          setValuationData([]);
        }
      });

    // console.log(rows, "rowrowrow");
    // let data = rows.map((ele) => {
    //   let results = {
    //     KutchaCatalogId: 0,
    //     invoiceId: 0,
    //     LotNo: "Sach123AHM2023301000-S",
    //     SampleQty: 10,
    //     basePrice: 100,
    //     reservePrice: 250,
    //     auctioneerValuation: 100,
    //     priceIncrement: 1,
    //     markPackageComments: "test",
    //     lotComments: "test",
    //     qualityComments: "test",
    //     qualityCertification: null,
    //     brewColor: "test",
    //     ageOfProducts: 2,
    //     brewersComments: "test",
    //     gardenCertification: "test",
    //     createdBy: userId,//auctioner
    //     createdOn: null,
    //     updatedBy: userId,//auctioner
    //     updatedOn: null,
    //     status: 1,
    //     saleprogramid: 10257,
    //   };

    //   return results;
    // });

    // axiosMain
    //   .post("/preauction/SampleShortage/UploadSampleShortage", data)
    //   .then((res) => {
    //     if (res.data.statusCode === 200) {
    //       CustomToast.success(res.data.message);
    //       setRows([]);
    //     } else {
    //       CustomToast.error(res.data.message);
    //     }
    //   });
  };

  // async function getSaleProgramId(season, saleNo) {
  //   let saleProgramid = null;
  //   if (parseInt(saleNo) > 0) {
  //     axiosMain
  //       .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
  //         season: season,
  //         saleNo: parseInt(saleNo),
  //       })
  //       .then((res) => {
  //         saleProgramid = res.data.responseData[0].SaleProgramId;
  //       });
  //   } else {
  //     console.log("logdding...");
  //   }

  //   return saleProgramid;
  // }
  async function getSaleProgramId(season, saleNo) {
    if (parseInt(saleNo) > 0) {
      try {
        const response = await axiosMain.post(
          "/preauction/Common/GetSaleProgramDetailBySaleNo",
          {
            season: season,
            saleNo: parseInt(saleNo),
            auctionCenterId: auctionCenterId,
          }
        );
        setSaleProgramid(response.data.responseData[0].SaleProgramId);
      } catch (error) {
        console.error("Error:", error);
        throw error; // Optionally, you can re-throw the error if you want to handle it elsewhere
      }
    } else {
      console.log("Logging...");
      return null; // Return null when saleNo is not greater than 0
    }
  }

  const handleData = async (uploadedData) => {
    try {
      const updatedFileData = [];
      // if (fileData.length > 0) {
      if (loggedUser?.userCode === "auctioneer") {
        uploadedData.map(({ fileName, data }, index) => {
          if (data && data.length > 0) {
            const filteredData = data.filter((obj) => {
              // Check if any key in the object has a defined value
              return Object.values(obj).some((value) => value !== undefined);
            });
            console.log(data, "datadata");

            const dataList = filteredData.map((ele) => {
              const {
                ageOfProduct,
                auctioneerValuation,
                basePrice,
                brewersComments,
                colourOfBrew,
                gardenCertification,
                lotComments,
                lotno,
                markAndPackagingComments,
                priceIncrement,
                qualityCertification,
                qualityComments,
                reservePrice,
                sampleqty,
                sessionType,
              } = fixKeyNames(ele);

              let data = {
                KutchaCatalogId: 0,
                invoiceId: 0,
                ageOfProducts: ageOfProduct === undefined ? null : ageOfProduct,
                auctioneerValuation:
                  auctioneerValuation === undefined
                    ? null
                    : auctioneerValuation,
                basePrice: basePrice === undefined ? null : basePrice,
                brewersComments:
                  brewersComments === undefined ? null : brewersComments,
                brewColor: colourOfBrew === undefined ? null : colourOfBrew,
                gardenCertification:
                  gardenCertification === undefined
                    ? null
                    : gardenCertification,
                lotComments: lotComments === undefined ? null : lotComments,
                LotNo: lotno === undefined ? null : lotno,
                markPackageComments:
                  markAndPackagingComments === undefined
                    ? null
                    : markAndPackagingComments,
                priceIncrement:
                  priceIncrement === undefined ? null : priceIncrement,
                qualityCertification:
                  qualityCertification === undefined
                    ? null
                    : qualityCertification,
                qualityComments:
                  qualityComments === undefined ? null : qualityComments,
                reservePrice: parseFloat(reservePrice),
                SampleQty: sampleqty,
                sessionType: sessionType,
                createdOn: null,
                createdBy: userId, //auctioner
                updatedBy: userId, //auctioner
                updatedOn: null,
                status: 1,
                saleprogramid: saleProgramid,
              };

              return data;
            });

            // updatedFileData.push(filteredData);
            updatedFileData.push(dataList);

            // updatedFileData.push(filteredData);
          } else {
            // Handle the case where the data array is empty
            CustomToast.error(`No data found in file '${fileName}'`);
          }
        });
      } else {
        uploadedData.map(({ fileName, data }, index) => {
          if (data && data.length > 0) {
            const filteredData = data.filter((obj) => {
              // Check if any key in the object has a defined value
              return Object.values(obj).some((value) => value !== undefined);
            });
            console.log(data, "datadata");

            const dataList = filteredData.map((ele) => {
              const { groupCode, myComments, myValuation, lotno } =
                fixKeyNames(ele);

              let data = {
                lotNo: lotno,
                myValuation: parseFloat(myValuation),
                myComments: myComments,
                groupCode: groupCode,
                updatedBy: userId,
                auctionCenterId: auctionCenterId,
              };

              return data;
            });

            // updatedFileData.push(filteredData);
            updatedFileData.push(dataList);

            // updatedFileData.push(filteredData);
          } else {
            // Handle the case where the data array is empty
            CustomToast.error(`No data found in file '${fileName}'`);
          }
        });
      }

      // } else {
      //   CustomToast.error(`No file found in fields`);
      // }
      const mergedArray = updatedFileData.reduce((result, currentArray) => {
        return result.concat(currentArray);
      }, []);
      console.log(updatedFileData?.at(0), "updatedFileData");

      //allData(mergedArray);
      // if (invoiceData?.length > 0) {
      //   setInvoiceData([...invoiceData, ...dataList]);
      // } else {
      setValuationData([...valuationData, ...mergedArray]);
      //}
      console.log(...mergedArray, "mergedArraymergedArray");
      console.log(valuationData, "invoiceDatainvoiceData");
    } catch (error) {
      CustomToast.error(error);
    }
    // validation(uploadedData);
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];
  const handleFileUpload = (e) => {
    const files = e.target.files;

    for (const file of files) {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      if (!ALLOWED_EXTENSIONS.includes("." + fileExtension.toLowerCase())) {
        CustomToast.error(
          `File '${fileName}' is not allowed. Only Excel files are accepted.`
        );
      } else if (fileSize > MAX_FILE_SIZE) {
        CustomToast.error(
          `File '${fileName}' exceeds the maximum allowed size of 10 MB.`
        );
      } else {
        const promises = Array.from(files).map((file) =>
          readFileAndCheckHeaders(file)
        );

        Promise.allSettled(promises).then((results) => {
          const fulfilledResults = results.filter(
            (result) => result.status === "fulfilled"
          );
          const dataFromFiles = fulfilledResults.map((result) => result.value);

          handleData(dataFromFiles);
        });
      }
    }
  };

  return (
    <div>
      <div className="col-md-12">
        <ul style={{ listStyle: "disc", padding: "1%" }}>
          <li>Any number of excel file can be uploaded. </li>
          <li> Maximum file size should not exceed {"<10>"} MB</li>
          <li>Acceptable file types: (*.xls and.xlsx)</li>
        </ul>
      </div>
      <input
        type="file"
        accept=".xls,.xlsx"
        multiple
        onChange={handleFileUpload}
        ref={fileInputRef}
      />
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
};

function UploadValuation({
  openUploadValuation,
  setOpenUploadValuation,
  auctionCatalogDetail,
  loggedUser,
}) {
  return (
    <div className="invoice-modal">
      {openUploadValuation && (
        <Modal
          size="xl"
          title="Create My Planner"
          show={openUploadValuation}
          handleClose={() => setOpenUploadValuation(false)}
        >
          <UploadValuationForm
            loggedUser={loggedUser}
            auctionCatalogDetail={auctionCatalogDetail}
          />
        </Modal>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
}

export default UploadValuation;
