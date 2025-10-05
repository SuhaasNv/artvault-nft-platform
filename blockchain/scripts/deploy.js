const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * DEPLOYMENT SCRIPT FOR ARTVAULT NFT CONTRACT
 * 
 * This script:
 * 1. Deploys the ArtVault contract to the specified network
 * 2. Verifies the deployment was successful
 * 3. Saves contract address and ABI for frontend use
 * 
 * Usage:
 * - Local: npx hardhat run scripts/deploy.js
 * - Sepolia: npx hardhat run scripts/deploy.js --network sepolia
 */

async function main() {
  console.log("🚀 Starting ArtVault deployment...\n");
  
  // ==============================================================================
  // STEP 1: GET DEPLOYER ACCOUNT
  // ==============================================================================
  
  // Get the account that will deploy the contract
  // This will be your MetaMask account when deploying to Sepolia
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📋 Deployment Information:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Deployer address: ${deployer.address}`);
  
  // Get deployer's balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`   Deployer balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // Check if deployer has enough balance
  if (balance === 0n) {
    console.error("❌ Error: Deployer account has 0 ETH!");
    console.log("   Please fund your account before deploying.");
    if (network.chainId === 11155111n) {
      console.log("   Get Sepolia testnet ETH from: https://sepoliafaucet.com");
    }
    process.exit(1);
  }
  
  // ==============================================================================
  // STEP 2: DEPLOY CONTRACT
  // ==============================================================================
  
  console.log("📦 Deploying ArtVault contract...");
  
  // Get the contract factory (blueprint)
  const ArtVault = await hre.ethers.getContractFactory("ArtVault");
  
  // Deploy the contract
  // Pass deployer address as initialOwner (required by Ownable in OpenZeppelin v5)
  console.log("   ⏳ Sending deployment transaction...");
  const artVault = await ArtVault.deploy(deployer.address);
  
  // Wait for deployment to complete
  await artVault.waitForDeployment();
  
  // Get contract address
  const contractAddress = await artVault.getAddress();
  
  console.log("   ✅ Contract deployed successfully!\n");
  
  // ==============================================================================
  // STEP 3: VERIFY DEPLOYMENT
  // ==============================================================================
  
  console.log("🔍 Verifying deployment...");
  
  // Read contract state to verify it works
  const name = await artVault.name();
  const symbol = await artVault.symbol();
  const maxSupply = await artVault.maxSupply();
  const mintPrice = await artVault.mintPrice();
  const owner = await artVault.owner();
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   Contract Address:", contractAddress);
  console.log("   Collection Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Max Supply:", maxSupply.toString());
  console.log("   Mint Price:", hre.ethers.formatEther(mintPrice), "ETH");
  console.log("   Owner:", owner);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // ==============================================================================
  // STEP 4: SAVE CONTRACT INFO FOR FRONTEND
  // ==============================================================================
  
  console.log("💾 Saving contract information for frontend...");
  
  // Create contract info object
  const contractInfo = {
    address: contractAddress,
    network: {
      name: network.name,
      chainId: Number(network.chainId),
    },
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contractName: "ArtVault",
  };
  
  // Get contract ABI (Application Binary Interface)
  // This tells the frontend how to interact with the contract
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/ArtVault.sol/ArtVault.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  // Create frontend directory if it doesn't exist
  const frontendContractsDir = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }
  
  // Save contract address and network info
  const addressPath = path.join(frontendContractsDir, "contract-address.json");
  fs.writeFileSync(addressPath, JSON.stringify(contractInfo, null, 2));
  
  // Save contract ABI
  const abiPath = path.join(frontendContractsDir, "ArtVault.json");
  fs.writeFileSync(
    abiPath,
    JSON.stringify(
      {
        address: contractAddress,
        abi: artifact.abi,
      },
      null,
      2
    )
  );
  
  console.log("   ✅ Contract info saved to frontend/src/contracts/");
  console.log(`      - contract-address.json`);
  console.log(`      - ArtVault.json\n`);
  
  // ==============================================================================
  // STEP 5: NEXT STEPS
  // ==============================================================================
  
  console.log("✨ Deployment complete!\n");
  console.log("📝 Next Steps:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  if (network.chainId === 11155111n) {
    // Sepolia testnet
    console.log("   1. View your contract on Etherscan:");
    console.log(`      https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("\n   2. Verify contract source code (optional but recommended):");
    console.log(`      npx hardhat verify --network sepolia ${contractAddress} ${deployer.address}`);
  } else if (network.chainId === 31337n) {
    // Local Hardhat network
    console.log("   1. Keep this terminal window open (contract is on local network)");
    console.log("   2. In a new terminal, start your frontend");
  }
  
  console.log("\n   3. Update your frontend to use this contract address");
  console.log("   4. Start building your UI!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // ==============================================================================
  // OPTIONAL: PERFORM TEST MINT (only on local network)
  // ==============================================================================
  
  if (network.chainId === 31337n) {
    console.log("🧪 Performing test mint on local network...");
    
    const testURI = "ipfs://QmTest123/metadata.json";
    const mintPrice = await artVault.mintPrice();
    
    const tx = await artVault.mintNFT(deployer.address, testURI, {
      value: mintPrice,
    });
    
    await tx.wait();
    
    const totalSupply = await artVault.getTotalSupply();
    console.log(`   ✅ Test NFT minted! Total supply: ${totalSupply}\n`);
  }
}

// ==============================================================================
// ERROR HANDLING
// ==============================================================================

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

