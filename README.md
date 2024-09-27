# Library Management System

A comprehensive Library Management System designed to manage books and members efficiently. This application provides features for adding books, registering members, issuing and returning books, and updating or viewing detailed information about books and members

## Table of Contents
- [Homepage](#homepage)
- [Add Book](#add-book)
- [Book Details](#book-details)
- [Update Book](#update-book)
- [Register Member](#register-member)
- [Member Details](#member-details)
- [Update Member](#update-member)
- [Issue Book](#issue-book)
- [Issue Confirmation](#issue-confirmation)
- [Issue Book Success/Failed Cases](#issue-book-successfailed-cases)
- [Return Book](#return-book)
- [Return Confirmation](#return-confirmation)
- [Return Book Success/Failed Cases](#return-book-successfailed-cases)
- [Technologies Used](#technologies-used)

## Homepage

On the homepage, librarians can easily access the main functionalities of the application. The interface displays a summary of available books and registered members, allowing quick navigation to different sections.

![Homepage](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Homepage.png)
*The homepage provides access to books and members.*

## Add Book

Librarians can add new books to the system using the "Add Book" feature. This section includes a form where users can input details such as title, author, publication year, and ISBN.

![Add Book](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Add%20Book.png)
*The Add Book form allows librarians to input book details.*

## Book Details

Once a book is added, librarians can view detailed information about it. This includes the book's title, author, publication year, and current status (available or issued).

![Book Details](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Book%20Details.png)
*Detailed view of a book's information.*

## Update Book

Librarians can update details of existing books using the "Update Book" feature. This allows for modifications to be made as necessary.

![Update Book](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Update%20Book.png)
*The Update Book form for modifying book details.*

## Register Member

The system allows librarians to register new members. The "Register Member" section features a form for entering member details, including name, email, phone number, and initial balance.

![Register Member](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Register%20Member.png)
*The Register Member form for adding new members.*

## Member Details

After registering, librarians can view detailed information about each member. This includes personal details and their current balance.

![Member Details](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Membe%20Details.png)
*Detailed view of a member's information.*

## Update Member

Librarians can update member details using the "Update Member" feature, ensuring that all member information remains current.

![Update Member](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Update%20Member.png)
*The Update Member form for modifying member details.*

## Issue Book

Librarians can issue books to members through the "Issue Book" section. This process includes selecting a member, choosing a book, and confirming the transaction.

![Issue Book](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Issue%20Book.png)
*Issuing a book to a member.*

### Issue Confirmation

Before a book is issued, a confirmation message is displayed to the librarian.

![Issue Confirmation](https://github.com/maritimezra/Library-Management-System/blob/c95b93c5212b51af277af4444fdef39164c23598/images/IssueConfirmation.png)
*Confirmation message before book issuance.*

### Issue Book Success/Failed Cases

The application handles both successful and failed book issuance cases, providing appropriate feedback to the user.

![Issue Successful](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Issue%20Successful.png)
*Success message after issuing a book.*

![Issue Failed](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Issue%20Failed.png)
*Error message if the book issuance fails for being out of stock.*

## Return Book

Librarians can manage book returns through the "Return Book" section. This feature allows them to select a book that has been issued and confirm its return.

![Return Book](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Book%20Issues.png)
*Returning a book to the library.*

### Return Confirmation

After successfully returning a book, a confirmation message is displayed to the librarian.

![Return Confirmation](https://github.com/maritimezra/Library-Management-System/blob/c95b93c5212b51af277af4444fdef39164c23598/images/Return%20Confirmation.png)
*Confirmation message before book return.*

### Return Book Success/Failed Cases

The application provides feedback for both successful and failed book returns.

![Return Successful](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Return%20Successful.png)
*Success message after returning a book.*

![Return Failed](https://github.com/maritimezra/Library-Management-System/blob/b173e1a587c4772efa66115e84cd4dca71e49158/images/Return%20Failed.png)
*Error message if the book return fails due to member exceeding allowed debt(KES500).*

## Technologies Used

- **Frontend**: JavaScript(React), Apollo Client, CSS
- **Backend**: Python(Django), GraphQL, SQLite3
- **Database**: MongoDB
- **Others**: Font Awesome for icons, React Router for navigation
