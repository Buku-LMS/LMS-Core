import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const GET_MEMBER_BOOKS = gql`
  query GetMemberBooks($memberId: Int!) {
    memberTransactions(memberId: $memberId) {
      fee
      id
      book {
        title
        publicationYear
        isbn
        author
      }
      issueDate
    }
  }
`;

const RETURN_BOOK_MUTATION = gql`
  mutation ReturnBook($transactionId: Int!) {
    returnBook(transactionId: $transactionId) {
      fee
      id
      issueDate
      returnDate
      book {
        id
        title
        publicationYear
        isbn
      }
      member {
        balance
        lastName
        firstName
      }
    }
  }
`;

const Transaction = () => {
  const { memberId } = useParams();
  const { loading, error, data } = useQuery(GET_MEMBER_BOOKS, {
    variables: { memberId: parseInt(memberId) },
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [returnBook] = useMutation(RETURN_BOOK_MUTATION, {
    onCompleted: () => {
      setShowModal(false);
    },
    onError: (error) => {
      console.error("Error returning book:", error);
    }
  });

  const handleReturnClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleReturnBook = () => {
    if (selectedTransaction) {
      returnBook({ variables: { transactionId: parseInt(selectedTransaction.id, 10) } });
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="transaction-page">
      <h2>Books Issued to Member</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Issue Date</th>
            <th>Fee (KES)</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {data.memberTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.book.title}</td>
              <td>{transaction.book.author}</td>
              <td>{transaction.book.publicationYear}</td>
              <td>{new Date(transaction.issueDate).toLocaleDateString()}</td>
              <td>{transaction.fee}</td>
              <td>
                <FontAwesomeIcon 
                  icon={faExchangeAlt} 
                  onClick={() => handleReturnClick(transaction)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Return Book</h3>
            <p>Are you sure you want to return the book: <strong>{selectedTransaction?.book.title}</strong>?</p>
            <button onClick={handleReturnBook}>Confirm Return</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
