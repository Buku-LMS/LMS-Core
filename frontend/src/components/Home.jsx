import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBook, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';
import './Home.css';

const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    allBooks {
      id
      title
      author
      publicationYear
      stock
      rentFee
    }
  }
`;

const GET_ALL_MEMBERS = gql`
  query GetAllMembers {
    allMembers {
      id
      firstName
      lastName
      email
      phoneNumber
      balance
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($author: String!, $isbn: String!, $publicationYear: Int!, $rentFee: Float!, $stock: Int!, $title: String!) {
    addBook(author: $author, isbn: $isbn, publicationYear: $publicationYear, rentFee: $rentFee, stock: $stock, title: $title) {
      id
      title
      author
      publicationYear
      stock
      rentFee
      isbn
    }
  }
`;

const REGISTER_MEMBER = gql`
  mutation RegisterMember($email: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!, $balance: Float!) {
    registerMember(email: $email, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, balance: $balance) {
      balance
      email
      firstName
      id
      lastName
      phoneNumber
    }
  }
`;

const GET_BOOK_DETAILS = gql`
  query GetBook($bookId: Int!) {
    getBook(bookId: $bookId) {
      id
      title
      author
      isbn
      publicationYear
      stock
      rentFee
    }
  }
`;

const GET_MEMBER_DETAILS = gql`
  query GetMember($memberId: Int!) {
    getMember(memberId: $memberId) {
      id
      firstName
      lastName
      email
      phoneNumber
      balance
    }
  }
`;

const Home = () => {
  const [activeSection, setActiveSection] = useState('books');
  const { loading: loadingBooks, error: errorBooks, data: dataBooks } = useQuery(GET_ALL_BOOKS);
  const { loading: loadingMembers, error: errorMembers, data: dataMembers } = useQuery(GET_ALL_MEMBERS);
  
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [selectedItemId, setSelectedItemId] = useState(null); 
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); 
  const [itemType, setItemType] = useState(null); 

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [rentFee, setRentFee] = useState('');
  const [stock, setStock] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [balance, setBalance] = useState('');

  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); 
  };

  const handleRowClick = (id, type) => {
    setSelectedItemId(id);
    setItemType(type);
    setIsDetailsModalOpen(true); 
  };

  const handleIssueClick = (id) => {
    navigate(`/issue-book/${id}`);
  };

  const filteredBooks = dataBooks?.allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
  );

  const filteredMembers = dataMembers?.allMembers.filter(
    (member) =>
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm)
  );

  const [addBook, { loading: loadingBook }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      setIsAddModalOpen(false);
      resetBookFields();
    },
    refetchQueries: [{ query: GET_ALL_BOOKS }],
    onError: (error) => {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again."); // Display error
    },
  });

  const [registerMember, { loading: loadingMember }] = useMutation(REGISTER_MEMBER, {
    onCompleted: () => {
      setIsAddModalOpen(false);
      resetMemberFields();
    },
    refetchQueries: [{ query: GET_ALL_MEMBERS }],
    onError: (error) => {
      console.error("Error registering member:", error);
      alert("Failed to register member. Please try again."); // Display error
    },
  });

  const resetBookFields = () => {
    setTitle('');
    setAuthor('');
    setIsbn('');
    setPublicationYear('');
    setRentFee('');
    setStock('');
  };

  const resetMemberFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setBalance('');
  };

  const handleAddBook = () => {
    if (title && author && isbn && publicationYear && rentFee && stock) {
      addBook({
        variables: {
          title,
          author,
          isbn,
          publicationYear: parseInt(publicationYear),
          rentFee: parseFloat(rentFee),
          stock: parseInt(stock),
        },
      });
    } else {
      alert("Please fill all required fields."); // Alert user
    }
  };

  const handleRegisterMember = () => {
    if (firstName && lastName && email && phoneNumber) {
      registerMember({
        variables: {
          firstName,
          lastName,
          email,
          phoneNumber,
          balance: parseFloat(balance), 
        },
      });
    } else {
      alert("Please fill all required fields."); // Alert user
    }
  };

  const handleBookIssue = (id) => {
    navigate(`/book-transactions/${id}`);
  };

  const { loading: loadingBookDetails, error: errorBookDetails, data: dataBook } = useQuery(GET_BOOK_DETAILS, {
    variables: { bookId: parseInt(selectedItemId) },
    skip: !(isDetailsModalOpen && itemType === 'book'),
  });

  const { loading: loadingMemberDetails, error: errorMemberDetails, data: dataMember } = useQuery(GET_MEMBER_DETAILS, {
    variables: { memberId: parseInt(selectedItemId) },
    skip: !(isDetailsModalOpen && itemType === 'member'),
  });

  if (loadingBooks) return <p>Loading Books...</p>;
  if (errorBooks) return <p>Error: {errorBooks.message}</p>;

  if (loadingMembers) return <p>Loading Members...</p>;
  if (errorMembers) return <p>Error: {errorMembers.message}</p>;

  return (
    <div className="app">
      <nav className="tabs-container">
        <div 
          onClick={() => setActiveSection('books')} 
          className={`tab-link ${activeSection === 'books' ? 'active' : ''}`}
        >
          Books
        </div>
        <div 
          onClick={() => setActiveSection('members')} 
          className={`tab-link ${activeSection === 'members' ? 'active' : ''}`}
        >
          Members
        </div>
      </nav>

      <main>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder={`Search ${activeSection === 'books' ? 'by title or author...' : 'by name or email...'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
          <FontAwesomeIcon 
            icon={faPlus} 
            className="add-modal-icon" 
            onClick={() => setIsAddModalOpen(true)} 
          />
        </div>

        <div className="tab-content">
          {activeSection === 'books' ? (
            <>
              <h2>Available Books</h2>
              <table border="1">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Publication Year</th>
                    <th>Stock</th>
                    <th>Rent Fee (KES)</th>
                    <th>Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks?.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          onClick={() => handleRowClick(book.id, 'book')}
                        />
                      </td>
                      <td>{book.author}</td>
                      <td>{book.publicationYear}</td>
                      <td>{book.stock}</td>
                      <td>{book.rentFee}</td>
                      <td>
                        <FontAwesomeIcon 
                          icon={faBook} 
                          className="issue-book-icon" 
                          onClick={() => handleIssueClick(book.id)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2>Members List</h2>
              <table border="1">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No.</th>
                    <th>Balance (KES)</th>
                    <th>Book Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers?.map((member) => (
                    <tr key={member.id}>
                      <td>{`${member.firstName} ${member.lastName}`}
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          onClick={() => handleRowClick(member.id, 'member')}
                        />
                      </td>
                      <td>{member.email}</td>
                      <td>{member.phoneNumber}</td>
                      <td>{member.balance}</td>
                      <td>
                        <FontAwesomeIcon 
                          icon={faBook} 
                          className="issue-book-icon" 
                          onClick={() => handleBookIssue(member.id)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddModalOpen(false)}>&times;</span>
            <h2>{activeSection === 'books' ? 'Add Book' : 'Register Member'}</h2>
            <form>
              {activeSection === 'books' ? (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="ISBN"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                  />
                  
                  <select
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      Publication Year
                    </option>
                    {Array.from(new Array(201), (val, index) => new Date().getFullYear() - index).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Rent Fee"
                    value={rentFee}
                    onChange={(e) => setRentFee(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                  <button type="button" onClick={handleAddBook} disabled={loadingBook}>
                    {loadingBook ? 'Adding...' : 'Add Book'}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Initial Balance"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    required
                  />
                  <button type="button" onClick={handleRegisterMember} disabled={loadingMember}>
                    {loadingMember ? 'Registering...' : 'Register Member'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {isDetailsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsDetailsModalOpen(false)}>&times;</span>
            {itemType === 'book' ? (
              <>
                {loadingBookDetails ? (
                  <p>Loading...</p>
                ) : errorBookDetails ? (
                  <p>Error: {errorBookDetails.message}</p>
                ) : (
                  <div>
                    <h2>{dataBook.getBook.title}</h2>
                    <p><strong>Author:</strong> {dataBook.getBook.author}</p>
                    <p><strong>ISBN:</strong> {dataBook.getBook.isbn}</p>
                    <p><strong>Publication Year:</strong> {dataBook.getBook.publicationYear}</p>
                    <p><strong>Stock:</strong> {dataBook.getBook.stock}</p>
                    <p><strong>Rent Fee:</strong> KES {dataBook.getBook.rentFee}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {loadingMemberDetails ? (
                  <p>Loading...</p>
                ) : errorMemberDetails ? (
                  <p>Error: {errorMemberDetails.message}</p>
                ) : (
                  <div>
                    <h2>{`${dataMember.getMember.firstName} ${dataMember.getMember.lastName}`}</h2>
                    <p><strong>Email:</strong> {dataMember.getMember.email}</p>
                    <p><strong>Phone Number:</strong> {dataMember.getMember.phoneNumber}</p>
                    <p><strong>Balance:</strong> KES {dataMember.getMember.balance}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
