import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import ViewPoll from './pages/ViewPoll';
import Auth from './components/Auth';

function App() {
  const [user, loading] = useAuthState(auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Header />
        <div className="flex flex-1 relative">
          {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
              <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
              <Route path="/create" element={user ? <CreatePoll /> : <Navigate to="/auth" />} />
              <Route path="/poll/:id" element={user ? <ViewPoll /> : <Navigate to="/auth" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
