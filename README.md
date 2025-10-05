# 🎨 ArtVault NFT Marketplace

<div align="center">

![ArtVault Banner](https://img.shields.io/badge/Web3-NFT%20Marketplace-blueviolet?style=for-the-badge)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/address/0xD553f7a1b771824cFEF27Af1103D023D89983AAE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)

**A full-stack Web3 NFT marketplace for creating, collecting, and showcasing digital art on the Ethereum blockchain.**

[🌐 Live Demo](https://frontend-am0waxzvn-suhaas-nvs-projects.vercel.app) • [📝 Documentation](#installation) • [🎯 Features](#features) • [⚡ Quick Start](#quick-start)

</div>

---

## 📖 Overview

**ArtVault** is a production-ready NFT marketplace built on Ethereum that enables artists and collectors to mint, trade, and showcase digital art NFTs. The platform features a beautiful Apple-inspired minimalist design, decentralized IPFS storage, and seamless Web3 wallet integration.

### 🎯 Key Highlights

- ✅ **ERC-721 Compliant** - Standard NFT smart contract with 100% test coverage
- ✅ **Decentralized Storage** - IPFS integration via Pinata for permanent artwork storage
- ✅ **Beautiful UI/UX** - Apple-inspired minimalist design with smooth animations
- ✅ **Production Ready** - Deployed and verified on Ethereum Sepolia testnet
- ✅ **Fully Responsive** - Optimized for mobile, tablet, and desktop

---

## ✨ Features

### 🎨 NFT Functionality
- **Mint NFTs** - Create unique digital art tokens with custom metadata
- **Browse Gallery** - Explore all minted NFTs in a beautiful grid layout
- **Personal Collection** - View your owned NFTs in a dedicated portfolio
- **NFT Details** - View full metadata, ownership, and transaction history
- **Transfer NFTs** - Send NFTs to other wallet addresses securely

### 🔐 Web3 Integration
- **Wallet Connection** - Seamless authentication with MetaMask and other wallets
- **Real-time Updates** - Live transaction tracking and status updates
- **Smart Contract Interaction** - Direct blockchain communication
- **Gas Optimization** - Efficient contract design to minimize transaction costs

### 💎 Platform Features
- **IPFS Storage** - Decentralized, permanent storage for artwork and metadata
- **Rarity System** - NFT rarity badges (Legendary, Epic, Rare, Common)
- **Toast Notifications** - Beautiful, professional notifications for all user actions
- **Loading States** - Smooth loading indicators and progress feedback
- **Search & Filter** - Find NFTs by name, owner, or attributes
- **Responsive Design** - Flawless experience across all devices
- **Loading States** - Professional skeleton loaders and feedback

---

## 🛠️ Tech Stack

### Blockchain
- **Solidity** `0.8.20` - Smart contract language
- **Hardhat** - Development environment and testing framework
- **OpenZeppelin** `v5.0` - Secure, audited contract libraries
- **Ethers.js** `v6` - Ethereum library for JavaScript
- **Chai** - Testing framework

### Frontend
- **Next.js** `14` - React framework with App Router
- **TypeScript** `5.0` - Type-safe development
- **Tailwind CSS** `3.4` - Utility-first styling
- **wagmi** - React Hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **React Spring** - Smooth animations

### Infrastructure
- **IPFS** - Decentralized storage via Pinata
- **Alchemy** - Ethereum RPC provider
- **Vercel** - Frontend hosting and deployment
- **Git** - Version control

---

## 📦 Installation

### Prerequisites

- Node.js `v18+`
- npm or yarn
- MetaMask browser extension
- Git

### Clone Repository

```bash
git clone https://github.com/SuhaasNv/artvault-nft-platform.git
cd artvault-nft-platform
```

### Install Dependencies

#### Blockchain
```bash
cd blockchain
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Environment Variables

#### Blockchain (`.env`)
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_jwt_token
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
```

---

## 🚀 Quick Start

### Run Smart Contract Tests

```bash
cd blockchain
npm run test
```

Expected output: ✅ 26 passing tests

### Deploy Smart Contract (Local)

```bash
npm run deploy:local
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🎯 Usage

### 1. Connect Wallet
Click the "Connect Wallet" button in the navigation bar and approve the connection in MetaMask.

### 2. Mint an NFT
- Navigate to the **Mint** page
- Upload your artwork (JPG, PNG, GIF)
- Add title, description, and artist name
- Click "Mint NFT" and approve the transaction
- Wait ~15-30 seconds for confirmation

### 3. View Your Collection
- Go to **My NFTs** to see your personal collection
- Click any NFT to view full details

### 4. Browse Gallery
- Explore all minted NFTs in the **Gallery**
- Click any NFT to see details, owner, and metadata

### 5. Transfer NFT
- Open an NFT you own
- Click "Transfer NFT"
- Enter recipient wallet address
- Approve transaction in MetaMask

---

## 📐 Smart Contract

### Contract Details

- **Address (Sepolia):** [`0xD553f7a1b771824cFEF27Af1103D023D89983AAE`](https://sepolia.etherscan.io/address/0xD553f7a1b771824cFEF27Af1103D023D89983AAE)
- **Standard:** ERC-721
- **Network:** Ethereum Sepolia Testnet
- **Verified:** ✅ Yes

### Key Functions

```solidity
// Mint a new NFT
function mintNFT(address to, string memory tokenURI) public payable returns (uint256)

// Get total minted NFTs
function getTotalSupply() public view returns (uint256)

// Get all NFTs owned by an address
function getTokensOfOwner(address owner) public view returns (uint256[] memory)

// Get NFT metadata URI
function tokenURI(uint256 tokenId) public view returns (string memory)

// Transfer NFT ownership
function safeTransferFrom(address from, address to, uint256 tokenId) public
```

### Contract Features

- ✅ Payable minting (0.01 ETH)
- ✅ Max supply limit (10,000 NFTs)
- ✅ Owner-only functions (withdraw, price adjustment)
- ✅ Gas-optimized implementation
- ✅ Event emission for all state changes
- ✅ Secure ownership controls

### Testing

```bash
cd blockchain
npm run test
```

**Test Coverage:** 26/26 tests passing (100%)

- ✅ Deployment & initialization
- ✅ Minting functionality
- ✅ Payment validation
- ✅ Token URI management
- ✅ Query functions
- ✅ Transfer operations
- ✅ Owner-only functions
- ✅ Edge cases

---

## 🏗️ Project Structure

```
artvault/
├── blockchain/                 # Smart contract development
│   ├── contracts/
│   │   └── ArtVault.sol       # Main NFT contract
│   ├── test/
│   │   └── ArtVault.test.js   # Comprehensive tests
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   └── hardhat.config.js      # Hardhat configuration
│
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── mint/          # NFT minting
│   │   │   ├── gallery/       # Browse NFTs
│   │   │   ├── my-nfts/       # Personal collection
│   │   │   └── nft/[id]/      # NFT details
│   │   ├── components/        # React components
│   │   ├── contracts/         # Contract ABI & config
│   │   ├── lib/               # Utilities
│   │   └── providers/         # Web3 providers
│   ├── public/                # Static assets
│   └── package.json
│
└── README.md
```

---

## 🎨 Screenshots

**🌐 View Live Demo:** https://frontend-am0waxzvn-suhaas-nvs-projects.vercel.app

### Homepage
Beautiful Apple-inspired design with NFT showcase

### NFT Minting
Drag-and-drop interface for creating new NFTs

### Gallery
Browse all minted NFTs in a responsive grid

### NFT Details
View complete metadata and ownership information

---

## 🧪 Testing

### Smart Contract Tests

```bash
cd blockchain
npm run test                  # Run all tests
npm run test:gas             # Run with gas reporting
npm run test:coverage        # Generate coverage report
```

### Frontend Testing

```bash
cd frontend
npm run build                # Test production build
npm run lint                 # Run ESLint
```

---

## 🚀 Deployment

### Deploy Smart Contract to Sepolia

1. Fund your wallet with Sepolia ETH from a faucet
2. Set environment variables in `blockchain/.env`
3. Deploy:

```bash
cd blockchain
npm run deploy:sepolia
```

4. Verify on Etherscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
4. Add environment variables
5. Deploy! 🚀

### 🌐 Live Demo

**Production URL:** https://frontend-am0waxzvn-suhaas-nvs-projects.vercel.app

The live demo includes:
- ✅ Full NFT marketplace functionality
- ✅ Wallet connection with MetaMask
- ✅ NFT minting (requires Sepolia testnet ETH)
- ✅ Gallery and collection views
- ✅ NFT detail pages and transfers

---

## 📊 Performance

### Smart Contract Gas Costs

| Operation | Gas Used | Approx. Cost (50 Gwei) |
|-----------|----------|-------------------------|
| Deploy    | 1,640,642| ~$5-10                 |
| Mint      | 112,752  | ~$0.50-2               |
| Transfer  | 59,673   | ~$0.30-1               |

### Frontend Metrics

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **Lighthouse Score:** 90+
- **Bundle Size:** Optimized with code splitting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Suhaas NV**

- GitHub: [@SuhaasNv](https://github.com/SuhaasNv)
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]

---

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contract libraries
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Next.js](https://nextjs.org/) - React framework
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UI
- [Pinata](https://www.pinata.cloud/) - IPFS hosting service

---

## 📞 Support

If you have any questions or need help, feel free to:

- Open an [Issue](https://github.com/SuhaasNv/artvault-nft-platform/issues)
- Contact me directly

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕ by Suhaas NV

</div>

