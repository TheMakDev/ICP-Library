import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import logo from '../asset/icpedu.png'

const AuthForm: React.FC = () => {
  const { login, register } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as 'student' | 'librarian',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      toast({ title: 'Login successful!', description: 'Welcome back!' });
    } else {
      toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
    }
    
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await register(registerData);
    
    if (success) {
      toast({ title: 'Registration successful!', description: 'You can now log in.' });
      setRegisterData({ email: '', password: '', name: '', role: 'student', studentId: '' });
    } else {
      toast({ title: 'Registration failed', description: 'Email already exists', variant: 'destructive' });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ICP Library Logo" className="h-12 w-12 sm:h-12 sm:w-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">ICP Library</h1>
          <p className="text-green-600 mt-2 text-sm sm:text-base">Computer Science Department</p>
          <p className="text-xs sm:text-sm text-green-500">Ibadan City Polytechnic</p>
        </div>

        <Card className="shadow-xl border-green-200">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-green-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader className="pb-4">
                <CardTitle className="text-green-800 text-lg sm:text-xl">Welcome Back</CardTitle>
                <CardDescription className="text-sm">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="focus:ring-green-500 focus:border-green-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="focus:ring-green-500 focus:border-green-500 mt-1"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 mt-6"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
              <CardHeader className="pb-4">
                <CardTitle className="text-green-800 text-lg sm:text-xl">Create Account</CardTitle>
                <CardDescription className="text-sm">Join the ICP Library system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name" className="text-sm">Full Name</Label>
                    <Input
                      id="reg-name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      className="focus:ring-green-500 focus:border-green-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email" className="text-sm">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="focus:ring-green-500 focus:border-green-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password" className="text-sm">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="focus:ring-green-500 focus:border-green-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-sm">Role</Label>
                    <Select 
                      value={registerData.role} 
                      onValueChange={(value: 'student' | 'librarian') => 
                        setRegisterData({ ...registerData, role: value })
                      }
                    >
                      <SelectTrigger className="focus:ring-green-500 focus:border-green-500 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="librarian">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Librarian
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {registerData.role === 'student' && (
                    <div>
                      <Label htmlFor="student-id" className="text-sm">Student ID</Label>
                      <Input
                        id="student-id"
                        value={registerData.studentId}
                        onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value })}
                        required
                        className="focus:ring-green-500 focus:border-green-500 mt-1"
                      />
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 mt-6"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;