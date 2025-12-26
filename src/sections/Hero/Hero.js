import React from 'react';
import styles from './Hero.module.css';
import Button from '../../components/Button/Button';
import heroIllustration from '../../assets/images/hero-illustration.svg';
import { Element } from 'react-scroll';

function Hero() {
  return (
    <Element name="hero" className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Wanzofc Bot: Otomatisasi WhatsApp Anda di Ujung Jari</h1>
          <p className={styles.subtitle}>Kirim Pesan Instan, Auto-Reply Cerdas, dan Kelola Multi-Akun dengan Mudah</p>
          <div className={styles.buttons}>
            <Button variant="primary" size="large">Mulai Sekarang Gratis</Button>
            <Button variant="secondary" size="large">Lihat Demo</Button>
          </div>
        </div>
        <div className={styles.illustration}>
          <img src={heroIllustration} alt="Wanzofc Bot Illustration" />
        </div>
      </div>
    </Element>
  );
}

export default Hero;