import React from 'react';
import styles from './Button.module.css';

function Button({ children, variant = 'primary', size = 'medium', onClick, type = 'button' }) {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]}`;
  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;