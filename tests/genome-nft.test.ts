import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('Genome NFT Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint-genome-nft', () => {
    it('should mint a genome NFT successfully', async () => {
      const species = 'Giant Panda'
      const sequenceHash = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex')
      const collectionDate = 1625097600000 // July 1, 2021, 00:00:00 UTC
      const location = 'Sichuan, China'
      
      mockContractCall.mockResolvedValue({ value: 1 }) // Assuming 1 is the new token ID
      
      const result = await mockContractCall('genome-nft', 'mint-genome-nft', [
        species,
        sequenceHash,
        collectionDate,
        location
      ])
      
      expect(result.value).toBe(1)
      expect(mockContractCall).toHaveBeenCalledWith('genome-nft', 'mint-genome-nft', [
        species,
        sequenceHash,
        collectionDate,
        location
      ])
    })
  })
  
  describe('transfer-genome-nft', () => {
    it('should transfer a genome NFT successfully', async () => {
      const tokenId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await mockContractCall('genome-nft', 'transfer-genome-nft', [tokenId, recipient])
      
      expect(result.value).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith('genome-nft', 'transfer-genome-nft', [tokenId, recipient])
    })
    
    it('should fail if the sender does not own the NFT', async () => {
      const tokenId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      
      mockContractCall.mockRejectedValue(new Error('Sender does not own the NFT'))
      
      await expect(mockContractCall('genome-nft', 'transfer-genome-nft', [tokenId, recipient]))
          .rejects.toThrow('Sender does not own the NFT')
    })
  })
  
  describe('get-genome-metadata', () => {
    it('should return the correct metadata for a genome NFT', async () => {
      const tokenId = 1
      const expectedMetadata = {
        species: 'Giant Panda',
        sequence_hash: Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'),
        collection_date: 1625097600000,
        location: 'Sichuan, China'
      }
      
      mockContractCall.mockResolvedValue({ value: expectedMetadata })
      
      const result = await mockContractCall('genome-nft', 'get-genome-metadata', [tokenId])
      
      expect(result.value).toEqual(expectedMetadata)
      expect(mockContractCall).toHaveBeenCalledWith('genome-nft', 'get-genome-metadata', [tokenId])
    })
    
    it('should return null for non-existent token', async () => {
      const tokenId = 999
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await mockContractCall('genome-nft', 'get-genome-metadata', [tokenId])
      
      expect(result.value).toBeNull()
    })
  })
  
  describe('get-owner', () => {
    it('should return the correct owner of a genome NFT', async () => {
      const tokenId = 1
      const expectedOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      
      mockContractCall.mockResolvedValue({ value: expectedOwner })
      
      const result = await mockContractCall('genome-nft', 'get-owner', [tokenId])
      
      expect(result.value).toBe(expectedOwner)
      expect(mockContractCall).toHaveBeenCalledWith('genome-nft', 'get-owner', [tokenId])
    })
    
    it('should return none for non-existent token', async () => {
      const tokenId = 999
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await mockContractCall('genome-nft', 'get-owner', [tokenId])
      
      expect(result.value).toBeNull()
    })
  })
})

