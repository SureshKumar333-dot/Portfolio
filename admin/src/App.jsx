import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Projects from './pages/Projects';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  return localStorage.getItem('admin_token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#F0EBE0',
            border: '1px solid rgba(200,168,75,0.3)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.85rem',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="projects" element={<Projects />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
