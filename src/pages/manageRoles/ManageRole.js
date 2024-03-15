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
} from "../../store/actions";
import RightsTable from "./RightsTable";
import Select from "react-select";
import CustomToast from "../../components/Toast";

const ManageRole = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.role.userDetails);
  const roleList = useSelector((state) => state.role.roleList);
  const rightsList = useSelector(
    (state) => state.role?.rightsData?.responseData
  );

  const rightState = useSelector((state) => state);
  console.log(
    rightsList?.map((ele) => {
      return {
        ...ele,
        linksDtoList: ele?.linksDtoList?.map((item) => {
          return {
            ...item,
            rightsDtoList: item?.rightsDtoList?.map((element) => {
              return { ...element, linkId: item.linkId };
            }),
          };
        }),
      };
    }),
    "rightsList"
  );
  console.log("as");
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

  // const handleSubmit = () => {
  //   if (!selectedAuctionCenterId) {
  //     setAuctionCenterError("Please select an Auction Center");
  //   } else {
  //     setAuctionCenterError(null);
  //   }

  //   if (!selectedRoleCode) {
  //     setRoleCodeError("Please select a Role");
  //   } else {
  //     setRoleCodeError(null);
  //   }

  //   if (!selectedUserId) {
  //     setUserError("Please select a User");
  //   } else {
  //     setUserError(null);
  //   }

  //   if (selectedAuctionCenterId && selectedRoleCode && selectedUserId) {
  //     // Log the selected values
  //     console.log("Selected Auction Center ID:", selectedAuctionCenterId);
  //     console.log("Selected Role Code:", selectedRoleCode);
  //     console.log("Selected User ID:", selectedUserId);

  //     // Add your logic to handle the selected values
  //   }
  // };
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

    // Log the selected values
    if (selectedRoleCode) {
      console.log("Selected Role Code:", selectedRoleCode);
    }

    if (selectedAuctionCenterId) {
      console.log("Selected Auction Center ID:", selectedAuctionCenterId);
    }

    if (selectedUserId) {
      console.log("Selected User ID:", selectedUserId);
    }

    if (selectedRights) {
      console.log("Selected Rights:", selectedRights);
    }

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
            ? ""
            : selectedUserId?.map((ele) => ele.value), //if non mandatory, it will be pass blank ie. "userIds": ""
        linkRightsId: selectedRights?.map((ele) => ele.linkRightsId),
      })
    );

    if (rightState?.role?.response?.statusCode === 200) {
      CustomToast.success(rightState?.role?.response?.message);

      setSelectedRoleCode(null);
      setSelectedAuctionCenterId(null);
      setSelectedUserId(null);
      setSelectedRights([]);
    }

    console.log(rightState?.role, "rightState");

    // Add your logic to handle the selected values
  };
  const handleCheckboxSelection = (selectedCheckboxIds) => {
    // Log the selected checkbox ids
    console.log(
      "Selected Checkbox IDs:",
      rightsList.map((ele) =>
        selectedCheckboxIds.filter((item) => item.moduleId === ele)
      )
    );
  };

  console.log(
    rightsList
      ?.map((ele, index) =>
        ele.linksDtoList
          ?.map((element) => element?.rightsDtoList)
          ?.reduce((acc, cur) => acc.concat(cur))
          ?.map((item) => {
            return { ...item, moduleName: ele.moduleName };
          })
      )
      ?.reduce((acc, cur) => acc.concat(cur)),
    "rightsList"
  );

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

  const handleAllModuleCheckboxChange = (data) => {
    // console.log(data,"datadata")
    if (selectedRights.length === data.length) {
      setSelectedRights([]);
    } else {
      setSelectedRights(
        rightsList
          ?.map((ele, index) =>
            ele.linksDtoList
              ?.map((element) => element?.rightsDtoList)
              ?.reduce((acc, cur) => acc.concat(cur))
              ?.map((item) => {
                return { ...item, moduleName: ele.moduleName };
              })
          )
          ?.reduce((acc, cur) => acc.concat(cur))
      );
    }
  };
  const handleModuleCheckboxChange = (module) => {
    console.log(
      []
        .concat(
          ...[module]
            ?.map(
              (ele, index) =>
                ele.linksDtoList?.map(
                  (element, indexs) => element?.rightsDtoList
                )
              // ?.reduce((acc, currunt) => acc + currunt, 0)
            )
            ?.at(0)
        )
        .map((ele) => {
          return { ...ele, moduleName: module.moduleName };
        }),
      // selectedRights.map((ele) => ele.moduleName).includes(module.moduleName),
      // [
      //   ...selectedRights,
      //   []
      //     .concat(
      //       ...[module]
      //         ?.map(
      //           (ele, index) =>
      //             ele.linksDtoList?.map(
      //               (element, indexs) => element?.rightsDtoList
      //             )
      //           // ?.reduce((acc, currunt) => acc + currunt, 0)
      //         )
      //         ?.at(0)
      //     )
      //     .map((ele) => {
      //       return { ...ele, moduleName: module.moduleName };
      //     }),
      // ],
      "modulemodule"
    );

    if (
      selectedRights.map((ele) => ele.moduleName).includes(module.moduleName)
    ) {
      setSelectedRights(
        selectedRights.filter((ele) => ele.moduleName !== module.moduleName)
      );
    } else if (selectedRights.length > 0) {
      let data = []
        .concat(
          ...[module]
            ?.map(
              (ele, index) =>
                ele.linksDtoList?.map(
                  (element, indexs) => element?.rightsDtoList
                )
              // ?.reduce((acc, currunt) => acc + currunt, 0)
            )
            ?.at(0)
        )
        .map((ele) => {
          return { ...ele, moduleName: module.moduleName };
        });

      setSelectedRights([...selectedRights, ...data]);
      // console.log([...selectedRights, ...data], "datadata");
    } else {
      setSelectedRights(
        ...selectedRights,
        []
          .concat(
            ...[module]
              ?.map(
                (ele, index) =>
                  ele.linksDtoList?.map(
                    (element, indexs) => element?.rightsDtoList
                  )
                // ?.reduce((acc, currunt) => acc + currunt, 0)
              )
              ?.at(0)
          )
          .map((ele) => {
            return { ...ele, moduleName: module.moduleName };
          })
      );
    }
  };

  const handleCheckboxChange = (linkRightsId) => {
    console.log(
      linkRightsId,
      selectedRights.filter(
        (ele) => ele.linkRightsId === linkRightsId.linkRightsId
      ),
      "linkRightsId"
    );
    // Toggle the selected rights
    if (
      selectedRights.filter(
        (ele) => ele.linkRightsId === linkRightsId.linkRightsId
      ).length > 0
    ) {
      setSelectedRights(
        selectedRights.filter(
          (id) => id.linkRightsId !== linkRightsId.linkRightsId
        )
      );
    } else {
      setSelectedRights([...selectedRights, linkRightsId]);
    }

    // Call the callback function with the selected checkbox ids
    // onCheckboxSelection(selectedRights);
  };
  // useEffect(() => {
  //   dispatch(saveRightsRequest(1));
  // }, []);

  return (
    <div className="row align-items-center">
      <div className="col-12">
        <h3>Manage Role</h3>
      </div>
      <div className="col-xl-3">
        <div className="FomrGroup">
          <label htmlFor="roleSelect">Select Role:</label>
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
          <label htmlFor="auctionCenterSelect">Select Auction Center:</label>
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
        {/* <div className="FomrGroup">
    
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            onChange={handleUserChange}
            value={selectedUserId || ""}
            className="form-control select-form"
          >
            <option value="" disabled={!selectedUserId}>
              {selectedUserId ? "Select a User" : "Please select a User"}
            </option>
            {userDetails?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.userName}
              </option>
            ))}
          </select>
          {userError && <div style={{ color: "red" }}>{userError}</div>}
        </div> */}
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
          <button onClick={handleSubmit} className="SubmitBtn mt-0">
            Submit
          </button>
        </div>
      </div>
      {/* Display RightsTable component */}
      <div className="col-12">
        <h3>Rights Data Table</h3>
        {/* Pass the callback function to RightsTable */}
        <RightsTable
          rightsList={rightsList?.map((ele) => {
            return {
              ...ele,
              linksDtoList: ele?.linksDtoList?.map((item) => {
                return {
                  ...item,
                  rightsDtoList: item?.rightsDtoList?.map((element) => {
                    return { ...element, linkId: item.linkId };
                  }),
                };
              }),
            };
          })}
          selectedRights={selectedRights}
          handleCheckboxChange={handleCheckboxChange}
          onCheckboxSelection={handleCheckboxSelection}
          handleModuleCheckboxChange={handleModuleCheckboxChange}
          handleAllModuleCheckboxChange={handleAllModuleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default ManageRole;
