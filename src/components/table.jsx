import React from 'react'
import styled from 'styled-components'
import {useAsyncDebounce,  } from 'react-table'
import { useState } from 'react'
import { collection, } from 'firebase/firestore'
import BaseTable from './BaseTable'
import {  query, orderBy } from 'firebase/firestore';
import { useFirestore,  useFirestoreCollectionData } from 'reactfire';

const Styles = styled.div`
  padding: 0 1rem;
  // height: 100%;
  max-height: 85vh;
  overflow-y: scroll;
  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer


// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}
// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'
function MainTable() {
  // const { sample_data } = require("../sample_data")
  // easily access the Firestore library
  const firestore = useFirestore();
  const coll = collection(firestore, 'sample');
  const [isAscending] = useState(false);
  const allQuery = query(coll, orderBy('TITLE', isAscending ? 'asc' : 'desc'));
  let { status, data: movies } = useFirestoreCollectionData(allQuery, {
    idField: 'id',
  });
  console.log(movies);
  // const [movieState, setMovieState] = React.useState([]);
  if (status === "loading") {
    movies = [];
  } 
  // const [dataState, setDataState] = React.useState(
  //   movies.map((prop, key) => {
  //     return {
  //       id: key,
  //       ...prop,
  //     }
  //   }));
  // setDataState(movies);

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '👇' : '👉'}
          </span>
        ),
      },
      {
        Header: "Title",
        accessor: "TITLE",
      },
      {
        Header: "Year",
        accessor: "YEAR",
        Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: "Subgenre",
        accessor: "SUBGENRE",
      },
      {
        Header: "Franchise",
        accessor: "FRANCHISE",
      },

    ],
    []
  )

  // const data = React.useMemo(() => makeData(10), [])

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <pre
        style={{
          fontSize: '10px',
        }}
      >
        <code>{JSON.stringify({ values: row.original }, null, 3)}</code>
      </pre>
    ),
    []
  )

  return (

    <Styles>
      {status === 'loading' ? <div>Loading</div> :
        <BaseTable
          columns={columns}
          data={movies}
          // We added this as a prop for our table component
          // Remember, this is not part of the React Table API,
          // it's merely a rendering option we created for
          // ourselves
          renderRowSubComponent={renderRowSubComponent}
        // getTrProps={(state, rowInfo, column, instance, expanded) => {
        //   return {
        //     onClick: e => {
        //       console.log(e);
        //       alert("HI")
        //       const expanded = { ...this.state.expanded };
        //       expanded[rowInfo.viewIndex] = this.state.expanded[rowInfo.viewIndex] ? false : true;
        //       this.setState({ expanded });
        //     }
        //   };
        // }}
        />
      }
    </Styles>
  )
}


// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])
  const onChange = useAsyncDebounce(value => {
    setFilter((old = []) => [value ? parseInt(value, 10) : undefined, old[1]])
  }, 20);
  return (
    <div
      style={{
        display: 'flex',
        fontSize: '1rem'
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          onChange(val);
        }}
        placeholder={`${min}`}
        style={{
          width: '70px',
          height: '1rem',
          marginRight: '0.3rem',
        }}
      />
      -
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          onChange(val);
          // setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`${max}`}
        style={{
          width: '70px',
          height: '1rem',
          marginLeft: '0.3rem',
        }}
      />
    </div>
  )
}

export default MainTable
