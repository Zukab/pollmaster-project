import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, LogOut } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Header: React.FC = () => {
  const [user] = useAuthState(auth);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BarChart2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">PollMaster</span>
        </Link>
        {user && (
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
