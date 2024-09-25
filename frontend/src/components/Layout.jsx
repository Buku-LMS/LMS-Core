import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Layout.css'

const Layout = ({ children }) => {

  const navigate =useNavigate();

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="layout">
      <header className="header">
        <nav>
          <p onClick={handleHome}>Home</p>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default Layout;
