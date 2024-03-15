import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { ThreeDots } from "react-loader-spinner";
function FactoryOwnerHistory() {
    const [warehouseHistroy,setWarehouseHistory]=useState([]);
    const [loader, setLoader] = useState(false);
    const WarehouseHistoryData =  useSelector(
      (state) => state.documentReducer.historyData.responseData
    );
    useEffect(()=>{
     
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setWarehouseHistory(WarehouseHistoryData);
      }, 1000);
    },[WarehouseHistoryData])

    

  return (
    <div>
        <div className='TableBox'>
        <table className='table'>
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
                {warehouseHistroy?.length > 0 ? (<>
                    {warehouseHistroy?.map((record, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{record.oldValue}</td>
                <td>{record.newValue}</td>
                <td>{record.updatedOn}</td>
                <td>{record.updatedBy}</td>
              </tr>
            ))}
                </>) : (<>
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
                </tr></>)}
          
            </tbody>
        </table>
    </div>
    </div>
  )
}

export default FactoryOwnerHistory;