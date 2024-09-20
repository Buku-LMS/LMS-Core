import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import './Home.css';


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

const DetailsModal = ({ itemId, type, onClose }) => {
  const isBook = type === 'book';

  const { loading: loadingBook, error: errorBook, data: dataBook } = useQuery(GET_BOOK_DETAILS, {
    variables: { bookId: parseInt(itemId) },
    skip: !isBook,
  });

  const { loading: loadingMember, error: errorMember, data: dataMember } = useQuery(GET_MEMBER_DETAILS, {
    variables: { memberId: parseInt(itemId) },
    skip: isBook,
  });

  if (loadingBook || loadingMember) return <p>Loading...</p>;
  if (errorBook || errorMember) return <p>Error: {errorBook?.message || errorMember?.message}</p>;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        {isBook ? (
          <div>
            <h2>{dataBook.getBook.title}</h2>
            <p><strong>Author:</strong> {dataBook.getBook.author}</p>
            <p><strong>ISBN:</strong> {dataBook.getBook.isbn}</p>
            <p><strong>Publication Year:</strong> {dataBook.getBook.publicationYear}</p>
            <p><strong>Stock:</strong> {dataBook.getBook.stock}</p>
            <p><strong>Rent Fee:</strong> KES {dataBook.getBook.rentFee}</p>
          </div>
        ) : (
          <div>
            <h2>{`${dataMember.getMember.firstName} ${dataMember.getMember.lastName}`}</h2>
            <p><strong>Email:</strong> {dataMember.getMember.email}</p>
            <p><strong>Phone Number:</strong> {dataMember.getMember.phoneNumber}</p>
            <p><strong>Balance:</strong> KES {dataMember.getMember.balance}</p>
          </div>
        )}
      </div>
    </div>
  );
};

DetailsModal.propTypes = {
    itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['book', 'member']).isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default DetailsModal;
