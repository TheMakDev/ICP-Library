import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, CheckCircle, XCircle, Plus, Edit, Trash2, Menu } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LibrarianDashboard: React.FC = () => {
  const { books, reservations, addBook, updateBook, deleteBook, approveReservation, rejectReservation } = useLibrary();
  const { user } = useAuth();
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1,
    publishedYear: new Date().getFullYear()
  });
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBook(newBook);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      category: '',
      totalCopies: 1,
      availableCopies: 1,
      publishedYear: new Date().getFullYear()
    });
    toast({ title: 'Book Added', description: 'New book has been added to the library.' });
  };

  const handleDeleteBook = (bookId: string) => {
    deleteBook(bookId);
    toast({ title: 'Book Deleted', description: 'Book has been removed from the library.' });
  };

  const handleApproveReservation = (reservationId: string) => {
    approveReservation(reservationId);
    toast({ title: 'Reservation Approved', description: 'Student can now collect the book.' });
  };

  const handleRejectReservation = (reservationId: string) => {
    rejectReservation(reservationId);
    toast({ title: 'Reservation Rejected', description: 'Student has been notified.' });
  };

  const pendingReservations = reservations.filter(res => res.status === 'pending');
  const approvedReservations = reservations.filter(res => res.status === 'approved');

  return (
    <div className="p-4 md:p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">Librarian Dashboard</h1>
          <p className="text-green-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center w-full md:w-auto">
          <div>
            <p className="text-xl md:text-2xl font-bold text-green-600">{books.length}</p>
            <p className="text-sm text-gray-600">Total Books</p>
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-orange-600">{pendingReservations.length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-blue-600">{approvedReservations.length}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-green-50">
          <TabsTrigger value="books" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger value="reservations" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
            <Users className="h-4 w-4 mr-1 sm:mr-2" />
            Reservations
          </TabsTrigger>
          <TabsTrigger value="add-book" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            Add Book
          </TabsTrigger>
        </TabsList>

        {/* Books */}
        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Book Collection</CardTitle>
              <CardDescription>Manage your library's book inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <Card key={book.id} className="border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-800">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>ISBN:</span>
                          <span className="font-mono">{book.isbn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <Badge variant="outline" className="text-green-600">{book.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Copies:</span>
                          <span>{book.availableCopies}/{book.totalCopies}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => setEditingBook(book.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteBook(book.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservations */}
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Reservation Management</CardTitle>
              <CardDescription>Review and manage student book reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No reservations yet.</p>
                ) : (
                  reservations.map((reservation) => {
                    const book = books.find(b => b.id === reservation.bookId);
                    if (!book) return null;
                    return (
                      <div key={reservation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-green-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800">{book.title}</h4>
                          <p className="text-sm text-gray-600">by {book.author}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                            <span className="text-gray-500">Student: {reservation.studentName}</span>
                            <Badge
                              variant={reservation.status === 'approved' ? 'default' : reservation.status === 'pending' ? 'secondary' : 'destructive'}
                              className={reservation.status === 'approved' ? 'bg-green-600' : ''}
                            >
                              {reservation.status}
                            </Badge>
                            <span className="text-gray-500">
                              {new Date(reservation.reservedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {reservation.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              onClick={() => handleApproveReservation(reservation.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectReservation(reservation.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Book */}
        <TabsContent value="add-book">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Add New Book</CardTitle>
              <CardDescription>Add a new book to the library collection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="totalCopies">Total Copies</Label>
                    <Input id="totalCopies" type="number" min="1" value={newBook.totalCopies} onChange={(e) => {
                      const total = parseInt(e.target.value);
                      setNewBook({ ...newBook, totalCopies: total, availableCopies: total });
                    }} required />
                  </div>
                  <div>
                    <Label htmlFor="availableCopies">Available Copies</Label>
                    <Input id="availableCopies" type="number" min="0" max={newBook.totalCopies} value={newBook.availableCopies} onChange={(e) => setNewBook({ ...newBook, availableCopies: parseInt(e.target.value) })} required />
                  </div>
                  <div>
                    <Label htmlFor="publishedYear">Published Year</Label>
                    <Input id="publishedYear" type="number" min="1900" max={new Date().getFullYear()} value={newBook.publishedYear} onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Book
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Quick Action Buttons (Mobile Only) */}
      <div className="fixed bottom-6 right-4 flex flex-col items-end space-y-3 md:hidden">
        <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="bg-green-600 hover:bg-green-700 rounded-full p-3 shadow-lg">
          <Menu className="h-5 w-5" />
        </Button>
        {mobileMenuOpen && (
          <div className="flex flex-col items-end space-y-2 animate-in slide-in-from-bottom-2">
            <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full shadow-md" title="Manage Books">
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full shadow-md" title="Reservations">
              <Users className="h-5 w-5" />
            </Button>
            <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full shadow-md" title="Add Book">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;
