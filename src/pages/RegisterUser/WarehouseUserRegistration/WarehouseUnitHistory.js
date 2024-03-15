import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

const WarehouseUnitHistory = () => {
  const [warehouseUnitHistroy, setWarehouseUnitHistroy] = useState([]);
  const [loader, setLoader] = useState(false);
  const WarehouseUnitHistoryData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      setWarehouseUnitHistroy(WarehouseUnitHistoryData);
    }, 1000);
  }, [WarehouseUnitHistoryData]);

  return (
    <div className="TableBox">
      <table className="table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Old Value</th>
            <th>New Value</th>
            <th>Updated on Date and Time</th>
            <th>Updated by</th>
          </tr>
        </thead>
        <tbody>
          {warehouseUnitHistroy?.length > 0 ? (
            <>
              {warehouseUnitHistroy?.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.oldValue}</td>
                  <td>{record.newValue}</td>
                  <td>{record.updatedOn}</td>
                  <td>{record.updatedBy}</td>
                </tr>
              ))}
            </>
          ) : (
            <>
              <tr>
                <td colSpan={5}>
                  {loader ? (
                    <>
                      <div className="">
                        <ThreeDots
                          visible={true}
                          height="80"
                          width="80"
                          color="#4fa94d"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="NoData">No Data</div>
                    </>
                  )}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default WarehouseUnitHistory;
