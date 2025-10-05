/**
 * IPFS HELPER SCRIPT
 * 
 * This file contains utility functions for uploading to IPFS via Pinata
 * These functions will be used in the frontend to upload images and metadata
 * 
 * Note: This is a Node.js version for testing. The frontend will use
 * a browser-compatible version with axios or fetch.
 */

const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

/**
 * Upload an image file to IPFS via Pinata
 * @param {Buffer|ReadStream} file - The file to upload
 * @param {string} filename - The name of the file
 * @returns {Promise<string>} - The IPFS URI (ipfs://...)
 */
async function uploadImageToIPFS(file, filename) {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("file", file, filename);
    
    // Optional: Add metadata about the file
    const metadata = JSON.stringify({
      name: filename,
    });
    formData.append("pinataMetadata", metadata);
    
    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );
    
    // Return IPFS URI
    const ipfsHash = response.data.IpfsHash;
    const ipfsURI = `ipfs://${ipfsHash}`;
    
    console.log("✅ Image uploaded to IPFS:", ipfsURI);
    console.log("   View on Gateway:", `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
    return ipfsURI;
  } catch (error) {
    console.error("❌ Error uploading image to IPFS:");
    console.error(error.response?.data || error.message);
    throw error;
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - The metadata object
 * @returns {Promise<string>} - The IPFS URI (ipfs://...)
 */
async function uploadMetadataToIPFS(metadata) {
  try {
    // Upload JSON to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );
    
    // Return IPFS URI
    const ipfsHash = response.data.IpfsHash;
    const ipfsURI = `ipfs://${ipfsHash}`;
    
    console.log("✅ Metadata uploaded to IPFS:", ipfsURI);
    console.log("   View on Gateway:", `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
    return ipfsURI;
  } catch (error) {
    console.error("❌ Error uploading metadata to IPFS:");
    console.error(error.response?.data || error.message);
    throw error;
  }
}

/**
 * Create NFT metadata JSON according to OpenSea standard
 * @param {string} name - The NFT name
 * @param {string} description - The NFT description
 * @param {string} imageURI - The IPFS URI of the image
 * @param {string} artist - The artist name
 * @param {Object} attributes - Optional attributes
 * @returns {Object} - The metadata object
 */
function createNFTMetadata(name, description, imageURI, artist, attributes = []) {
  return {
    name,
    description,
    image: imageURI,
    artist,
    attributes,
    // Optional: Add more fields
    external_url: "",
    background_color: "",
  };
}

/**
 * Complete workflow: Upload image and metadata, return token URI
 * @param {Buffer|ReadStream} imageFile - The image file
 * @param {string} filename - The image filename
 * @param {string} name - The NFT name
 * @param {string} description - The NFT description
 * @param {string} artist - The artist name
 * @returns {Promise<string>} - The metadata IPFS URI (to be used in mintNFT)
 */
async function uploadNFTToIPFS(imageFile, filename, name, description, artist) {
  console.log("\n🚀 Starting NFT upload to IPFS...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  try {
    // Step 1: Upload image
    console.log("\n1️⃣ Uploading image...");
    const imageURI = await uploadImageToIPFS(imageFile, filename);
    
    // Step 2: Create metadata
    console.log("\n2️⃣ Creating metadata...");
    const metadata = createNFTMetadata(name, description, imageURI, artist);
    console.log("   Metadata:", JSON.stringify(metadata, null, 2));
    
    // Step 3: Upload metadata
    console.log("\n3️⃣ Uploading metadata...");
    const metadataURI = await uploadMetadataToIPFS(metadata);
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ Upload complete!");
    console.log(`   Token URI: ${metadataURI}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    return metadataURI;
  } catch (error) {
    console.error("\n❌ Upload failed:", error.message);
    throw error;
  }
}

// Example usage (for testing)
async function testUpload() {
  // Check if Pinata JWT is configured
  if (!process.env.PINATA_JWT) {
    console.error("❌ Error: PINATA_JWT not found in .env file");
    console.log("\n📝 Setup Instructions:");
    console.log("   1. Create account at https://pinata.cloud");
    console.log("   2. Generate API key (JWT)");
    console.log("   3. Add to .env file: PINATA_JWT=your_jwt_here\n");
    return;
  }
  
  // Test with a simple text file
  const testFile = Buffer.from("This is a test file for ArtVault NFT");
  const metadata = await uploadNFTToIPFS(
    testFile,
    "test.txt",
    "Test NFT",
    "This is a test NFT for the ArtVault project",
    "ArtVault Team"
  );
  
  console.log("🎉 Test successful! Use this URI to mint an NFT:");
  console.log(`   ${metadata}`);
}

// Uncomment to test:
// testUpload();

module.exports = {
  uploadImageToIPFS,
  uploadMetadataToIPFS,
  createNFTMetadata,
  uploadNFTToIPFS,
};

