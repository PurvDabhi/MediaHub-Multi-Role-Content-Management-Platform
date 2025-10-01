
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { initializeAuth } from './store/slices/authSlice';
import { useWebSocket } from './hooks/useWebSocket';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContentList from './pages/ContentList';
import ContentEditor from './pages/ContentEditor';
import MediaLibrary from './pages/MediaLibrary';
import Users from './pages/Users';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    console.log('Initializing auth...');
    dispatch(initializeAuth());
  }, [dispatch]);
  
  useWebSocket();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/new" element={<ContentEditor />} />
        <Route path="/content/:id" element={<ContentEditor />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Layout>
  );
}

export default App;