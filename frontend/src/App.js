import './App.css';
import DonationPage from "./pages/DonationPage";
import AmbassadorLoginPage from "./pages/AmbassadorLoginPage";
import AmbassadorDashboard from "./pages/AmbassadorDashboard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useState} from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/ambassador/*" element={isAuthenticated ? <AmbassadorDashboard/> : <AmbassadorLoginPage/>}/>
                    <Route path="*" element={<DonationPage/>} />
                </Routes>
            </Router>
        </div>
      );
}

export default App;
