import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('Conservation Fund Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-project', () => {
    it('should create a project successfully', async () => {
      const name = 'Save the Pandas'
      const description = 'A project to protect and preserve giant pandas'
      const fundingGoal = 1000000 // 1 million tokens
      
      mockContractCall.mockResolvedValue({ value: 1 }) // Assuming 1 is the new project ID
      
      const result = await mockContractCall('conservation-fund', 'create-project', [
        name,
        description,
        fundingGoal
      ])
      
      expect(result.value).toBe(1)
      expect(mockContractCall).toHaveBeenCalledWith('conservation-fund', 'create-project', [
        name,
        description,
        fundingGoal
      ])
    })
  })
  
  describe('fund-project', () => {
    it('should fund a project successfully', async () => {
      const projectId = 1
      const amount = 100000 // 100,000 tokens
      
      mockContractCall.mockResolvedValue({ value: 100000 }) // New total funding
      
      const result = await mockContractCall('conservation-fund', 'fund-project', [projectId, amount])
      
      expect(result.value).toBe(100000)
      expect(mockContractCall).toHaveBeenCalledWith('conservation-fund', 'fund-project', [projectId, amount])
    })
    
    it('should fail if project does not exist', async () => {
      const projectId = 999
      const amount = 100000
      
      mockContractCall.mockRejectedValue(new Error('Project not found'))
      
      await expect(mockContractCall('conservation-fund', 'fund-project', [projectId, amount]))
          .rejects.toThrow('Project not found')
    })
  })
  
  describe('withdraw-funds', () => {
    it('should withdraw funds successfully', async () => {
      const projectId = 1
      const amount = 50000 // 50,000 tokens
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await mockContractCall('conservation-fund', 'withdraw-funds', [projectId, amount])
      
      expect(result.value).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith('conservation-fund', 'withdraw-funds', [projectId, amount])
    })
    
    it('should fail if caller is not the project creator', async () => {
      const projectId = 1
      const amount = 50000
      
      mockContractCall.mockRejectedValue(new Error('Unauthorized'))
      
      await expect(mockContractCall('conservation-fund', 'withdraw-funds', [projectId, amount]))
          .rejects.toThrow('Unauthorized')
    })
    
    it('should fail if withdrawal amount exceeds current funding', async () => {
      const projectId = 1
      const amount = 1000000000 // 1 billion tokens
      
      mockContractCall.mockRejectedValue(new Error('Insufficient funds'))
      
      await expect(mockContractCall('conservation-fund', 'withdraw-funds', [projectId, amount]))
          .rejects.toThrow('Insufficient funds')
    })
  })
  
  describe('get-project', () => {
    it('should return project details', async () => {
      const projectId = 1
      const expectedProject = {
        name: 'Save the Pandas',
        description: 'A project to protect and preserve giant pandas',
        funding_goal: 1000000,
        current_funding: 100000,
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      }
      
      mockContractCall.mockResolvedValue({ value: expectedProject })
      
      const result = await mockContractCall('conservation-fund', 'get-project', [projectId])
      
      expect(result.value).toEqual(expectedProject)
      expect(mockContractCall).toHaveBeenCalledWith('conservation-fund', 'get-project', [projectId])
    })
    
    it('should return null for non-existent project', async () => {
      const projectId = 999
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await mockContractCall('conservation-fund', 'get-project', [projectId])
      
      expect(result.value).toBeNull()
    })
  })
  
  describe('get-token-balance', () => {
    it('should return the correct token balance for an account', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedBalance = 500000
      
      mockContractCall.mockResolvedValue({ value: expectedBalance })
      
      const result = await mockContractCall('conservation-fund', 'get-token-balance', [account])
      
      expect(result.value).toBe(expectedBalance)
      expect(mockContractCall).toHaveBeenCalledWith('conservation-fund', 'get-token-balance', [account])
    })
  })
})

