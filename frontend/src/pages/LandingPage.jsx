import React from 'react';
import HeroSection from '../components/HeroSection';
import ChatInterface from '../components/chat/ChatInterface';
import Features from '../components/Features.jsx';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ChatInterface />
      <Features />
    </>
  );
}
