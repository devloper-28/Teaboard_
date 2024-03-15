import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRightsRequest,
  fetchRoleListRequest,
  fetchUserDetailsRequest,
  getAllAuctionCenterAscAction,
  saveRightsRequest,
  setSelectedRoleId,
  setSelectedUserId,
  fetchRightsSuccess,
  fetchSaveRightsByAuctionCenterIdAndUserId,
  createEditRightsApiStatus,
  getRoleApiStatus,
  fetchUserRightsRequest,
} from "../../store/actions";
import RightsTable from "./RightsTable";
import Select from "react-select";
import CustomToast from "../../components/Toast";

const ManageRole = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.role.userDetails);
  const roleList = useSelector((state) => state.role.roleList);
  const rightsResponse = useSelector((state) => state.role?.rightsData);
  const rightsList = useSelector(
    (state) => state.role?.rightsData?.responseData
  );

  const rightState = useSelector((state) => state);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );
  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => data.isActive === 1);

  const [selectedAuctionCenterId, setSelectedAuctionCenterId] = useState(null);
  const [selectedRoleCode, setSelectedRoleCode] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [auctionCenterError, setAuctionCenterError] = useState(null);
  const [roleCodeError, setRoleCodeError] = useState(null);
  const [userError, setUserError] = useState(null);
  const [selectedRights, setSelectedRights] = useState([]);
  const [isAllModuleSelected, setIsAllModuleSelected] = useState(true);
  useEffect(() => {
    dispatch(fetchRoleListRequest());
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );

    // Dispatch the action to fetch rights data when the component mounts
    dispatch(fetchRightsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRoleCode && selectedAuctionCenterId) {
      dispatch(
        fetchUserDetailsRequest(selectedRoleCode, selectedAuctionCenterId)
      );
    }
  }, [dispatch, selectedRoleCode, selectedAuctionCenterId]);

  const handleSubmit = () => {
    // Reset all error messages
    setRoleCodeError(null);
    setAuctionCenterError(null);
    setUserError(null);

    // Check if at least one of the dropdowns is selected
    if (!selectedRoleCode && !selectedAuctionCenterId && !selectedUserId) {
      // Show an error if none of the dropdowns is selected
      setRoleCodeError("Please select a Role");
      setAuctionCenterError("Please select an Auction Center");
      setUserError("Please select a User");
      return;
    }

    let tempData = [];

    rightsList &&
      rightsList.map((moduleData, moduleIndex) => {
        let linksDtoListTempData =
          moduleData.linksDtoList &&
          moduleData.linksDtoList.map((linksDtoListData, linksDtoListIndex) => {
            let rightsDtoListTempData =
              linksDtoListData &&
              linksDtoListData.rightsDtoList.map(
                (rightsDtoListData, rightsDtoListIndex) => {
                  if (
                    true == (rightsDtoListData && rightsDtoListData.isChecked)
                  ) {
                    tempData.push(rightsDtoListData.linkRightsId);
                  }
                  return rightsDtoListData;
                }
              );
            linksDtoListData.rightsDtoList = rightsDtoListTempData;

            return linksDtoListData;
          });
        moduleData.linksDtoList = linksDtoListTempData;

        return moduleData;
      });

    dispatch(
      saveRightsRequest({
        roleCode: selectedRoleCode === null ? "" : selectedRoleCode,
        auctionCenterId:
          parseInt(selectedAuctionCenterId) === null
            ? ""
            : parseInt(selectedAuctionCenterId), //if non mandatory, it will be pass blank ie.        "auctionCenterId": ""
        // && selectedUserId?.length > 0
        userIds:
          selectedUserId === null
            ? []
            : selectedUserId?.map((ele) => ele.value), //if non mandatory, it will be pass blank ie. "userIds": []
        linkRightsId: tempData,
      })
    );
  };

  let createData = useSelector((state) => state.role.createEditRightsApiStatus);

  useEffect(() => {
    if (true == createData) {
      let auctionCenterId =
        window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[4]
          ? atob(
              window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[4]
            )
          : "";
      dispatch(createEditRightsApiStatus(false));
      setSelectedRoleCode(null);
      setSelectedAuctionCenterId(null);
      setSelectedUserId(null);
      dispatch(fetchRightsRequest());
      dispatch(
        fetchUserRightsRequest(
          auctionCenterId,
          parseInt(atob(sessionStorage.getItem("argument2")))
        )
      );
    }
  });

  const handleRoleChange = (event) => {
    const selectedRoleCode = event.target.value;
    setSelectedRoleCode(selectedRoleCode);
    setRoleCodeError(null); // Clear role code error when a new option is selected
    dispatch(setSelectedRoleId(selectedRoleCode));
  };

  const handleAuctionCenterChange = (event) => {
    setSelectedAuctionCenterId(event.target.value);
    setAuctionCenterError(null); // Clear auction center error when a new option is selected
  };

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
    setUserError(null); // Clear user error when a new option is selected
  };

  let createDataGet = useSelector((state) => state.role.getRoleApiStatus);

  useEffect(() => {
    if (true == createDataGet) {
      dispatch(getRoleApiStatus(false));
      let isSelectAllLinks = true;
      setIsAllModuleSelected(true);
      let tempData1 =
        rightsList &&
        rightsList.map((moduleData, moduleIndex) => {
          isSelectAllLinks = true;
          let linksDtoListTempData =
            moduleData.linksDtoList &&
            moduleData.linksDtoList.map(
              (linksDtoListData, linksDtoListIndex) => {
                let rightsDtoListTempData =
                  linksDtoListData &&
                  linksDtoListData.rightsDtoList.map(
                    (rightsDtoListData, rightsDtoListIndex) => {
                      if (
                        false ==
                          (rightsDtoListData && rightsDtoListData.isChecked) ||
                        undefined ==
                          (rightsDtoListData && rightsDtoListData.isChecked)
                      ) {
                        isSelectAllLinks = false;
                      }
                      return rightsDtoListData;
                    }
                  );
                linksDtoListData.rightsDtoList = rightsDtoListTempData;

                return linksDtoListData;
              }
            );
          moduleData.isChecked = isSelectAllLinks;
          moduleData.linksDtoList = linksDtoListTempData;

          if (false == moduleData.isChecked) {
            setIsAllModuleSelected(false);
          }

          return moduleData;
        });

      let tempRightResponse = rightsResponse;
      tempRightResponse.responseData = tempData1;
      dispatch(fetchRightsSuccess(tempRightResponse));
    }
  });

  const handleClear = () => {
    setSelectedRoleCode(null);
    setSelectedAuctionCenterId(null);
    setSelectedUserId(null);
    dispatch(fetchRightsRequest());
  };

  const handleSearch = () => {
    if (!selectedRoleCode) {
      setRoleCodeError("Please select a Role");
      return;
    }

    if (!selectedAuctionCenterId) {
      setAuctionCenterError("Please select an Auction Center");
      return;
    }

    if (!selectedUserId) {
      setUserError("Please select a User");
      return;
    }

    if (selectedUserId && selectedUserId.length > 1) {
      CustomToast.error("Please select only one user to view the saved data");
      return;
    }

    dispatch(
      fetchSaveRightsByAuctionCenterIdAndUserId({
        roleCode: selectedRoleCode === null ? "" : selectedRoleCode,
        auctionCenterId:
          parseInt(selectedAuctionCenterId) === null
            ? ""
            : parseInt(selectedAuctionCenterId),
        userId:
          selectedUserId === null
            ? ""
            : selectedUserId && selectedUserId[0] && selectedUserId[0].value,
      })
    );
  };

  const handleCheckbox = (type, moduleId, linkedId, linkRightsId, value) => {
    let tempData = [];
    if (3 == type) {
      tempData =
        rightsList &&
        rightsList.map((moduleData, moduleIndex) => {
          if (moduleId == moduleData.moduleId) {
            let linksDtoListTempData =
              moduleData.linksDtoList &&
              moduleData.linksDtoList.map(
                (linksDtoListData, linksDtoListIndex) => {
                  if (linkedId == linksDtoListData.linkId) {
                    let rightsDtoListTempData =
                      linksDtoListData &&
                      linksDtoListData.rightsDtoList.map(
                        (rightsDtoListData, rightsDtoListIndex) => {
                          if (linkRightsId == rightsDtoListData.linkRightsId) {
                            rightsDtoListData.isChecked = value;
                          }
                          return rightsDtoListData;
                        }
                      );
                    linksDtoListData.rightsDtoList = rightsDtoListTempData;
                  }

                  return linksDtoListData;
                }
              );
            moduleData.linksDtoList = linksDtoListTempData;
          }
          return moduleData;
        });
    } else if (2 == type) {
      tempData =
        rightsList &&
        rightsList.map((moduleData, moduleIndex) => {
          if (moduleId == moduleData.moduleId) {
            let linksDtoListTempData =
              moduleData.linksDtoList &&
              moduleData.linksDtoList.map(
                (linksDtoListData, linksDtoListIndex) => {
                  let rightsDtoListTempData =
                    linksDtoListData &&
                    linksDtoListData.rightsDtoList.map(
                      (rightsDtoListData, rightsDtoListIndex) => {
                        rightsDtoListData.isChecked = value;
                        return rightsDtoListData;
                      }
                    );
                  linksDtoListData.rightsDtoList = rightsDtoListTempData;

                  return linksDtoListData;
                }
              );
            moduleData.linksDtoList = linksDtoListTempData;
          }
          return moduleData;
        });
    } else if (1 == type) {
      tempData =
        rightsList &&
        rightsList.map((moduleData, moduleIndex) => {
          let linksDtoListTempData =
            moduleData.linksDtoList &&
            moduleData.linksDtoList.map(
              (linksDtoListData, linksDtoListIndex) => {
                let rightsDtoListTempData =
                  linksDtoListData &&
                  linksDtoListData.rightsDtoList.map(
                    (rightsDtoListData, rightsDtoListIndex) => {
                      rightsDtoListData.isChecked = value;
                      return rightsDtoListData;
                    }
                  );
                linksDtoListData.rightsDtoList = rightsDtoListTempData;

                return linksDtoListData;
              }
            );
          moduleData.linksDtoList = linksDtoListTempData;

          return moduleData;
        });
    }

    let isSelectAllLinks = true;
    setIsAllModuleSelected(true);
    let tempData1 =
      tempData &&
      tempData.map((moduleData, moduleIndex) => {
        isSelectAllLinks = true;
        let linksDtoListTempData =
          moduleData.linksDtoList &&
          moduleData.linksDtoList.map((linksDtoListData, linksDtoListIndex) => {
            let rightsDtoListTempData =
              linksDtoListData &&
              linksDtoListData.rightsDtoList.map(
                (rightsDtoListData, rightsDtoListIndex) => {
                  if (
                    false ==
                      (rightsDtoListData && rightsDtoListData.isChecked) ||
                    undefined ==
                      (rightsDtoListData && rightsDtoListData.isChecked)
                  ) {
                    isSelectAllLinks = false;
                  }
                  return rightsDtoListData;
                }
              );
            linksDtoListData.rightsDtoList = rightsDtoListTempData;

            return linksDtoListData;
          });
        moduleData.isChecked = isSelectAllLinks;
        moduleData.linksDtoList = linksDtoListTempData;

        if (false == moduleData.isChecked) {
          setIsAllModuleSelected(false);
        }

        return moduleData;
      });

    let tempRightResponse = rightsResponse;
    tempRightResponse.responseData = tempData1;
    dispatch(fetchRightsSuccess(tempRightResponse));
  };

  return (
    <div className="row align-items-center">
      <div className="col-12">
        <h3>Manage Role</h3>
      </div>

      <div className="col-xl-3">
        <div className="FomrGroup">
          <label htmlFor="roleSelect">Select Role</label>
          <select
            id="roleSelect"
            onChange={handleRoleChange}
            value={selectedRoleCode || ""}
            className="form-control select-form"
          >
            <option value="" disabled={!selectedRoleCode}>
              {selectedRoleCode ? "Select Role" : "Please select Role"}
            </option>
            {roleList.map((role) => (
              <option key={role.roleId} value={role.roleCode}>
                {role.roleName}
              </option>
            ))}
          </select>
          {roleCodeError && <div style={{ color: "red" }}>{roleCodeError}</div>}
        </div>
      </div>

      <div className="col-xl-3">
        <div className="FomrGroup">
          <label htmlFor="auctionCenterSelect">Select Auction Center</label>
          <select
            id="auctionCenterSelect"
            onChange={handleAuctionCenterChange}
            value={selectedAuctionCenterId || ""}
            className="form-control select-form"
          >
            <option value="" disabled={!selectedAuctionCenterId}>
              {selectedAuctionCenterId
                ? "Select Auction Center"
                : "Please select Auction Center"}
            </option>
            {getAllAuctionCenter &&
              getAllAuctionCenter.map((auctionCenter) => (
                <option
                  key={auctionCenter.auctionCenterId}
                  value={auctionCenter.auctionCenterId}
                >
                  {auctionCenter.auctionCenterName}
                </option>
              ))}
          </select>
          {auctionCenterError && (
            <div style={{ color: "red" }}>{auctionCenterError}</div>
          )}
        </div>
      </div>

      <div className="col-xl-3">
        <div className="FomrGroup">
          <label htmlFor="userSelect">Select User:</label>
          <Select
            id="userSelect"
            isMulti
            options={userDetails?.map((user) => ({
              value: user.userId,
              label: user.userName,
            }))}
            onChange={(selectedUsers) => {
              // Extract user IDs from selected options
              // const selectedUserIds = selectedUsers.map((user) => user.value);
              setSelectedUserId(selectedUsers);
              setUserError(null); // Clear user error when new options are selected
            }}
            value={selectedUserId}
          />
          {userError && <div style={{ color: "red" }}>{userError}</div>}
        </div>
      </div>

      <div className="col-auto">
        <div className="BtnGroup">
          <button onClick={handleSearch} className="SubmitBtn mt-0">
            Search
          </button>
          <button onClick={handleSubmit} className="SubmitBtn mt-0">
            Submit
          </button>
          <button onClick={handleClear} className="Clear mt-0">
            Clear
          </button>
        </div>
      </div>

      {/* Display RightsTable component */}
      <div className="col-12 mt-3">
        <RightsTable
          rightsList={rightsList}
          handleCheckbox={handleCheckbox}
          isAllModuleSelected={isAllModuleSelected}
        />
      </div>
    </div>
  );
};

export default ManageRole;
