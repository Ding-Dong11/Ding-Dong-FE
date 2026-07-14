import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import KakaoMap from './pages/KakaoMap.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PasswordPage from './pages/Password.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<KakaoMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
