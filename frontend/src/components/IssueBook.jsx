import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import './IssueBook.css';

const ISSUE_BOOK = gql`
  mutation IssueBook($bookId: Int!, $memberId: Int!) {
    issueBook(bookId: $bookId, memberId: $memberId) {
      fee
      issueDate
      returnDate
      book {
        title
        stock
      }
      member {
        firstName
        lastName
        balance
      }
    }
  }
`;

const GET_ALL_MEMBERS = gql`
  query GetAllMembers {
    allMembers {
      id
      firstName
      lastName
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

const IssueBook = () => {
  const { id: bookId } = useParams();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState(null); 
  const navigate = useNavigate();

  const parsedBookId = bookId ? parseInt(bookId, 10) : null;

  const { loading: loadingBook, error: errorBook, data: bookData } = useQuery(GET_BOOK_DETAILS, {
    variables: { bookId: parsedBookId },
    skip: !parsedBookId,
  });

  const { loading: loadingMembers, error: errorMembers, data: dataMembers } = useQuery(GET_ALL_MEMBERS);

  const [issueBook, { loading: loadingIssue }] = useMutation(ISSUE_BOOK, {
    onCompleted: (data) => {
      if (data.issueBook.book.stock > 0) {
        setIssueSuccess(true); 
      } else {
        setIssueSuccess(false); 
      }
    },
    onError: () => {
      setIssueSuccess(false); 
    },
    refetchQueries: [{ query: GET_ALL_BOOKS }]
  });

  const handleIssueBook = () => {
    setShowConfirmModal(true);
  };

  const confirmIssueBook = () => {
    issueBook({
      variables: { bookId: parsedBookId, memberId: parseInt(selectedMemberId, 10) },
    });
    setShowConfirmModal(false); 
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loadingBook || loadingMembers) return <p>Loading...</p>;
  if (errorBook || errorMembers) return <p>Error: {errorBook?.message || errorMembers?.message}</p>;

  const filteredMembers = dataMembers?.allMembers.filter(member => 
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="issue-book-page">
      <h2>Issue Book</h2>
      
      {bookData?.getBook && (
        <div className="book-details">
          <h3>Book Details</h3>
          <p><strong>Title:</strong> {bookData.getBook.title}</p>
          <p><strong>Author:</strong> {bookData.getBook.author}</p>
          <p><strong>ISBN:</strong> {bookData.getBook.isbn}</p>
          <p><strong>Publication Year:</strong> {bookData.getBook.publicationYear}</p>
          <p><strong>Stock:</strong> {bookData.getBook.stock}</p>
          <p><strong>Rent Fee:</strong> KES {bookData.getBook.rentFee.toFixed(2)}</p>
        </div>
      )}

      <p>Issue to:</p>
      <input 
        type="text" 
        className="search-bar"
        placeholder="Search for a member..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      <ul className="member-list">
        {filteredMembers?.map((member) => (
          <li 
            key={member.id} 
            onClick={() => setSelectedMemberId(member.id)} 
            className={`member-item ${selectedMemberId === member.id ? 'selected' : ''}`}
          >
            {member.firstName} {member.lastName}
          </li>
        ))}
      </ul>

      <div className="button-container">
        <button className="issue-book-btn" onClick={handleIssueBook} disabled={!selectedMemberId || loadingIssue}>
          {loadingIssue ? 'Issuing...' : 'Issue Book'}
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Issue</h3>
            <p>Are you sure you want to issue this book to the selected member?</p>
            <div className="modal-buttons">
              <button onClick={confirmIssueBook} className="confirm-btn">Confirm</button>
              <button onClick={() => setShowConfirmModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {issueSuccess !== null && (
        <div className="modal">
          <div className="modal-content">
            <h3>{issueSuccess ? 'Book Issued Successfully' : 'Issue Failed'}</h3>
            <p>{issueSuccess ? 'The book has been successfully issued.' : 'The book is out of stock.'}</p>
            <button onClick={() => {
              setIssueSuccess(null);
              navigate('/'); 
            }} className="confirm-btn">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueBook;
