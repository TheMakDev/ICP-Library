import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LibraryProvider } from '@/contexts/LibraryContext';
import AuthForm from './AuthForm';
import Header from './Header';
import StudentDashboard from './StudentDashboard';
import LibrarianDashboard from './LibrarianDashboard';

const MainApp: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <LibraryProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto">
          {user?.role === 'student' ? (
            <StudentDashboard />
          ) : (
            <LibrarianDashboard />
          )}
        </main>
      </div>
    </LibraryProvider>
  );
};

export default MainApp;