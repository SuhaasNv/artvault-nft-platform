import axios from 'axios';

/**
 * Test if an IPFS URL is accessible
 */
export async function testIPFSUrl(url: string): Promise<{
  accessible: boolean;
  error?: string;
  data?: any;
}> {
  try {
    console.log(`🧪 Testing IPFS URL: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log(`✅ IPFS URL is accessible: ${url}`);
    console.log(`📄 Response data:`, response.data);
    
    return {
      accessible: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`❌ IPFS URL is not accessible: ${url}`);
    console.error(`❌ Error:`, error.message);
    console.error(`❌ Status:`, error.response?.status);
    
    return {
      accessible: false,
      error: error.message,
    };
  }
}

/**
 * Convert IPFS hash to different gateway URLs for testing
 */
export function getIPFSGateways(ipfsHash: string): string[] {
  const hash = ipfsHash.replace('ipfs://', '');
  
  return [
    `https://ipfs.io/ipfs/${hash}`,
    `https://gateway.pinata.cloud/ipfs/${hash}`,
    `https://cloudflare-ipfs.com/ipfs/${hash}`,
    `https://dweb.link/ipfs/${hash}`,
    `https://ipfs.infura.io/ipfs/${hash}`,
  ];
}
