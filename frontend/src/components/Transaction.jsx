import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

const GET_MEMBER_BOOKS = gql`
  query GetMemberBooks($memberId: Int!) {
    memberTransactions(memberId: $memberId) {
      fee
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

const Transaction = () => {
  const { memberId } = useParams();
  const { loading, error, data } = useQuery(GET_MEMBER_BOOKS, {
    variables: { memberId: parseInt(memberId) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="book-details">
      <h2>Books Issued to Member</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Issue Date</th>
            <th>Fee (KES)</th>
          </tr>
        </thead>
        <tbody>
          {data.memberTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.book.title}</td>
              <td>{transaction.book.author}</td>
              <td>{transaction.book.publicationYear}</td>
              <td>{new Date(transaction.issueDate).toLocaleDateString()}</td>
              <td>{transaction.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
