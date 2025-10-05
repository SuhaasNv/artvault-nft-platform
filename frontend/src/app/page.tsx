'use client';

/**
 * ArtVault Homepage - Premium Apple-Inspired Design
 * 
 * Design Philosophy:
 * - Ultra-clean and minimal (inspired by Apple.com, Linear, Stripe)
 * - Subtle, purposeful animations
 * - Generous white space and breathing room
 * - Strong visual hierarchy
 * - Bold typography with perfect contrast
 * - No distracting elements
 * - Professional and portfolio-ready
 */

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useSpring, animated as a, config } from '@react-spring/web';
import React, { useState, useEffect } from 'react';

// Clean, Apple-style feature card
const FeatureCard = ({ icon, title, description, link, delay }: any) => {
  const entranceSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: delay * 100,
    config: config.gentle,
  });

  return (
    <a.div style={entranceSpring}>
      <Link href={link}>
        <div className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-10 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl">
          <div className="text-5xl mb-6">{icon}</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg mb-6">
            {description}
          </p>
          <div className="inline-flex items-center text-gray-900 dark:text-white font-medium group-hover:gap-3 gap-2 transition-all">
            <span className="text-sm">Learn more</span>
            <span className="transform group-hover:translate-x-1 transition-transform text-sm">→</span>
          </div>
        </div>
      </Link>
    </a.div>
  );
};

