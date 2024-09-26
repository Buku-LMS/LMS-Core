import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useTabs, TabPanel } from "react-headless-tabs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBook, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons'; 
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

const UPDATE_BOOK = gql`
  mutation updateBook(
    $bookId: Int!,
    $title: String!,
    $author: String!,
    $publicationYear: Int!,
    $rentFee: Float!,
    $stock: Int!
  ) {
    updateBook(
      bookId: $bookId,
      title: $title,
      author: $author,
      publicationYear: $publicationYear,
      rentFee: $rentFee,
      stock: $stock
    ) {
      author
      rentFee
      stock
      title
      publicationYear
      isbn
      id
    }
  }
`;

const UPDATE_MEMBER = gql`
  mutation updateMember(
    $memberId: Int!,
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $phoneNumber: String!,
    $balance: Float!
  ) {
    updateMember(
      memberId: $memberId,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      phoneNumber: $phoneNumber,
      balance: $balance
    ) {
      phoneNumber
      lastName
      id
      firstName
      email
      balance
    }
  }
`;

const Home = () => {
  const [selectedTab, setSelectedTab] = useTabs(["Books", "Members"], "Books");
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const [updateBookMutation] = useMutation(UPDATE_BOOK);
  const [updateMemberMutation] = useMutation(UPDATE_MEMBER);

  useEffect(() => {
    if (editData && itemType === 'book') {
      setTitle(editData.title || '');
      setAuthor(editData.author || '');
      setPublicationYear(editData.publicationYear ? editData.publicationYear.toString() : ''); 
      setRentFee(editData.rentFee ? editData.rentFee.toString() : ''); 
      setStock(editData.stock ? editData.stock.toString() : ''); 
    }
  }, [editData, itemType]);
  
  useEffect(() => {
    if (editData && itemType === 'member') {
      setFirstName(editData.firstName || '');
      setLastName(editData.lastName || '');
      setEmail(editData.email || '');
      setPhoneNumber(editData.phoneNumber || '');
      setBalance(editData.balance ? editData.balance.toString() : ''); 
    }
  }, [editData, itemType]);



  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); 
  };

  const handleDetailsClick = (id, type) => {
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
      alert("Failed to add book. Please try again.");
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
      alert("Failed to register member. Please try again.");
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
      alert("Please fill all required fields."); 
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
      alert("Please fill all required fields.");
    }
  };

  const handleBookIssue = (id) => {
    navigate(`/book-transactions/${id}`);
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditData(item); 
    setIsDetailsModalOpen(false); 
    setIsAddModalOpen(true); 
  };

  const handleUpdateBook = async () => {
    try {
      const bookId = parseInt(editData.id); 
      const publicationYearInt = parseInt(publicationYear); 
      const stockInt = parseInt(stock);
  
      if (isNaN(bookId) || isNaN(publicationYearInt) || isNaN(stockInt)) {
        throw new Error('Invalid input: Ensure all fields are filled correctly.');
      }
  
      await updateBookMutation({
        variables: {
          bookId,
          title,
          author,
          publicationYear: publicationYearInt,
          rentFee: parseFloat(rentFee), 
          stock: stockInt 
        },
      });
  
      setIsAddModalOpen(false); 
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };
  

  const handleUpdateMember = async () => {
    try {
      const memberId = parseInt(editData.id);
      const balanceFloat = parseFloat(balance); 

      if (isNaN(memberId) || isNaN(balanceFloat)) {
        throw new Error('Invalid input: Ensure all fields are filled correctly.');
      }

      await updateMemberMutation({
        variables: {
          memberId,
          firstName,
          lastName,
          email,
          phoneNumber,
          balance: balanceFloat,
        },
      });

      setIsAddModalOpen(false); 
    } catch (error) {
      console.error('Error updating member:', error);
    }
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
      <div className="tab-list">
        <button
          onClick={() => setSelectedTab("Books")}
          className={selectedTab === "Books" ? "active-tab" : "inactive-tab"}
        >
          Books
        </button>
        <button
          onClick={() => setSelectedTab("Members")}
          className={selectedTab === "Members" ? "active-tab" : "inactive-tab"}
        >
          Members
        </button>
      </div>

      <main>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder={`Search ${selectedTab === "Books" ? "by title or author..." : "by name or email..."}`}
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
          <TabPanel hidden={selectedTab !== "Books"}>
            <>
              <h2>Available Books</h2>
              <table border="1">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks?.map((book) => (
                    <tr key={book.id}>
                      <td>
                        {book.title}
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="details-icon"
                          onClick={() => handleDetailsClick(book.id, "book")}
                        />
                      </td>
                      <td>{book.author}</td>
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
          </TabPanel>

          <TabPanel hidden={selectedTab !== "Members"}>
            <>
              <h2>Members List</h2>
              <table border="1">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Book Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers?.map((member) => (
                    <tr key={member.id}>
                      <td>
                        {`${member.firstName} ${member.lastName}`}
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="details-icon"
                          onClick={() => handleDetailsClick(member.id, "member")}
                        />
                      </td>
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
          </TabPanel>
        </div>
      </main>


      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddModalOpen(false)}>&times;</span>
            <h2>
              {isEditing 
                ? (selectedTab === 'Books' ? 'Edit Book' : 'Edit Member') 
                : (selectedTab === 'Books' ? 'Add Book' : 'Register Member')}
            </h2>
            <form>
              {selectedTab === 'Books' ? (
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
                  <button
                    type="button"
                    onClick={isEditing ? handleUpdateBook : handleAddBook}
                    disabled={loadingBook}
                  >
                    {loadingBook ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Book' : 'Add Book')}
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
                  <button
                    type="button"
                    onClick={isEditing ? handleUpdateMember : handleRegisterMember}
                    disabled={loadingMember}
                  >
                    {loadingMember ? (isEditing ? 'Updating...' : 'Registering...') : (isEditing ? 'Update Member' : 'Register Member')}
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
                    <FontAwesomeIcon 
                      icon={faEdit}
                      onClick={() => handleEditClick(dataBook.getBook)} 
                    />
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
                    <FontAwesomeIcon 
                      icon={faEdit}
                      onClick={() => handleEditClick(dataMember.getMember)} 
                    />
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
