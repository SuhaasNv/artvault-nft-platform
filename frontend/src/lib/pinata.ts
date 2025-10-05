/**
 * Pinata IPFS Upload Utilities
 * 
 * These functions handle uploading images and metadata to IPFS via Pinata
 */

import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT; // Optional: Prefer JWT on Vercel
const PINATA_BASE_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

/**
 * Upload an image file to IPFS via Pinata
 * @param file - The image file to upload
 * @returns The IPFS hash (CID) of the uploaded file
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          // Let the browser set the proper multipart boundary
          // Do not set 'Content-Type' manually for FormData
          ...(PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}` }
            : {
                pinata_api_key: (PINATA_API_KEY as string) || '',
                pinata_secret_api_key: (PINATA_SECRET_KEY as string) || '',
              }),
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    const err = error as any;
    console.error('Error uploading image to IPFS:', {
      message: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    throw new Error(
      `Failed to upload image to IPFS${err?.response?.status ? ` (status ${err.response.status})` : ''}`
    );
  }
}

/**
 * Upload NFT metadata (JSON) to IPFS via Pinata
 * @param metadata - The NFT metadata object
 * @returns The IPFS hash (CID) of the uploaded metadata
 */
export async function uploadMetadataToIPFS(metadata: {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}): Promise<string> {
  try {
    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}` }
            : {
                pinata_api_key: (PINATA_API_KEY as string) || '',
                pinata_secret_api_key: (PINATA_SECRET_KEY as string) || '',
              }),
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    const err = error as any;
    console.error('Error uploading metadata to IPFS:', {
      message: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    throw new Error(
      `Failed to upload metadata to IPFS${err?.response?.status ? ` (status ${err.response.status})` : ''}`
    );
  }
}

/**
 * Get the full IPFS gateway URL for a hash
 * @param ipfsHash - The IPFS hash (CID)
 * @returns The full gateway URL
 */
export function getIPFSUrl(ipfsHash: string): string {
  return `${PINATA_GATEWAY}/${ipfsHash}`;
}

/**
 * Create NFT metadata following the ERC-721 metadata standard
 * @param title - NFT title
 * @param description - NFT description
 * @param imageHash - IPFS hash of the image
 * @param artist - Artist name
 * @returns Formatted metadata object
 */
export function createNFTMetadata(
  title: string,
  description: string,
  imageHash: string,
  artist: string
) {
  return {
    name: title,
    description: description,
    image: getIPFSUrl(imageHash),
    attributes: [
      {
        trait_type: 'Artist',
        value: artist,
      },
      {
        trait_type: 'Created',
        value: new Date().toISOString(),
      },
    ],
  };
}

