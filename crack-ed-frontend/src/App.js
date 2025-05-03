import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import PortalLoginPage from './pages/PortalLoginPage';
import PortalDashboardPage from './pages/PortalDashboardPage';
import PortalRegisterPage from './pages/PortalRegisterPage';
import { DataProvider } from './context/DataContext';
import PortalApplicationPage from './pages/PortalApplicationPage';

function App() {
  return (
    <AuthProvider>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
            <Route path="/portal/dashboard" element={
              <DataProvider>
                <PortalDashboardPage />
              </DataProvider>
              } />   
              
              <Route path="/portal/application-form" element={
              <DataProvider>
                <PortalApplicationPage />
              </DataProvider>
              } />
          
          <Route path="/portal/login" element={<PortalLoginPage />} />
          <Route path="/portal/register" element={<PortalRegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
