import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './sections/Hero/Hero';
import Features from './sections/Features/Features';
import CallToAction from './sections/CallToAction/CallToAction';
import Footer from './sections/Footer/Footer';
import './assets/styles/global.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default App;