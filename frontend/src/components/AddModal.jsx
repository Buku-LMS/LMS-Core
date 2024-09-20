import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import './Home.css';


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

const AddModal = ({ onClose, activeSection }) => {
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

  const [balance, setBalance] = useState('')

  const [addBook, { loading: loadingBook }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      onClose();
    },
    refetchQueries: [{ query: GET_ALL_BOOKS }],
    onError: (error) => {
      console.error("Error adding book:", error);
    },
  });

  const [registerMember, { loading: loadingMember }] = useMutation(REGISTER_MEMBER, {
    onCompleted: () => {
      onClose();
    },
    refetchQueries: [{ query: GET_ALL_MEMBERS }],
    onError: (error) => {
      console.error("Error registering member:", error);
    },
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(201), (val, index) => currentYear - index);

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
      console.log("Please fill all required fields.");
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
      console.log("Please fill all required fields.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
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
                {years.map((year) => (
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
  );
};

AddModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
};

export default AddModal;
