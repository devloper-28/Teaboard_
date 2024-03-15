import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
  TableFixedColumns,
  TableColumnReordering,
  DragDropProvider,
} from "@devexpress/dx-react-grid-bootstrap4";

import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import {
  CustomPaging,
  IntegratedSorting,
  PagingPanel,
  PagingState,
  SortingState,
} from "@devexpress/dx-react-grid";
const tableMessages = {
  noData: 'No Records Found',
};

const DataTable = ({ ...data }) => {
  const [columnOrder, setColumnOrder] = useState(
    data.fixedColumnsOn === true
      ? data?.fixedColumns?.map((column) => column.name)
      : data?.columns?.map((column) => column.name)
  );

  const [columnWidths, setColumnWidths] = useState(
    data.columns?.map((column) => ({
      columnName: column.name,
      width: "180",
    }))
  );

  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState();

  // const getQueryString = () =>
  //   `${URL}&take=${data.pageSize}&skip=${data.pageSize * data.currentPage}`;
  // const loadData = () => {
  //   const queryString = getQueryString();
  //   if (queryString !== lastQuery && !loading) {
  //     setLoading(true);
  //     fetch(queryString)
  //       .then((response) => response.json())
  //       .then(({ data, totalCount: newTotalCount }) => {
  //         data?.setRows(data);
  //         data.setTotalCount(newTotalCount);
  //         setLoading(false);
  //       })
  //       .catch(() => setLoading(false));
  //     setLastQuery(queryString);
  //   }
  // };

  // useEffect(() => loadData());

  const handleColumnOrderChange = (newColumnOrder) => {
    setColumnOrder(newColumnOrder);
    const newColumnOrderNames = newColumnOrder?.map((columnName) =>
      data?.columns?.find((column) => column.name === columnName)
    );
    // Update the array with the new column order names
    // Example: onChange(newColumnOrderNames);
    data.setColumns(newColumnOrderNames);
    data.setFixedColumns(newColumnOrderNames);
  };

  const handleColumnWidthsChange = (newColumnWidths) => {
    setColumnWidths(newColumnWidths);
  };

  return (
    <>
      {/* <button variant="primary" onClick={handleToggleModal}>
        Add/Remove Column
      </button> */}
      <div className="TableBox">
        <Grid
          rows={data?.rows}
          columns={
            data.fixedColumnsOn === true
              ? data?.selectedColumns?.filter(
                  (column, index) => column.checked === true
                )
              : data?.columns
          }
        >
          <SortingState />
          <IntegratedSorting />

          {data?.custmize?.map((item, index) => (
            <item.functionName key={index} for={item.column} />
          ))}
          {data.dragdrop === true ? <DragDropProvider /> : ""}
          <Table messages={tableMessages} />
          <TableColumnResizing
            columnWidths={columnWidths}
            onColumnWidthsChange={handleColumnWidthsChange}
          />
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={handleColumnOrderChange}
          />
          <TableHeaderRow sticky showSortingControls />
          <TableFixedColumns
            leftColumns={data.leftColumns}
            rightColumns={data.rightColumns}
          />
        </Grid>
      </div>
    </>
  );
};

export default DataTable;
