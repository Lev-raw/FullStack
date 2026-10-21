import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import abgLogo from '../assets/abglogo.svg';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Unable to sign out from Firebase:', error);
    }
  };

  return (
 <nav className='main-nav'>
       <input className='menu-toggle-input' type='checkbox' id='menu-toggle'/>
       <label className="menu-toggle" htmlFor="menu-toggle" aria-label="Toggle navigation menu" aria-controls="mobile-menu">
       <span></span>
    <span></span>
    <span></span>
  </label>


  <ul className='nav-left'>
     <li> <Link to="/">HOME</Link></li>
      <li><a href="/about">ABOUT<span className="chevron">⌄</span></a></li>
         <li className="dropdown-parent">
        <a href="#legacy">LEGACY<span className="chevron">⌄</span></a>
        <ul className="dropdown">
            <li><a href="#">FLASHBACK FILES</a></li>
            <li><a href="#">THE PIONEERS</a></li>
            <li><a href="#">GALLERY</a></li>
            <li><a href="#">DIGITAL ARCHIVES</a></li>
        </ul>
    </li>
     <li><a href="#spaces">INITIATIVES<span className="chevron">⌄</span></a></li>
    <li><a href="#spaces">SPACES<span className="chevron">⌄</span></a></li>
  </ul>
 
 
  <div className='logo-wrap'>
    <img src={abgLogo} alt="Aditya Birla Group" />
  </div>
          
          
             <ul className="nav-right">
  <li className="dropdown-parent">
    <Link to="/#pulse">PULSE &amp; PAGE<span className="chevron">⌄</span></Link>
    <ul className="dropdown">
      <li><Link to="/#pulse">VIEW POSTS</Link></li>
      <li><Link to="/admin/pulse">MANAGE POSTS</Link></li>
    </ul>
  </li>
  <li>
    <a href="#contact">HELLO</a>
  </li>
  <li>
    <a href="#showtime" className="btn-book">BOOK NOW</a>
  </li>
  <li className="search-btn">
    <a href="#" className="icon-btn search-icon" aria-label="Search">
      <svg viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7"></circle>
        <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
      </svg>
    </a>
  </li>
  <li className="profile-btn">
    <Link
      to={user ? "/account/profile" : "/login"}
      className="icon-btn profile-icon"
      aria-label={user ? `Signed in as ${user.email ?? user.displayName ?? 'user'}` : "Login"}
      title={user ? `Signed in as ${user.email ?? user.displayName ?? 'user'}` : "Login"}
    >
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="7.5" r="3.5"></circle>
        <path d="M5 21c0-4 2.8-6.5 7-6.5s7 2.5 7 6.5"></path>
      </svg>
    </Link>
  </li>
 
</ul>
  <div className="mobile-menu" id="mobile-menu">
    <ul>
      <li><Link to="/">HOME</Link></li>
      <li><a href="#about">ABOUT</a></li>
      <li><a href="#legacy">LEGACY</a></li>
      <li><a href="#spaces">INITIATIVES</a></li>
      <li><a href="#spaces">SPACES</a></li>
      <li><Link to="/#pulse">PULSE &amp; PAGE</Link></li>
      <li><a href="#contact">HELLO</a></li>
      <li><a href="#showtime">BOOK NOW</a></li>
      <li><Link to={user ? "/account/profile" : "/login"}>MY ACCOUNT</Link></li>
      {user && <li><button className="auth-signout" type="button" onClick={handleSignOut}>LOG OUT</button></li>}
    </ul>
  </div>
 </nav>
  )
}

export default Navbar
