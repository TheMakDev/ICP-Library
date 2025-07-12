import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import MainApp from './MainApp';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </div>
  );
};

export default AppLayout;