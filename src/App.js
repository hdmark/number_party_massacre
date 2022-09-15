import logo from './logo.svg';
import './App.scss';
import MainTable from "./components/table"
import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from './components/utils/firebase'
import AddTask from './thunks/testadd'
function App() {
  const [tasks, setTasks] = useState([])

  /* function to get all tasks from firestore in realtime */
  useEffect(() => {
    const taskColRef = query(collection(db, 'sample'), orderBy('created', 'desc'))
    onSnapshot(taskColRef, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        Number Party Massacre
      </header>
      <AddTask></AddTask>
      <div >
        {tasks.map((task) => (
          <div
            id={task.id}
            key={task.id}
            title={task.data.title}
            description={task.data.description}
          > {JSON.stringify(task.data.TITLE)}</div>

        ))}
      </div>
      <div className="App-content">
        Body content
        <MainTable />
      </div>
      <footer className="App-footer"> Thanks for visiting</footer>
    </div >
  );
}

export default App;
