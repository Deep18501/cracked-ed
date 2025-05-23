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
import { Navigate } from "react-router-dom";
import PortalHomePage from './pages/PortalHomePage';
import PageSuccess from './pages/PageSuccess';

function App() {
  return (
    <AuthProvider>

      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/portal" replace />} />

          <Route path="/portal" element={<PortalHomePage />} />

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
          
          <Route path="/portal/application-success" element={
            <PageSuccess></PageSuccess>
          } />

          <Route path="/portal/login" element={
            <PortalLoginPage />
          } />
          <Route path="/portal/register" element={<PortalRegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
