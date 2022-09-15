// import logo from './logo.svg';
import './App.scss';
import MainTable from "./components/table"
import {  getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirebaseApp } from 'reactfire';
// import AddTask from './thunks/testadd'

// function BurritoTaste() {
//   // easily access the Firestore library
//   const burritoRef = query(collection(useFirestore(), 'sample'), orderBy('created', 'desc'))

//   // subscribe to a document for realtime updates. just one line!
//   const { status, data } = useFirestoreCollectionData(burritoRef);

//   // easily check the loading status
//   if (status === 'loading') {
//     return <p>Fetching burrito flavor...</p>;
//   }

//   return <p>The burrito is {JSON.stringify(data)}!</p>;
// }
function App() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  /* function to get all tasks from firestore in realtime */
  // useEffect(() => {
  //   const taskColRef = query(collection(db, 'sample'), orderBy('created', 'desc'))
  //   onSnapshot(taskColRef, (snapshot) => {
  //     setTasks(snapshot.docs.map(doc => ({
  //       id: doc.id,
  //       data: doc.data()
  //     })))
  //   })
  // }, [])
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <div className="App">
        <header className="App-header">
          Number Party Massacre
        </header>
        {/* <AddTask /> */}
        {/* <BurritoTaste /> */}

        {/* <div >
          {tasks.map((task) => (
            <div
              id={task.id}
              key={task.id}
              title={task.data.title}
              description={task.data.description}
            > {JSON.stringify(task.data.TITLE)}</div>

          ))}
        </div> */}
        <div className="App-content">
          Body content
          <MainTable />
        </div>
        <footer className="App-footer"> Thanks for visiting</footer>
      </div >
    </FirestoreProvider>
  );
}

export default App;
