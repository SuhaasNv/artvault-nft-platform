import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { ARTVAULT_ADDRESS, ARTVAULT_ABI } from '@/contracts/config';
import axios from 'axios';
import { getIPFSGateways } from '@/utils/ipfsUtils';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  artist?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface NFT {
  tokenId: number;
  tokenURI: string;
  metadata?: NFTMetadata;
  loading: boolean;
}

export function useNFTData(tokenId: number) {
  const [nft, setNft] = useState<NFT>({
    tokenId,
    tokenURI: '',
    loading: true,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get token URI from smart contract
  const { data: tokenURI, isLoading: isLoadingURI } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  });

  // Load metadata from IPFS
  useEffect(() => {
    if (!isClient) return;

    const loadMetadata = async () => {
      if (isLoadingURI) {
        console.log(`⏳ Loading tokenURI for NFT #${tokenId}...`);
        return;
      }

      if (!tokenURI) {
        console.log(`⚠️ No tokenURI available for NFT #${tokenId}`);
        setNft({
          tokenId,
          tokenURI: '',
          loading: false,
          metadata: {
            name: `NFT #${tokenId}`,
            description: 'No token URI available',
            image: '',
            artist: 'Unknown',
          },
        });
        return;
      }

      try {
        console.log(`🔍 Loading metadata for NFT #${tokenId} from:`, tokenURI);
        
        let metadata: NFTMetadata;
        let workingUrl = tokenURI as string;
        
        // If it's an IPFS URL, try multiple gateways
        if (tokenURI.includes('ipfs://')) {
          const ipfsHash = tokenURI.replace('ipfs://', '');
          const gateways = getIPFSGateways(ipfsHash);
          
          console.log(`🌐 Trying multiple IPFS gateways for hash: ${ipfsHash}`);
          
          let success = false;
          for (const gateway of gateways) {
            try {
              console.log(`🔄 Trying gateway: ${gateway}`);
              const response = await axios.get(gateway, {
                timeout: 5000,
                headers: {
                  'Accept': 'application/json',
                }
              });
              
              console.log(`✅ Success with gateway: ${gateway}`);
              metadata = response.data;
              workingUrl = gateway;
              success = true;
              break;
            } catch (gatewayError) {
              console.log(`❌ Failed with gateway: ${gateway}`);
              continue;
            }
          }
          
          if (!success) {
            throw new Error('All IPFS gateways failed');
          }
        } else {
          // Try the original URL
          console.log(`🌐 Making request to: ${tokenURI}`);
          const response = await axios.get(tokenURI as string, {
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
            }
          });
          
          console.log(`📡 Response status: ${response.status}`);
          console.log(`📄 Response data:`, response.data);
          metadata = response.data;
        }
        
        console.log(`✅ Successfully loaded metadata for NFT #${tokenId}:`, metadata);
        
        setNft({
          tokenId,
          tokenURI: workingUrl,
          metadata,
          loading: false,
        });
      } catch (error: any) {
        console.error(`❌ Error loading metadata from IPFS for NFT #${tokenId}`);
        console.error(`❌ TokenURI: ${tokenURI}`);
        console.error(`❌ Error details:`, error);
        console.error(`❌ Error message:`, error.message);
        console.error(`❌ Error code:`, error.code);
        console.error(`❌ Response status:`, error.response?.status);
        console.error(`❌ Response data:`, error.response?.data);
        
        setNft({
          tokenId,
          tokenURI: tokenURI as string,
          loading: false,
          metadata: {
            name: `NFT #${tokenId}`,
            description: 'Error loading metadata from IPFS',
            image: '',
            artist: 'Unknown',
          },
        });
      }
    };

    loadMetadata();
  }, [tokenURI, isLoadingURI, tokenId, isClient]);

  return nft;
}
