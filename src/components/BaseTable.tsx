import React from 'react'
import { useTable, useExpanded, useGlobalFilter, useSortBy, usePagination,  useFilters } from 'react-table'

import { DefaultColumnFilter, GlobalFilter, fuzzyTextFilterFn } from "./utils/filters"




function BaseTable({ columns: userColumns, data, renderRowSubComponent }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns: userColumns,
      data,
      defaultColumn,
      filterTypes
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded, // We can useExpanded to track the expanded state
    usePagination,


    // for sub components too!
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  key={column.id}
                >
                  <div {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</div>
                  {/* Render the columns filter UI */}
                  <div>{column['canFilter'] ? column.render('Filter') : null}</div>
                </th>

              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                // globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter} globalFilter={undefined}              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            // console.log(row);
            return (
              // Use a React.Fragment here so the table markup is still valid
              <React.Fragment key={row.getRowProps().key}>
                <tr id="expander">
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row['isExpanded'] ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}
export default BaseTable