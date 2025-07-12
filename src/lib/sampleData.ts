// Sample data for demo purposes
export const sampleBooks = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    totalCopies: 5,
    availableCopies: 3,
    publishedYear: 2009
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Software Engineering',
    totalCopies: 3,
    availableCopies: 2,
    publishedYear: 2008
  },
  {
    id: '3',
    title: 'Data Structures and Algorithms',
    author: 'Alfred V. Aho',
    isbn: '978-0201000238',
    category: 'Computer Science',
    totalCopies: 4,
    availableCopies: 1,
    publishedYear: 1983
  },
  {
    id: '4',
    title: 'Design Patterns',
    author: 'Gang of Four',
    isbn: '978-0201633612',
    category: 'Software Engineering',
    totalCopies: 2,
    availableCopies: 0,
    publishedYear: 1994
  }
];

// Initialize sample data in localStorage if not exists
export const initializeSampleData = () => {
  if (!localStorage.getItem('lms_books')) {
    localStorage.setItem('lms_books', JSON.stringify(sampleBooks));
  }
  
  if (!localStorage.getItem('lms_users')) {
    const sampleUsers = [
      {
        id: '1',
        email: 'student@icp.edu',
        password: 'student123',
        name: 'John Doe',
        role: 'student',
        studentId: 'CS2024001'
      },
      {
        id: '2',
        email: 'librarian@icp.edu',
        password: 'librarian123',
        name: 'Jane Smith',
        role: 'librarian'
      }
    ];
    localStorage.setItem('lms_users', JSON.stringify(sampleUsers));
  }
  
  if (!localStorage.getItem('lms_reservations')) {
    localStorage.setItem('lms_reservations', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('lms_borrowed_books')) {
    localStorage.setItem('lms_borrowed_books', JSON.stringify([]));
  }
};