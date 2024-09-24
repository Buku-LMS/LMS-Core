import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

const ISSUED_BOOKS = gql`
  query GetIssuedBooks($memberId: Int!) {
    issuedBooks(memberId: $memberId) {
      issueDate
      id
      member {
        firstName
        lastName
      }
      book {
        title
        author
        publicationYear
      }
      fee
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

const ReturnBook = () => {
  const { memberId } = useParams();
  const { loading: loadingBooks, error: errorBooks, data: dataBooks, refetch: refetchBooks } = useQuery(ISSUED_BOOKS, {
    variables: { memberId: parseInt(memberId) },
  });

  const { loading: loadingMember, error: errorMember, data: dataMember, refetch: refetchMember } = useQuery(GET_MEMBER_DETAILS, {
    variables: { memberId: parseInt(memberId) },
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [returnBook] = useMutation(RETURN_BOOK_MUTATION, {
    onCompleted: () => {
      setShowModal(false);
      refetchBooks();
      refetchMember();
    },
    onError: (error) => {
      console.error("Error returning book:", error);
    }
  });

  useEffect(() => {
    refetchBooks();
    refetchMember();
  }, [memberId, refetchBooks, refetchMember]);

  const handleReturnClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleReturnBook = () => {
    if (selectedTransaction) {
      returnBook({ variables: { transactionId: parseInt(selectedTransaction.id, 10) } });
    }
  };

  if (loadingBooks || loadingMember) return <p>Loading...</p>;
  if (errorBooks || errorMember) return <p>Error: {errorBooks?.message || errorMember?.message}</p>;

  return (
    <div className="transaction-page">
      <h2>Books Issued to Member</h2>
      <h3>Member Balance: KES {dataMember.getMember.balance.toFixed(2)}</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Issue Date</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {dataBooks.issuedBooks.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.book.title}</td>
              <td>{transaction.book.author}</td>
              <td>{transaction.book.publicationYear}</td>
              <td>{new Date(transaction.issueDate).toLocaleDateString()}</td>
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
            <p>{selectedTransaction?.member.firstName} {selectedTransaction?.member.lastName} will be charged KES {selectedTransaction?.fee.toFixed(2)}</p>
            <button onClick={handleReturnBook}>Confirm Return</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnBook;
