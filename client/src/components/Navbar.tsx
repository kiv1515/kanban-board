import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(auth.loggedIn());
  const navigate = useNavigate();

  // Update login status whenever auth state changes
  useEffect(() => {
    const checkLogin = () => {
      const isLoggedIn = auth.loggedIn();
      setLoginCheck(isLoggedIn);
    };

    // Check initially
    checkLogin();

    // Set up an interval to periodically check login status
    const interval = setInterval(checkLogin, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setLoginCheck(false);
    navigate('/');
  };

  return (
    <div className='nav'>
      <div className='nav-title'>
        <Link to='/'>Krazy Kanban Board</Link>
      </div>
      <ul>
        {!loginCheck ? (
          <li className='nav-item'>
            <button type='button'>
              <Link to='/login'>Login</Link>
            </button>
          </li>
        ) : (
          <li className='nav-item'>
            <button type='button' onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;