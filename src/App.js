import logo from './logo.svg';
import './App.scss';
import MainTable from "./components/table"
function App() {
  return (
    <div className="App">
      <header className="App-header">
        Number Party Massacre
      </header>
      <div className="App-content">
        Body content
        <MainTable />
      </div>
      <footer className="App-footer"> Thanks for visiting</footer>
    </div>
  );
}

export default App;
