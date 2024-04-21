import './App.css';
import DonationPage from "./pages/DonationPage";
import AmbassadorLoginPage from "./pages/AmbassadorLoginPage";
import AmbassadorDashboard from "./pages/AmbassadorDashboard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './AuthContext';
import NewMemberPage from "./pages/NewMemberPage";

function App() {


    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/ambassador/login" element={<AmbassadorLoginPage />} />
                    <Route
                        path="/ambassador/dashboard"
                        element={
                            <ProtectedRoute>
                                <AmbassadorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ambassador/dashboard/createNewMember"
                        element={
                            <ProtectedRoute>
                                <NewMemberPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/donation/:memberId" element={<DonationPage/>} />
                    <Route path="*" element={<DonationPage/>} />
                </Routes>
            </Router>
        </div>
      );
}

export default App;
