import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Book, Calendar, X, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const StudentDashboard: React.FC = () => {
  const { books, reservations, loading, fetchBooks, fetchReservations, reserveBook, cancelReservation, returnBook } = useLibrary();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchReservations();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userReservations = reservations.filter(res => res.userId === user?.id);

  const handleReserveBook = async (bookId: string) => {
    if (!user) return;
    
    const existingReservation = reservations.find(
      res => res.bookId === bookId && res.userId === user.id && res.status === 'pending'
    );
    
    if (existingReservation) {
      toast({ title: 'Already Reserved', description: 'You have already reserved this book.', variant: 'destructive' });
      return;
    }
    
    const success = await reserveBook(bookId, user.id);
    if (success) {
      toast({ title: 'Book Reserved', description: 'Your reservation request has been submitted.' });
    } else {
      toast({ title: 'Error', description: 'Failed to reserve book.', variant: 'destructive' });
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    const success = await cancelReservation(reservationId);
    if (success) {
      toast({ title: 'Reservation Cancelled', description: 'Your reservation has been cancelled.' });
    }
  };

  const handleReturnBook = async (reservationId: string) => {
    const success = await returnBook(reservationId);
    if (success) {
      toast({ title: 'Book Returned', description: 'Thank you for returning the book!' });
    } else {
      toast({ title: 'Error', description: 'Failed to return book.', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="p-4 sm:p-6"><p>Loading...</p></div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Student Dashboard</h1>
          <p className="text-green-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-600">Student ID: {user?.studentId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 text-lg sm:text-xl">
            <Search className="h-5 w-5" />
            Search Books
          </CardTitle>
          <CardDescription>Find and reserve books from our collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => {
                const isReserved = reservations.some(
                  res => res.bookId === book.id && res.userId === user?.id && res.status === 'pending'
                );
                
                return (
                  <Card key={book.id} className="border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg text-green-800 line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="text-sm">by {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Category:</span>
                          <Badge variant="outline" className="text-green-600 text-xs">{book.category}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Available:</span>
                          <span className={book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}>
                            {book.availableCopies}/{book.totalCopies}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleReserveBook(book.id)}
                          disabled={book.availableCopies === 0 || isReserved}
                          className="w-full mt-3 bg-green-600 hover:bg-green-700 text-sm"
                          size="sm"
                        >
                          {isReserved ? 'Reserved' : book.availableCopies === 0 ? 'Not Available' : 'Reserve Book'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 text-lg sm:text-xl">
            <Book className="h-5 w-5" />
            My Reservations
          </CardTitle>
          <CardDescription>Track your book reservations and returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userReservations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No reservations yet. Start by searching for books!</p>
            ) : (
              userReservations.map((reservation) => {
                const book = reservation.book || books.find(b => b.id === reservation.bookId);
                if (!book) return null;
                
                return (
                  <div key={reservation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-green-200 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">{book.title}</h4>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <Badge 
                          variant={reservation.status === 'approved' ? 'default' : reservation.status === 'pending' ? 'secondary' : 'destructive'}
                          className={reservation.status === 'approved' ? 'bg-green-600' : ''}
                        >
                          {reservation.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          Reserved: {new Date(reservation.reservedAt).toLocaleDateString()}
                        </div>
                        {reservation.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(reservation.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {reservation.status === 'pending' && (
                        <Button
                          onClick={() => handleCancelReservation(reservation.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      {reservation.status === 'approved' && (
                        <Button
                          onClick={() => handleReturnBook(reservation.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Return Book
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;