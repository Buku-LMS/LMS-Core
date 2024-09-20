import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import AddModal from './AddModal';
import DetailsModal from './DetailsModal';
import IssueBook from './IssueBook'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBook } from '@fortawesome/free-solid-svg-icons'; 
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

const Home = () => {
  const [activeSection, setActiveSection] = useState('books');
  const { loading: loadingBooks, error: errorBooks, data: dataBooks } = useQuery(GET_ALL_BOOKS);
  const { loading: loadingMembers, error: errorMembers, data: dataMembers } = useQuery(GET_ALL_MEMBERS);
  
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedItemId, setSelectedItemId] = useState(null); 
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); 
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false); 
  const [itemType, setItemType] = useState(null); 
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

  if (activeSection === 'books') {
    if (loadingBooks) return <p>Loading Books...</p>;
    if (errorBooks) return <p>Error: {errorBooks.message}</p>;
  } else {
    if (loadingMembers) return <p>Loading Members...</p>;
    if (errorMembers) return <p>Error: {errorMembers.message}</p>;
  }

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
            onClick={() => setIsModalOpen(true)} 
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
                      <td onClick={() => handleRowClick(book.id, 'book')}>{book.title}</td>
                      <td onClick={() => handleRowClick(book.id, 'book')}>{book.author}</td>
                      <td onClick={() => handleRowClick(book.id, 'book')}>{book.publicationYear}</td>
                      <td onClick={() => handleRowClick(book.id, 'book')}>{book.stock}</td>
                      <td onClick={() => handleRowClick(book.id, 'book')}>{book.rentFee}</td>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers?.map((member) => (
                    <tr key={member.id} onClick={() => handleRowClick(member.id, 'member')}>
                      <td>{`${member.firstName} ${member.lastName}`}</td>
                      <td>{member.email}</td>
                      <td>{member.phoneNumber}</td>
                      <td>{member.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>

      {isModalOpen && (
        <AddModal 
          onClose={() => setIsModalOpen(false)} 
          activeSection={activeSection}
        />
      )}

      {isDetailsModalOpen && (
        <DetailsModal 
          itemId={selectedItemId} 
          type={itemType} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}

      {isIssueModalOpen && (
        <IssueBook 
          bookId={selectedItemId} 
          onClose={() => setIsIssueModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Home;
