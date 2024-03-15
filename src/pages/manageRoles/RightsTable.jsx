import React, { useState } from "react";

const RightsTable = ({ rightsList, handleCheckbox, isAllModuleSelected }) => {
  return (
    <div className="TableBox">
      <table className="table" border="1">
        <thead>
          <tr>
            <th className="text-left py-2">
              {rightsList && rightsList.length && rightsList.length > 0 ? (
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={isAllModuleSelected}
                    onChange={(event) =>
                      handleCheckbox("1", "", "", "", event.target.checked)
                    }
                  />
                </div>
              ) : (
                ""
              )}
            </th>
            <th>Module Name</th>
            <th>Link Name</th>
            <th>Rights</th>
          </tr>
        </thead>
        <tbody>
          {rightsList?.map((module, moduleIndex) => (
            <tr key={module.moduleId}>
              <td className="text-left">
                <input
                  type="checkbox"
                  checked={module.isChecked}
                  onChange={(event) =>
                    handleCheckbox(
                      "2",
                      module.moduleId,
                      "",
                      "",
                      event.target.checked
                    )
                  }
                />
              </td>
              <td>{module.moduleName}</td>
              <td>
                {module?.linksDtoList?.map((ele) => (
                  <table className="table">
                    <tr key={ele.linkId} style={{ width: "100%!important" }}>
                      <td
                        style={{
                          width: "100%!important",
                          paddingRight: "7.35rem !important",
                        }}
                      >
                        {ele.linkName}
                      </td>
                    </tr>
                  </table>
                ))}
              </td>
              <td>
                {module?.linksDtoList?.map((ele, indexss) => (
                  <table className="table">
                    <tr>
                      {ele?.rightsDtoList?.map((item) =>
                        ele.linkId === item.linkId ? (
                          <td>
                            <div className="d-flex">
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={(event) =>
                                  handleCheckbox(
                                    "3",
                                    module.moduleId,
                                    item.linkId,
                                    item.linkRightsId,
                                    event.target.checked
                                  )
                                }
                              />
                              &nbsp;{item.rightName}
                            </div>
                          </td>
                        ) : (
                          ""
                        )
                      )}
                    </tr>
                  </table>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RightsTable;
