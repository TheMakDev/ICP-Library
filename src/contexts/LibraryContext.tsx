import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
}

interface Reservation {
  id: string;
  bookId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'borrowed' | 'returned';
  reservedAt: string;
  dueDate?: string;
  book?: Book;
}

interface LibraryContextType {
  books: Book[];
  reservations: Reservation[];
  loading: boolean;
  fetchBooks: () => Promise<void>;
  fetchReservations: () => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<boolean>;
  updateBook: (id: string, book: Partial<Book>) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  reserveBook: (bookId: string, userId: string) => Promise<boolean>;
  approveReservation: (reservationId: string) => Promise<boolean>;
  rejectReservation: (reservationId: string) => Promise<boolean>;
  cancelReservation: (reservationId: string) => Promise<boolean>;
  returnBook: (reservationId: string) => Promise<boolean>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (!error && data) {
        const formattedBooks = data.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn || '',
          category: book.category || '',
          totalCopies: book.total_copies,
          availableCopies: book.available_copies,
          description: book.description
        }));
        setBooks(formattedBooks);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          books (id, title, author)
        `)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const formattedReservations = data.map(res => ({
          id: res.id,
          bookId: res.book_id,
          userId: res.user_id,
          status: res.status,
          reservedAt: res.reserved_at,
          dueDate: res.due_date,
          book: res.books
        }));
        setReservations(formattedReservations);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchReservations();
  }, []);

  const addBook = async (book: Omit<Book, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('books')
        .insert({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          total_copies: book.totalCopies,
          available_copies: book.availableCopies,
          description: book.description
        });
      
      if (!error) {
        await fetchBooks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding book:', error);
      return false;
    }
  };

  const updateBook = async (id: string, bookUpdate: Partial<Book>): Promise<boolean> => {
    try {
      const updateData: any = {};
      if (bookUpdate.title) updateData.title = bookUpdate.title;
      if (bookUpdate.author) updateData.author = bookUpdate.author;
      if (bookUpdate.isbn) updateData.isbn = bookUpdate.isbn;
      if (bookUpdate.category) updateData.category = bookUpdate.category;
      if (bookUpdate.totalCopies !== undefined) updateData.total_copies = bookUpdate.totalCopies;
      if (bookUpdate.availableCopies !== undefined) updateData.available_copies = bookUpdate.availableCopies;
      if (bookUpdate.description) updateData.description = bookUpdate.description;
      
      const { error } = await supabase
        .from('books')
        .update(updateData)
        .eq('id', id);
      
      if (!error) {
        await fetchBooks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating book:', error);
      return false;
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (!error) {
        await fetchBooks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  };

  const reserveBook = async (bookId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          book_id: bookId,
          user_id: userId,
          status: 'pending'
        });
      
      if (!error) {
        await fetchReservations();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error reserving book:', error);
      return false;
    }
  };

  const approveReservation = async (reservationId: string): Promise<boolean> => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const { error } = await supabase
        .from('reservations')
        .update({
          status: 'approved',
          due_date: dueDate.toISOString()
        })
        .eq('id', reservationId);
      
      if (!error) {
        await fetchReservations();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error approving reservation:', error);
      return false;
    }
  };

  const rejectReservation = async (reservationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'rejected' })
        .eq('id', reservationId);
      
      if (!error) {
        await fetchReservations();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rejecting reservation:', error);
      return false;
    }
  };

  const cancelReservation = async (reservationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);
      
      if (!error) {
        await fetchReservations();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      return false;
    }
  };

  const returnBook = async (reservationId: string): Promise<boolean> => {
    try {
      // Get reservation details first
      const { data: reservation, error: fetchError } = await supabase
        .from('reservations')
        .select('book_id, status')
        .eq('id', reservationId)
        .single();
      
      if (fetchError || !reservation) {
        console.error('Error fetching reservation:', fetchError);
        return false;
      }
      
      if (reservation.status !== 'approved') {
        console.error('Only approved reservations can be returned');
        return false;
      }
      
      // Update reservation status to returned
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'returned' })
        .eq('id', reservationId);
      
      if (updateError) {
        console.error('Error updating reservation:', updateError);
        return false;
      }
      
      // Increment available copies using RPC function
      const { error: bookError } = await supabase
        .rpc('increment_available_copies', { book_id: reservation.book_id });
      
      if (bookError) {
        console.error('Error updating book availability:', bookError);
        // Rollback reservation status
        await supabase
          .from('reservations')
          .update({ status: 'approved' })
          .eq('id', reservationId);
        return false;
      }
      
      await fetchReservations();
      await fetchBooks();
      return true;
    } catch (error) {
      console.error('Error returning book:', error);
      return false;
    }
  };

  return (
    <LibraryContext.Provider value={{
      books,
      reservations,
      loading,
      fetchBooks,
      fetchReservations,
      addBook,
      updateBook,
      deleteBook,
      reserveBook,
      approveReservation,
      rejectReservation,
      cancelReservation,
      returnBook
    }}>
      {children}
    </LibraryContext.Provider>
  );
};