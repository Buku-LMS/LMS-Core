import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import IssueBook from './components/IssueBook';
import ReturnBook from './components/ReturnBook';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issue-book/:id" element={<IssueBook />} />
          <Route path="/book-transactions/:memberId" element={<ReturnBook />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
