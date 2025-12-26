import React from 'react';
import styles from './Footer.module.css';
import logo from '../../assets/images/wanzofc-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Element } from 'react-scroll';

function Footer() {
  return (
    <Element name="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.brandInfo}>
            <img src={logo} alt="Wanzofc Bot Logo" className={styles.footerLogo} />
            <p className={styles.tagline}>Otomatisasi WhatsApp Anda di Ujung Jari.</p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>

          <div className={styles.footerLinks}>
            <h3>Legal</h3>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          <div className={styles.contactInfo}>
            <h3>Contact Us</h3>
            <p>Email: <a href="mailto:info@wanzofc.com">info@wanzofc.com</a></p>
            <p>Phone: +62 812-3456-7890</p>
            <p>Address: Jl. Contoh No. 123, Jakarta, Indonesia</p>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Wanzofc Bot. All rights reserved.</p>
        </div>
      </div>
    </Element>
  );
}

export default Footer;