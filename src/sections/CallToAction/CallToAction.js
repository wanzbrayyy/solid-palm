import React from 'react';
import styles from './CallToAction.module.css';
import Button from '../../components/Button/Button';

function CallToAction() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.ctaTitle}>Siap Mengoptimalkan WhatsApp Bisnis Anda?</h2>
        <p className={styles.ctaSubtitle}>Daftar sekarang dan rasakan kemudahan otomatisasi Wanzofc Bot.</p>
        <Button variant="primary" size="large">Mulai Sekarang Gratis</Button>
      </div>
    </section>
  );
}

export default CallToAction;