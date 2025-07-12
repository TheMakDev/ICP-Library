import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, LogOut, User, Menu } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logo from '../asset/icpedu.png';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src={logo} alt="ICP Library Logo" className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-2 sm:mr-3" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-green-800">ICP Library</h1>
              <p className="text-xs text-green-600 hidden sm:block">Computer Science Department</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-green-600" />
              <div className="text-right">
                <p className="text-sm font-medium text-green-800">{user?.name}</p>
                <p className="text-xs text-green-600 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-green-600">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 pb-4 border-b border-green-200">
                    <User className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{user?.name}</p>
                      <p className="text-xs text-green-600 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50 w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;