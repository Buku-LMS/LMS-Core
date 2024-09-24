import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import IssueBook from './components/IssueBook';
import ReturnBook from './components/ReturnBook';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue-book/:id" element={<IssueBook />} />
        <Route path="/book-transactions/:memberId" element={<ReturnBook />} />
      </Routes>
    </Router>
  );
};

export default App;
