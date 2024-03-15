import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchAuctionSearchBidBookData } from "../../store/actions";

function AuctionSearchBidBook() {
  const dispatch = useDispatch();

  useEffect(() => {
    let tempData =
      window.location.pathname &&
      window.location.pathname.split("/") &&
      window.location.pathname.split("/")[4];
    let auctionCenterId = tempData && atob(tempData);

    let payloadData = {
      auctionCenterId: auctionCenterId && parseInt(auctionCenterId),
    };
    dispatch(fetchAuctionSearchBidBookData(payloadData));
  }, []);

  let fetchAuctionSearchBidBookResponse = useSelector(
    (state) =>
      state.auctionSearchBidBookReducer.fetchAuctionSearchBidBook?.responseData
  );

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="TableBox">
            <table className="table">
              <thead>
                <tr>
                  <th>Lot No.</th>
                  <th>Invoice No.</th>
                  <th>Server Bid No.</th>
                  <th>Buyer Name</th>
                  <th>Max Bid Price</th>
                  <th>Closing Price</th>
                  <th>Exit Status</th>
                  <th>Bid Date Time</th>
                </tr>
              </thead>

              {fetchAuctionSearchBidBookResponse != null &&
              fetchAuctionSearchBidBookResponse.length > 0 ? (
                <tbody>
                  {fetchAuctionSearchBidBookResponse &&
                    fetchAuctionSearchBidBookResponse.map((data) => (
                      <tr>
                        <td>{data.lotNo}</td>
                        <td>{data.invoiceNo}</td>
                        <td>{data.serverBidNo}</td>
                        <td>{data.buyerName}</td>
                        <td>{data.maxBidPrice}</td>
                        <td>{data.closingPrice}</td>
                        <td>{data.exitStatus}</td>
                        <td>{data.bidDateTime}</td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                "No data available"
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export default AuctionSearchBidBook;
