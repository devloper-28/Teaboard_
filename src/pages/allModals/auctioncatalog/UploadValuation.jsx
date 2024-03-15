import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import axiosMain from "../../../http/axios/axios_main";
import { useEffect } from "react";
import { useState } from "react";
import CustomToast from "../../../components/Toast";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../../components/common/Modal";
import { readFileAndCheckHeaders } from "../../../components/common/uploadFile/utils";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import TableComponent from "../../../components/tableComponent/TableComponent";

const UploadValuationForm = ({
  auctionCatalogDetail,
  loggedUser,
  setOpenUploadValuation,
  setMyCatalogRows,
  timeData,
  baseUrlEng,
  kuchacatalogValuaction,
}) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  console.log(baseUrlEng, "baseUrlEngbaseUrlEngbaseUrlEng");
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [valuationData, setValuationData] = useState([]);
  const [saleProgramid, setSaleProgramid] = useState(null);
  const [uploadrows, setuploadRows] = useState([]);
  const uploadtablecolumn =
    (baseUrlEng === "EnglishAuctionCatalog" ||
      baseUrlEng === "EnglishAuctionKutchaCatalogue") &&
    baseUrlEng !== "EnglishAuctionBuyer"
      ? [
          { name: "LotNo", title: "Lot No" },
          { name: "basePrice", title: "Base Price" },
          { name: "reservePrice", title: "Reserve Price" },
          { name: "auctioneerValuation", title: "Auctioneer Valuation" },
          { name: "markPackageComments", title: "Mark and Packaging Comments" },
          { name: "lotComments", title: "Lot Comments" },
          { name: "qualityComments", title: "Quality Comments" },
          { name: "SampleQty", title: "SampleQty(Kgs)" },
          { name: "sessionType", title: "Session Type" },
        ]
      : baseUrlEng === "AuctionCatalog"
      ? [
          { name: "LotNo", title: "Lot No" },
          { name: "basePrice", title: "Base Price" },
          { name: "reservePrice", title: "Reserve Price" },
          { name: "auctioneerValuation", title: "Auctioneer Valuation" },
          { name: "markPackageComments", title: "Mark and Packaging Comments" },
          { name: "lotComments", title: "Lot Comments" },
          { name: "qualityComments", title: "Quality Comments" },
          { name: "SampleQty", title: "SampleQty(Kgs)" },
          { name: "sessionType", title: "Session Type" },
        ]
      : [
          { name: "lotNo", title: "Lot No" },
          { name: "myValuation", title: "My Valuation" },
          { name: "myComments", title: "My Comments" },
          { name: "groupCode", title: "Group Code" },
          { name: "gradeCode", title: "Grade Code" },
          { name: "markCode", title: "Mark Code" },
        ];
  console.log(uploadtablecolumn, "baseUrlEngbaseUrlEngbaseUrlEng");
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
    const invalidDataIndex = valuationData.findIndex(
      (ele) =>
        isNaN(parseInt(ele.auctioneerValuation)) ||
        isNaN(parseInt(ele.basePrice)) ||
        isNaN(parseInt(ele.reservePrice)) ||
        isNaN(parseInt(ele.SampleQty))
    );

    if (invalidDataIndex !== -1) {
      const invalidRow = valuationData[invalidDataIndex];
      const invalidRowNumber = invalidDataIndex + 1; // Adding 1 because array index starts from 0
      const invalidValues = {
        auctioneerValuation: invalidRow.auctioneerValuation,
        basePrice: invalidRow.basePrice,
        reservePrice: invalidRow.reservePrice,
        SampleQty: invalidRow.SampleQty,
      };
      console.log(
        // valuationData?.some(
        //   (ele) =>
        //     parseInt(ele.auctioneerValuation) &&
        //     parseInt(ele.basePrice) &&
        //     parseInt(ele.reservePrice) &&
        //     parseInt(ele.SampleQty)
        // ),
        invalidRowNumber,
        invalidRow,
        invalidValues,
        "valuationDatavaluationData"
      );
    }

    if (invalidDataIndex === -1) {
      axiosMain
        .post(
          loggedUser?.userCode === "buyer"
            ? `/preauction/${baseUrlEng}/AddValuation`
            : kuchacatalogValuaction
            ? `/preauction/EnglishAuctionKutchaCatalogue/UpdateKutchaCatalogueDetails`
            : `/preauction/${baseUrlEng}/UploadValuation?role=` + roleCode,
          kuchacatalogValuaction
            ? filteredData.map((ele) => {
                delete ele.createdOn;
                let data = {
                  ...ele,
                  saleNo: parseInt(auctionCatalogDetail.saleNo),
                  sessionTypeName: ele.sessionType,
                };
                delete data.sessionType;
                return data;
              })
            : filteredData
        )
        .then((res) => {
          if (res.data.statusCode === 200) {
            CustomToast.success(res.data.message);
            setValuationData([]);
            setOpenUploadValuation(false);
            if (loggedUser?.userCode === "buyer") {
              // axiosMain.post("/preauction/Buyer/AddToMyCatalog")
              auctionCatalogDetail.sessionStartTime = timeData
                ?.split(" - ")
                ?.at(0);
              auctionCatalogDetail.sessionEndTime = timeData
                ?.split(" - ")
                ?.at(1);

              axiosMain
                .post(
                  `/preauction/${baseUrlEng}/GetMyCatalog?role=` + roleCode,
                  {
                    season: auctionCatalogDetail.season,
                    saleNo: parseInt(auctionCatalogDetail.saleNo),
                    auctionDate: auctionCatalogDetail.auctionDate,
                    buyerId: userId,
                    // userId:auctionCatalogDetail.auctioneer,
                    sessionTime: auctionCatalogDetail.sessionTime,
                    teaTypeId: auctionCatalogDetail.teaType,
                    categoryId: auctionCatalogDetail.category,
                    sessionStartTime: auctionCatalogDetail.sessionStartTime,
                    sessionEndTime: auctionCatalogDetail.sessionEndTime,
                    auctionCenterId: auctionCenterId,
                  }
                )
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    CustomToast.success(res.data.message);
                    setMyCatalogRows(res.data.responseData);
                  } else {
                    CustomToast.error(res.data.message);
                  }
                });

              // console.log(KutchaCatalogId);
            } else {
              if (auctionCatalogDetail.saleNo !== "") {
                auctionCatalogDetail.sessionStartTime =
                  auctionCatalogDetail.sessionTime
                    ?.at(0)
                    ?.SessionTime?.split(" - ")
                    ?.at(0);
                auctionCatalogDetail.sessionEndTime =
                  auctionCatalogDetail.sessionTime
                    ?.at(0)
                    ?.SessionTime?.split(" - ")
                    ?.at(1);
                console.log(auctionCatalogDetail);
                axiosMain
                  .post(
                    kuchacatalogValuaction
                      ? `/preauction/EnglishAuctionKutchaCatalogue/GetKutchaCatalogueByParam`
                      : `/preauction/${baseUrlEng}/GetMyCatalog?role=` +
                          roleCode,
                    {
                      season: auctionCatalogDetail.season,
                      saleNo: parseInt(auctionCatalogDetail.saleNo),
                      auctionDate: auctionCatalogDetail.auctionDate,
                      auctioneerId: auctionCatalogDetail.auctioneer,
                      userId: auctionCatalogDetail.auctioneer,
                      teaTypeId: auctionCatalogDetail.teaType,
                      categoryId: auctionCatalogDetail.category,
                      sessionStartTime: auctionCatalogDetail.sessionStartTime,
                      sessionEndTime: auctionCatalogDetail.sessionEndTime,
                      auctionCenterId: auctionCenterId,
                    }
                  )
                  .then((res) => {
                    if (res.data.statusCode === 200) {
                      CustomToast.success(res.data.message);
                      setMyCatalogRows(res.data.responseData);
                    } else {
                      CustomToast.error(res.data.message);
                    }
                  });
              }
            }
          } else if (res.data.statusCode === 204) {
            CustomToast.warning(res.data.message);
            setValuationData([]);
            setOpenUploadValuation(false);
          } else {
            CustomToast.error(res.data.message);
            setValuationData([]);
            setOpenUploadValuation(false);
          }
        });
    } else {
      CustomToast.error("Please Enter Valid value");
    }
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
            season: season?.toString(),
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
          if (data && data?.length > 0) {
            const filteredData = data.filter((obj) => {
              // Check if any key in the object has a defined value
              return Object.values(obj).some((value) => value !== undefined);
            });

            const dataList = filteredData.map((ele) => {
              let data = {};
              if (baseUrlEng === "AuctionCatalog") {
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

                data = {
                  KutchaCatalogId: 0,
                  invoiceId: 0,
                  ageOfProducts:
                    ageOfProduct === undefined ? null : ageOfProduct,
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
                  LotNo: lotno === undefined ? null : lotno?.replace(/\s/g, ""),
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
                  auctionCenterId: auctionCenterId,
                  saleprogramid: saleProgramid,
                };
              } else {
                const {
                  //ageOfProduct,
                  auctioneerValuation,
                  basePrice,
                  // brewersComments,
                  // colourOfBrew,
                  // gardenCertification,
                  lotComments,
                  lotno,
                  markAndPackagingComments,
                  // priceIncrement,
                  // qualityCertification,
                  qualityComments,
                  reservePrice,
                  sampleqty,
                  sessionType,
                } = fixKeyNames(ele);

                data = {
                  KutchaCatalogId: 0,
                  invoiceId: 0,
                  //ageOfProducts: ageOfProduct === undefined ? null : ageOfProduct,
                  auctioneerValuation:
                    auctioneerValuation === undefined
                      ? null
                      : auctioneerValuation,
                  basePrice: basePrice === undefined ? null : basePrice,
                  // brewersComments:
                  //   brewersComments === undefined ? null : brewersComments,
                  // brewColor: colourOfBrew === undefined ? null : colourOfBrew,
                  // gardenCertification:
                  //   gardenCertification === undefined
                  //     ? null
                  //     : gardenCertification,
                  lotComments: lotComments === undefined ? null : lotComments,
                  LotNo: lotno === undefined ? null : lotno?.replace(/\s/g, ""),
                  markPackageComments:
                    markAndPackagingComments === undefined
                      ? null
                      : markAndPackagingComments,

                  // qualityCertification:
                  //   qualityCertification === undefined
                  //     ? null
                  //     : qualityCertification,
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
                  auctionCenterId: auctionCenterId,
                  saleprogramid: saleProgramid,
                  auctioneerId: userId,
                  auctionTypeMasterId: 2,
                  priceIncrement: 1,
                };
              }

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
          if (data && data?.length > 0) {
            const filteredData = data.filter((obj) => {
              // Check if any key in the object has a defined value
              return Object.values(obj).some((value) => value !== undefined);
            });
            console.log(data, "datadata");

            const dataList = filteredData.map((ele) => {
              const { groupCode, myComments, myValuation, lotno } =
                fixKeyNames(ele);

              let data = {
                lotNo: lotno.replace(/\s/g, ""),
                myValuation: parseFloat(myValuation),
                myComments: myComments,
                groupCode: groupCode,
                updatedBy: userId,
                createdBy: userId,
                auctionCenterId: auctionCenterId,
              };

              return data;
            });
            if (baseUrlEng === "EnglishAuctionBuyer") {
              axiosMain
                .post(
                  // `/preauction/${baseUrlEng}/GetMyCatalogValuation?role`,
                  `/preauction/${baseUrlEng}/GetMyCatalogValuation`,
                  dataList
                  // {
                  //   lotNo: lotno.replace(/\s/g, ""),
                  //   myValuation: parseFloat(myValuation),
                  //   myComments: myComments,
                  //   groupCode: groupCode,
                  //   auctionCenterId: auctionCenterId,
                  // }
                )
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    CustomToast.success(res.data.message);
                    setuploadRows(res.data.responseData);
                  } else {
                    CustomToast.error(res.data.message);
                  }
                })
                .catch((exx) => {});
            }
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
      if (baseUrlEng !== "EnglishAuctionBuyer") {
        setuploadRows([...valuationData, ...mergedArray]);
      }

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
      <ul style={{ listStyle: "disc", padding: "1%" }}>
        <li>Any number of excel file can be uploaded. </li>
        <li> Maximum file size should not exceed {"<10>"} MB</li>
        <li>Acceptable file types: (*.xls and.xlsx)</li>
      </ul>
      <input
        type="file"
        accept=".xls,.xlsx"
        multiple
        onChange={handleFileUpload}
        ref={fileInputRef}
      />
      <button onClick={handleSubmit}>Upload</button>

      {/* <ToastContainer autoClose={1200}/> */}
      {
        uploadrows.length > 0 && (
          // (baseUrlEng === "EnglishAuctionCatalog" ||
          //   baseUrlEng === "EnglishAuctionKutchaCatalogue" ||
          //   baseUrlEng === "EnglishAuctionBuyer") ? (
          <div>
            <TableComponent
              columns={uploadtablecolumn}
              rows={uploadrows?.length > 0 ? uploadrows : []}
              setRows={setuploadRows}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
              selectionCol={true}
              sorting={true}
            />
          </div>
        )

        // ) : (
        //   ""
        // )
      }
    </div>
  );
};

function UploadValuation({
  openUploadValuation,
  setOpenUploadValuation,
  auctionCatalogDetail,
  loggedUser,
  setMyCatalogRows,
  timeData,
  baseUrlEng,
  kuchacatalogValuaction,
}) {
  return (
    <div className="invoice-modal">
      {openUploadValuation && (
        <Modal
          size="xl"
          title="Upload Valuation"
          show={openUploadValuation}
          handleClose={() => {
            setOpenUploadValuation(false);
          }}
        >
          <UploadValuationForm
            loggedUser={loggedUser}
            auctionCatalogDetail={auctionCatalogDetail}
            setOpenUploadValuation={setOpenUploadValuation}
            setMyCatalogRows={setMyCatalogRows}
            timeData={timeData}
            baseUrlEng={baseUrlEng}
            kuchacatalogValuaction={kuchacatalogValuaction}
          />
        </Modal>
      )}
    </div>
  );
}

export default UploadValuation;
