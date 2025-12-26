import React from 'react';
import styles from './Features.module.css';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import { faRobot, faMessage, faChartLine, faUsers, faCodeBranch, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';

function Features() {
  const featuresData = [
    {
      icon: faMessage,
      title: 'Pesan Otomatis',
      description: 'Kirim pesan terjadwal atau broadcast ke ribuan kontak dengan mudah.'
    },
    {
      icon: faRobot,
      title: 'Auto-Reply Cerdas',
      description: 'Respon otomatis terhadap pesan masuk dengan AI yang dapat disesuaikan.'
    },
    {
      icon: faChartLine,
      title: 'Analisis Statistik',
      description: 'Pantau performa kampanye dan interaksi pelanggan dengan laporan detail.'
    },
    {
      icon: faUsers,
      title: 'Manajemen Multi-Akun',
      description: 'Kelola beberapa akun WhatsApp dari satu dashboard yang intuitif.'
    },
    {
      icon: faCodeBranch,
      title: 'Integrasi API',
      description: 'Hubungkan Wanzofc Bot dengan sistem Anda menggunakan API yang fleksibel.'
    },
    {
      icon: faShieldHalved,
      title: 'Keamanan Terjamin',
      description: 'Data Anda aman dengan enkripsi tingkat tinggi dan protokol keamanan ketat.'
    },
  ];

  return (
    <Element name="features" className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Fitur Unggulan Wanzofc Bot</h2>
        <p className={styles.sectionSubtitle}>Dapatkan kemampuan WhatsApp otomatisasi terbaik untuk bisnis Anda.</p>
        <div className={styles.featuresGrid}>
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </Element>
  );
}

export default Features;