// SPDX-License-Identifier: MIT
// This tells everyone this code is open-source and free to use

pragma solidity ^0.8.20;
// Specifies which version of Solidity we're using (like package.json version)

// Import OpenZeppelin's secure, audited NFT contracts
// These are battle-tested templates used by major NFT projects
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArtVault
 * @dev NFT contract for minting and managing digital art
 * @notice This contract allows users to mint NFTs with metadata stored on IPFS
 */
contract ArtVault is ERC721URIStorage, Ownable {
    // STATE VARIABLES (stored permanently on blockchain)
    
    // Counter to track token IDs (starts at 0, increments with each mint)
    // In OpenZeppelin v5, we use a simple uint256 instead of Counters library
    uint256 private _tokenIdCounter;
    
    // Maximum supply of NFTs (prevents infinite minting)
    uint256 public maxSupply = 10000;
    
    // Minting price in Wei (1 ETH = 10^18 Wei)
    // Currently set to 0.01 ETH
    uint256 public mintPrice = 0.01 ether;
    
    // EVENTS (logs that get recorded on blockchain)
    // Frontend can listen to these events
    
    /**
     * @dev Emitted when a new NFT is minted
     * @param tokenId The ID of the newly minted token
     * @param minter The address that minted the NFT
     * @param tokenURI The IPFS URI containing metadata
     */
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string tokenURI
    );
    
    /**
     * @dev Emitted when an NFT is transferred
     * @param from The address sending the NFT
     * @param to The address receiving the NFT
     * @param tokenId The ID of the transferred token
     */
    event NFTTransferred(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    
    // CONSTRUCTOR (runs once when contract is deployed)
    
    /**
     * @dev Initializes the NFT collection
     * @param initialOwner The address that will own the contract
     */
    constructor(address initialOwner) 
        ERC721("ArtVault", "ARTVAULT")  // Collection name and symbol
        Ownable(initialOwner)            // Set contract owner
    {
        // Constructor body (empty for now, but could initialize more state)
    }
    
    // FUNCTIONS (methods that can be called)
    
    /**
     * @dev Mints a new NFT to the specified address
     * @param to The address that will receive the NFT
     * @param tokenURI The IPFS URI pointing to the NFT metadata JSON
     * @return The ID of the newly minted token
     * 
     * Requirements:
     * - Must send correct ETH amount (mintPrice)
     * - Must not exceed maxSupply
     * - tokenURI must not be empty
     */
    function mintNFT(address to, string memory tokenURI) 
        public 
        payable 
        returns (uint256) 
    {
        // VALIDATION CHECKS
        
        // Check if user sent enough ETH
        require(msg.value >= mintPrice, "Insufficient ETH sent for minting");
        
        // Check if we haven't hit max supply
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        
        // Check if metadata URI is provided
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        
        // MINTING LOGIC
        
        // Get current token ID (starts at 0)
        uint256 tokenId = _tokenIdCounter;
        
        // Increment counter for next mint
        _tokenIdCounter++;
        
        // Actually mint the NFT (internal function from ERC721)
        // This creates the NFT and assigns it to 'to' address
        _safeMint(to, tokenId);
        
        // Set the metadata URI for this token
        // This links the token ID to the IPFS metadata
        _setTokenURI(tokenId, tokenURI);
        
        // Emit event for frontend to listen to
        emit NFTMinted(tokenId, msg.sender, tokenURI);
        
        // Return the token ID
        return tokenId;
    }
    
    /**
     * @dev Returns the total number of NFTs minted
     * @return The current token ID (equals total supply)
     */
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Returns all token IDs that exist
     * @return Array of all token IDs
     */
    function getAllTokenIds() public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter;
        uint256[] memory tokenIds = new uint256[](totalSupply);
        
        // Loop through all tokens and add to array
        for (uint256 i = 0; i < totalSupply; i++) {
            tokenIds[i] = i;
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Returns all token IDs owned by a specific address
     * @param owner The address to query
     * @return Array of token IDs owned by the address
     */
    function getTokensOfOwner(address owner) 
        public 
        view 
        returns (uint256[] memory) 
    {
        uint256 totalSupply = _tokenIdCounter;
        uint256 ownerTokenCount = balanceOf(owner);
        
        // Create array to store owned token IDs
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        uint256 currentIndex = 0;
        
        // Loop through all tokens and find ones owned by this address
        for (uint256 i = 0; i < totalSupply; i++) {
            // Check if token exists and is owned by the address
            if (_ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Transfers an NFT to another address
     * @param to The address to transfer to
     * @param tokenId The ID of the token to transfer
     * 
     * Note: This is a wrapper around the standard ERC721 transfer
     * We add it to emit our custom event
     */
    function transferNFT(address to, uint256 tokenId) public {
        // Check if caller owns the token
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        
        // Transfer the NFT (from ERC721)
        safeTransferFrom(msg.sender, to, tokenId);
        
        // Emit our custom event
        emit NFTTransferred(msg.sender, to, tokenId);
    }
    
    /**
     * @dev Updates the minting price (only owner can call)
     * @param newPrice The new price in Wei
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
    
    /**
     * @dev Withdraws collected ETH from minting (only owner can call)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // Transfer all contract balance to owner
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Returns contract balance
     * @return The amount of ETH held by the contract
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

