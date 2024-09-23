import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import IssueBook from './components/IssueBook';
import Transaction from './components/Transaction';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue-book/:id" element={<IssueBook />} />
        <Route path="/book-transactions/:memberId" element={<Transaction />} />
      </Routes>
    </Router>
  );
};

export default App;
