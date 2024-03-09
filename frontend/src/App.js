import './App.css';
import DonationPage from "./pages/DonationPage";
import AmbassadorLoginPage from "./pages/AmbassadorLoginPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/login" element={<AmbassadorLoginPage/>} />
                <Route path="*" element={<DonationPage/>}/>
            </Routes>
        </Router>
    </div>
  );
}

export default App;