export default function Home() {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);

  // ALL HOOKS MUST BE DECLARED AT THE TOP IN SAME ORDER
  const heroSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.slow,
  });

  const subtitleSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 400,
    config: config.slow,
  });

  const connectionSpring = useSpring({
    opacity: isConnected ? 1 : 0,
    transform: isConnected ? 'scale(1)' : 'scale(0.95)',
    config: config.gentle,
  });

  const navSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
  });

  const contractSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 600,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { 
      icon: '🎨', 
      title: 'Mint NFTs', 
      description: 'Create unique digital art tokens on the blockchain with just a few clicks', 
      link: '/mint'
    },
    { 
      icon: '🖼️', 
      title: 'Gallery', 
      description: 'Explore and discover an ever-growing collection of digital masterpieces', 
      link: '/gallery'
    },
    { 
      icon: '💎', 
      title: 'My Collection', 
      description: 'View, manage, and showcase your personal NFT collection', 
      link: '/my-nfts'
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black">
      
      {/* Ultra-Minimal Navigation - Apple Style */}
      <a.nav 
        style={navSpring}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="group">
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight group-hover:opacity-70 transition-opacity">
                ArtVault
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/mint" className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Mint
              </Link>
              <Link href="/gallery" className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Gallery
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </a.nav>

      {/* Hero Section - With Animated Background */}
      <section className="relative pt-32 pb-20 px-6 md:px-8 min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-blue-950/20 dark:via-black dark:to-purple-950/20"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <a.div style={heroSpring}>
            <div className="inline-flex items-center gap-2 bg-gray-900/5 dark:bg-white/5 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Web3 NFT Platform
              </span>
            </div>
          </a.div>

          {/* Main Title - Always Visible, No Animation Issues */}
          <a.h1 
            style={heroSpring}
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-gray-900 dark:text-white leading-none"
          >
            ArtVault
          </a.h1>
          
          {/* Subtitle */}
          <a.p 
            style={subtitleSpring}
            className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mb-4 font-light leading-relaxed max-w-3xl mx-auto"
          >
            Create, collect, and showcase digital art on the blockchain.
          </a.p>

          <a.p 
            style={subtitleSpring}
            className="text-base md:text-lg text-gray-500 dark:text-gray-500 mb-12 font-light max-w-2xl mx-auto"
          >
            A new era of digital ownership.
          </a.p>

          {/* Connection Status - Clean */}
          {isConnected ? (
            <a.div style={connectionSpring} className="mb-10">
              <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-900 rounded-full px-6 py-3 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-900 dark:text-white font-medium text-sm">
                    Connected
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            </a.div>
          ) : (
            <div className="mb-10 inline-flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Connect wallet to get started</span>
            </div>
          )}

          {/* CTA Buttons - Premium */}
          <a.div style={subtitleSpring} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/mint"
              className="group relative overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>Start Minting</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link 
              href="/gallery"
              className="group bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>Explore Gallery</span>
            </Link>
          </a.div>
        </div>
      </section>

      {/* NFT Showcase Section - Visual Interest */}
      <section className="relative py-20 md:py-24 px-6 md:px-8 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Showcase your digital art
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Transform your creativity into unique NFTs
            </p>
          </div>

          {/* Sample NFT Cards Grid - Real NFT Artwork! */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { 
                image: '/nft-samples/ape-halo.jpg', 
                label: 'Holy Ape #7421', 
                rarity: 'Legendary',
                rarityColor: 'from-yellow-400 to-orange-500'
              },
              { 
                image: '/nft-samples/ape-3d.jpg', 
                label: 'Future Ape #3142', 
                rarity: 'Epic',
                rarityColor: 'from-purple-400 to-pink-500'
              },
              { 
                image: '/nft-samples/ape-king.jpg', 
                label: 'King Ape #1337', 
                rarity: 'Mythic',
                rarityColor: 'from-blue-400 to-cyan-500'
              },
              { 
                image: '/nft-samples/ape-caesar.jpg', 
                label: 'Caesar Ape #6969', 
                rarity: 'Rare',
                rarityColor: 'from-green-400 to-emerald-500'
              },
            ].map((item, i) => (
              <div 
                key={i}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.08] hover:shadow-2xl hover:-translate-y-2"
              >
                {/* NFT Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                  <img 
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to gradient if image not found
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Animated border glow effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${item.rarityColor} blur-xl -z-10`}></div>
                
                {/* Info bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-sm">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white text-sm font-bold mb-1 drop-shadow-lg">{item.label}</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${item.rarityColor} animate-pulse`}></div>
                        <p className={`text-xs font-semibold bg-gradient-to-r ${item.rarityColor} bg-clip-text text-transparent`}>
                          {item.rarity}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                      <span className="text-white text-xs font-mono font-bold">#{i + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Rarity badge - Top right */}
                <div className={`absolute top-3 right-3 bg-gradient-to-r ${item.rarityColor} rounded-full px-3 py-1.5 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-xs font-bold drop-shadow-md">✨ {item.rarity}</span>
                </div>

                {/* Hover "View" indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-white/40">
                    <span className="text-white font-bold text-sm">VIEW NFT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - With Floating Elements */}
      <section className="relative py-24 md:py-32 px-6 md:px-8 bg-white dark:bg-black overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-2xl animate-float-slow"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Everything you need
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              A complete platform for creating, collecting, and managing your digital art NFTs
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Visual Appeal */}
      <section className="relative py-20 md:py-24 px-6 md:px-8 bg-gradient-to-br from-gray-900 to-black dark:from-gray-950 dark:to-black text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for creators
            </h2>
            <p className="text-gray-400 text-lg">
              Join the future of digital art
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K', label: 'Max Supply' },
              { value: '0.01', label: 'ETH Mint Price' },
              { value: '100%', label: 'On-Chain' },
              { value: '∞', label: 'Possibilities' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract Section - Clean */}
      <section className="py-20 md:py-24 px-6 md:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <a.div style={contractSpring}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 rounded-full px-3 py-1.5 mb-4 border border-gray-200 dark:border-gray-800">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  Live on Sepolia
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Smart Contract
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Verified and secured on Ethereum
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                    Contract Address
                  </p>
                  <p className="font-mono text-sm md:text-base text-gray-900 dark:text-white break-all">
                    0xD553f7a1b771824cFEF27Af1103D023D89983AAE
                  </p>
                </div>
                <a 
                  href="https://sepolia.etherscan.io/address/0xD553f7a1b771824cFEF27Af1103D023D89983AAE"
          target="_blank"
          rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition-all text-sm"
                >
                  <span>View on Etherscan</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </a.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 md:py-16 px-6 md:px-8 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ArtVault
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your journey into Web3
              </p>
            </div>
            
            <div className="flex gap-8">
              <Link href="/mint" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Mint
              </Link>
              <Link href="/gallery" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/my-nfts" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Collection
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-600">
              © 2025 ArtVault. Built on Ethereum Sepolia Testnet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
