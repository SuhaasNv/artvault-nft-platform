/**
 * ArtVault Contract Configuration
 * 
 * This file contains the deployed contract address and ABI
 * for interacting with the ArtVault NFT contract on Sepolia testnet
 */

import ArtVaultArtifact from './ArtVault.json';

// Contract address on Sepolia testnet
export const ARTVAULT_ADDRESS = '0xD553f7a1b771824cFEF27Af1103D023D89983AAE' as `0x${string}`;

// Contract ABI (Application Binary Interface)
// This tells the frontend how to interact with the smart contract
export const ARTVAULT_ABI = ArtVaultArtifact.abi;

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111;

// Etherscan link for viewing the contract
export const ETHERSCAN_LINK = `https://sepolia.etherscan.io/address/${ARTVAULT_ADDRESS}`;

// Contract deployment info
export const CONTRACT_INFO = {
  address: ARTVAULT_ADDRESS,
  abi: ARTVAULT_ABI,
  chainId: SEPOLIA_CHAIN_ID,
  network: 'Sepolia',
  etherscanLink: ETHERSCAN_LINK,
} as const;

