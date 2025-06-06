import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-800">404</h1>
          <p className="text-gray-600 text-lg">Oops! Page not found</p>
          <p className="text-sm text-gray-500">The page you’re looking for doesn’t exist or has been moved.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full bg-gradient-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
