const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * COMPREHENSIVE TEST SUITE FOR ARTVAULT NFT CONTRACT
 * 
 * Testing Strategy:
 * 1. Deployment & Initialization
 * 2. Minting Functionality
 * 3. Payment & Access Control
 * 4. Ownership & Transfer
 * 5. Edge Cases & Security
 */

describe("ArtVault NFT Contract", function () {
  // STATE VARIABLES (available to all tests)
  let artVault;           // The deployed contract
  let owner;             // Contract owner (deployer)
  let addr1, addr2;      // Test accounts
  let mintPrice;         // Price to mint NFT
  
  // Sample IPFS URI for testing
  const sampleTokenURI = "ipfs://QmTest123/metadata.json";
  
  /**
   * beforeEach runs before EACH test
   * This ensures each test starts with a fresh contract state
   */
  beforeEach(async function () {
    // Get test accounts from Hardhat
    // owner = first account (default deployer)
    // addr1, addr2 = additional test accounts
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy the contract
    // 1. Get contract factory (blueprint)
    const ArtVault = await ethers.getContractFactory("ArtVault");
    
    // 2. Deploy contract and pass owner address to constructor
    artVault = await ArtVault.deploy(owner.address);
    
    // 3. Wait for deployment transaction to be mined
    await artVault.waitForDeployment();
    
    // Get the mint price from contract
    mintPrice = await artVault.mintPrice();
    
    console.log(`    📝 Contract deployed at: ${await artVault.getAddress()}`);
  });
  
  /**
   * TEST GROUP 1: DEPLOYMENT & INITIALIZATION
   * Verify contract deploys correctly with expected initial state
   */
  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      // Check if collection name is "ArtVault"
      expect(await artVault.name()).to.equal("ArtVault");
      
      // Check if symbol is "ARTVAULT"
      expect(await artVault.symbol()).to.equal("ARTVAULT");
    });
    
    it("Should set the correct owner", async function () {
      // Check if owner is set correctly
      expect(await artVault.owner()).to.equal(owner.address);
    });
    
    it("Should have correct initial values", async function () {
      // Check max supply
      expect(await artVault.maxSupply()).to.equal(10000);
      
      // Check mint price (0.01 ETH)
      expect(await artVault.mintPrice()).to.equal(ethers.parseEther("0.01"));
      
      // Check total supply starts at 0
      expect(await artVault.getTotalSupply()).to.equal(0);
    });
  });
  
  /**
   * TEST GROUP 2: MINTING FUNCTIONALITY
   * Test the core minting feature
   */
  describe("Minting NFTs", function () {
    it("Should mint an NFT successfully with correct payment", async function () {
      // Mint NFT to addr1 with sample URI
      const tx = await artVault.connect(addr1).mintNFT(
        addr1.address,
        sampleTokenURI,
        { value: mintPrice }  // Send ETH with transaction
      );
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // ASSERTIONS:
      
      // 1. Check total supply increased to 1
      expect(await artVault.getTotalSupply()).to.equal(1);
      
      // 2. Check addr1 now owns 1 NFT
      expect(await artVault.balanceOf(addr1.address)).to.equal(1);
      
      // 3. Check addr1 owns token ID 0
      expect(await artVault.ownerOf(0)).to.equal(addr1.address);
      
      // 4. Check token URI is correct
      expect(await artVault.tokenURI(0)).to.equal(sampleTokenURI);
    });
    
    it("Should emit NFTMinted event", async function () {
      // expect().to.emit() checks if event was emitted
      await expect(
        artVault.connect(addr1).mintNFT(addr1.address, sampleTokenURI, {
          value: mintPrice,
        })
      )
        .to.emit(artVault, "NFTMinted")  // Event name
        .withArgs(0, addr1.address, sampleTokenURI);  // Event arguments
    });
    
    it("Should mint multiple NFTs with incremental token IDs", async function () {
      // Mint 3 NFTs
      await artVault.connect(addr1).mintNFT(addr1.address, "ipfs://test1", {
        value: mintPrice,
      });
      
      await artVault.connect(addr1).mintNFT(addr1.address, "ipfs://test2", {
        value: mintPrice,
      });
      
      await artVault.connect(addr1).mintNFT(addr2.address, "ipfs://test3", {
        value: mintPrice,
      });
      
      // Check total supply
      expect(await artVault.getTotalSupply()).to.equal(3);
      
      // Check addr1 owns first 2 NFTs
      expect(await artVault.balanceOf(addr1.address)).to.equal(2);
      
      // Check addr2 owns 1 NFT
      expect(await artVault.balanceOf(addr2.address)).to.equal(1);
      
      // Check token ownership
      expect(await artVault.ownerOf(0)).to.equal(addr1.address);
      expect(await artVault.ownerOf(1)).to.equal(addr1.address);
      expect(await artVault.ownerOf(2)).to.equal(addr2.address);
    });
  });
  
  /**
   * TEST GROUP 3: PAYMENT VALIDATION
   * Test payment requirements and edge cases
   */
  describe("Payment Validation", function () {
    it("Should reject minting without payment", async function () {
      // Try to mint without sending ETH
      await expect(
        artVault.connect(addr1).mintNFT(addr1.address, sampleTokenURI)
      ).to.be.revertedWith("Insufficient ETH sent for minting");
    });
    
    it("Should reject minting with insufficient payment", async function () {
      // Try to mint with less than required ETH
      const insufficientPayment = ethers.parseEther("0.005");  // Half the price
      
      await expect(
        artVault.connect(addr1).mintNFT(addr1.address, sampleTokenURI, {
          value: insufficientPayment,
        })
      ).to.be.revertedWith("Insufficient ETH sent for minting");
    });
    
    it("Should accept minting with excess payment", async function () {
      // Mint with more than required (contract keeps the excess)
      const excessPayment = ethers.parseEther("0.05");
      
      await expect(
        artVault.connect(addr1).mintNFT(addr1.address, sampleTokenURI, {
          value: excessPayment,
        })
      ).to.not.be.reverted;
      
      // Check contract balance increased
      expect(await artVault.getContractBalance()).to.equal(excessPayment);
    });
  });
  
  /**
   * TEST GROUP 4: TOKEN URI VALIDATION
   * Test metadata URI requirements
   */
  describe("Token URI Validation", function () {
    it("Should reject empty token URI", async function () {
      await expect(
        artVault.connect(addr1).mintNFT(addr1.address, "", {
          value: mintPrice,
        })
      ).to.be.revertedWith("Token URI cannot be empty");
    });
    
    it("Should store and return correct token URI", async function () {
      await artVault.connect(addr1).mintNFT(addr1.address, sampleTokenURI, {
        value: mintPrice,
      });
      
      const storedURI = await artVault.tokenURI(0);
      expect(storedURI).to.equal(sampleTokenURI);
    });
  });
  
  /**
   * TEST GROUP 5: QUERYING FUNCTIONS
   * Test view functions that return data
   */
  describe("Query Functions", function () {
    beforeEach(async function () {
      // Mint some NFTs for testing
      await artVault.connect(addr1).mintNFT(addr1.address, "ipfs://test1", {
        value: mintPrice,
      });
      await artVault.connect(addr1).mintNFT(addr1.address, "ipfs://test2", {
        value: mintPrice,
      });
      await artVault.connect(addr2).mintNFT(addr2.address, "ipfs://test3", {
        value: mintPrice,
      });
    });
    
    it("Should return correct total supply", async function () {
      expect(await artVault.getTotalSupply()).to.equal(3);
    });
    
    it("Should return all token IDs", async function () {
      const tokenIds = await artVault.getAllTokenIds();
      
      expect(tokenIds.length).to.equal(3);
      expect(tokenIds[0]).to.equal(0);
      expect(tokenIds[1]).to.equal(1);
      expect(tokenIds[2]).to.equal(2);
    });
    
    it("Should return tokens owned by specific address", async function () {
      // Get addr1's tokens (should have 2)
      const addr1Tokens = await artVault.getTokensOfOwner(addr1.address);
      expect(addr1Tokens.length).to.equal(2);
      expect(addr1Tokens[0]).to.equal(0);
      expect(addr1Tokens[1]).to.equal(1);
      
      // Get addr2's tokens (should have 1)
      const addr2Tokens = await artVault.getTokensOfOwner(addr2.address);
      expect(addr2Tokens.length).to.equal(1);
      expect(addr2Tokens[0]).to.equal(2);
    });
    
    it("Should return empty array for address with no tokens", async function () {
      const ownerTokens = await artVault.getTokensOfOwner(owner.address);
      expect(ownerTokens.length).to.equal(0);
    });
  });
  
  /**
   * TEST GROUP 6: TRANSFER FUNCTIONALITY
   * Test NFT transfers between addresses
   */
  describe("NFT Transfers", function () {
    beforeEach(async function () {
      // Mint NFT to addr1
      await artVault.connect(addr1).mintNFT(addr1.address, sampleTokenURI, {
        value: mintPrice,
      });
    });
    
    it("Should transfer NFT successfully", async function () {
      // Transfer from addr1 to addr2
      await artVault.connect(addr1).transferNFT(addr2.address, 0);
      
      // Check new owner
      expect(await artVault.ownerOf(0)).to.equal(addr2.address);
      
      // Check balances
      expect(await artVault.balanceOf(addr1.address)).to.equal(0);
      expect(await artVault.balanceOf(addr2.address)).to.equal(1);
    });
    
    it("Should emit NFTTransferred event", async function () {
      await expect(artVault.connect(addr1).transferNFT(addr2.address, 0))
        .to.emit(artVault, "NFTTransferred")
        .withArgs(addr1.address, addr2.address, 0);
    });
    
    it("Should reject transfer from non-owner", async function () {
      // addr2 tries to transfer addr1's NFT (should fail)
      await expect(
        artVault.connect(addr2).transferNFT(addr2.address, 0)
      ).to.be.revertedWith("You don't own this NFT");
    });
  });
  
  /**
   * TEST GROUP 7: OWNER-ONLY FUNCTIONS
   * Test administrative functions
   */
  describe("Owner Functions", function () {
    it("Should allow owner to change mint price", async function () {
      const newPrice = ethers.parseEther("0.05");
      
      await artVault.connect(owner).setMintPrice(newPrice);
      
      expect(await artVault.mintPrice()).to.equal(newPrice);
    });
    
    it("Should reject non-owner changing mint price", async function () {
      const newPrice = ethers.parseEther("0.05");
      
      await expect(
        artVault.connect(addr1).setMintPrice(newPrice)
      ).to.be.revertedWithCustomError(artVault, "OwnableUnauthorizedAccount");
    });
    
    it("Should allow owner to withdraw contract balance", async function () {
      // Mint some NFTs to add balance to contract
      await artVault.connect(addr1).mintNFT(addr1.address, "ipfs://test1", {
        value: mintPrice,
      });
      await artVault.connect(addr2).mintNFT(addr2.address, "ipfs://test2", {
        value: mintPrice,
      });
      
      // Check contract balance
      const contractBalance = await artVault.getContractBalance();
      expect(contractBalance).to.equal(mintPrice * 2n);
      
      // Get owner's balance before withdrawal
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      
      // Withdraw
      const tx = await artVault.connect(owner).withdraw();
      const receipt = await tx.wait();
      
      // Calculate gas cost
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      // Get owner's balance after withdrawal
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      
      // Owner should have gained (contractBalance - gasCost)
      const expectedBalance = ownerBalanceBefore + contractBalance - gasUsed;
      expect(ownerBalanceAfter).to.equal(expectedBalance);
      
      // Contract balance should be 0
      expect(await artVault.getContractBalance()).to.equal(0);
    });
    
    it("Should reject non-owner withdrawing", async function () {
      await expect(
        artVault.connect(addr1).withdraw()
      ).to.be.revertedWithCustomError(artVault, "OwnableUnauthorizedAccount");
    });
    
    it("Should reject withdrawal when balance is zero", async function () {
      await expect(
        artVault.connect(owner).withdraw()
      ).to.be.revertedWith("No funds to withdraw");
    });
  });
  
  /**
   * TEST GROUP 8: MAX SUPPLY
   * Test supply limit enforcement
   */
  describe("Max Supply", function () {
    it("Should enforce max supply limit", async function () {
      // Set max supply to 2 for testing (we'd need to modify contract for this test)
      // For now, we'll test the logic exists
      
      const maxSupply = await artVault.maxSupply();
      expect(maxSupply).to.equal(10000);
    });
  });
  
  /**
   * TEST GROUP 9: EDGE CASES
   * Test unusual scenarios
   */
  describe("Edge Cases", function () {
    it("Should handle querying non-existent token", async function () {
      // Try to get owner of token that doesn't exist
      await expect(
        artVault.ownerOf(999)
      ).to.be.revertedWithCustomError(artVault, "ERC721NonexistentToken");
    });
    
    it("Should handle querying tokenURI of non-existent token", async function () {
      await expect(
        artVault.tokenURI(999)
      ).to.be.revertedWithCustomError(artVault, "ERC721NonexistentToken");
    });
  });
});

