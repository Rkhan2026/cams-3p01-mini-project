import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Recruiter Registration Flow Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should successfully register a new recruiter with company profile', async () => {
    const mockRecruiterData = {
      role: 'RECRUITER',
      name: 'Alice Johnson',
      email: 'alice@techcorp.com',
      password: 'SecurePass123!',
      companyName: 'TechCorp Solutions',
      companyProfile: 'Leading technology solutions provider specializing in AI and machine learning'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Recruiter registration submitted for approval',
        user: {
          id: 'recruiter_123',
          name: 'Alice Johnson',
          email: 'alice@techcorp.com',
          role: 'RECRUITER'
        }
      })
    })

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockRecruiterData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Recruiter registration submitted for approval')
    expect(result.user.role).toBe('RECRUITER')
    expect(result.user.email).toBe('alice@techcorp.com')
  })

  it('should reject recruiter registration without company profile', async () => {
    const incompleteRecruiterData = {
      role: 'RECRUITER',
      name: 'Bob Smith',
      email: 'bob@company.com',
      password: 'SecurePass123!',
      companyName: 'Some Company'
      // Missing companyProfile
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Company name and profile are required' }
      })
    })

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteRecruiterData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Company name and profile are required')
  })

  it('should handle recruiter login after approval', async () => {
    const loginData = {
      email: 'approved.recruiter@company.com',
      password: 'SecurePass123!'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Login successful',
        user: {
          id: 'recruiter_approved',
          role: 'RECRUITER',
          email: 'approved.recruiter@company.com',
          name: 'Approved Recruiter'
        }
      })
    })

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.user.role).toBe('RECRUITER')
    expect(result.message).toBe('Login successful')
  })

  it('should reject login for rejected recruiter account', async () => {
    const loginData = {
      email: 'rejected.recruiter@company.com',
      password: 'SecurePass123!'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({
        success: false,
        error: { message: 'Account has been rejected' }
      })
    })

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Account has been rejected')
  })

  it('should validate email format during registration', async () => {
    const invalidEmailData = {
      role: 'RECRUITER',
      name: 'Test Recruiter',
      email: 'invalid-email-format',
      password: 'SecurePass123!',
      companyName: 'Test Company',
      companyProfile: 'Test profile'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Invalid email format' }
      })
    })

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidEmailData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Invalid email format')
  })
})