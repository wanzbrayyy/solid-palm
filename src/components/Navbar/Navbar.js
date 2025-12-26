import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import styles from './Navbar.module.css';
import logo from '../../assets/images/wanzofc-logo.png';
import Button from '../Button/Button';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <ScrollLink to="hero" smooth={true} duration={500} className={styles.logoLink}>
          <img src={logo} alt="Wanzofc Bot Logo" className={styles.logo} />
        </ScrollLink>
        <div className={styles.menuToggle} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
          <li>
            <ScrollLink to="hero" smooth={true} duration={500} onClick={toggleMenu}>Home</ScrollLink>
          </li>
          <li>
            <ScrollLink to="features" smooth={true} duration={500} onClick={toggleMenu}>Features</ScrollLink>
          </li>
          <li>
            <ScrollLink to="contact" smooth={true} duration={500} onClick={toggleMenu}>Contact</ScrollLink>
          </li>
          <li>
            <Button variant="primary" size="small" onClick={toggleMenu}>Get Started</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;