import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Job Posting Flow Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should successfully create a job posting by approved recruiter', async () => {
    const mockJobData = {
      jobDescription: 'Software Engineer position for developing web applications using React and Node.js',
      eligibilityCriteria: 'Bachelor\'s degree in Computer Science, minimum 7.0 CGPA, knowledge of JavaScript',
      applicationDeadline: '2024-12-31T23:59:59.000Z'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Job posting created and submitted for approval',
        job: {
          id: 'job_123',
          recruiterId: 'recruiter_456',
          jobDescription: mockJobData.jobDescription,
          eligibilityCriteria: mockJobData.eligibilityCriteria,
          applicationDeadline: mockJobData.applicationDeadline,
          approvalStatus: 'PENDING',
          recruiter: {
            name: 'TechCorp Recruiter',
            companyProfile: 'Leading tech company'
          }
        }
      })
    })

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockJobData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Job posting created and submitted for approval')
    expect(result.job.approvalStatus).toBe('PENDING')
    expect(result.job.jobDescription).toBe(mockJobData.jobDescription)
  })

  it('should reject job posting with past deadline', async () => {
    const invalidJobData = {
      jobDescription: 'Test job description',
      eligibilityCriteria: 'Test criteria',
      applicationDeadline: '2020-01-01T00:00:00.000Z' // Past date
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Application deadline must be in the future' }
      })
    })

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidJobData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Application deadline must be in the future')
  })

  it('should reject job posting from unauthorized user', async () => {
    const jobData = {
      jobDescription: 'Test job',
      eligibilityCriteria: 'Test criteria',
      applicationDeadline: '2024-12-31T23:59:59.000Z'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        error: { message: 'Unauthorized' }
      })
    })

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Unauthorized')
  })

  it('should fetch approved jobs for students', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_1',
            jobDescription: 'Frontend Developer',
            eligibilityCriteria: 'React, JavaScript',
            applicationDeadline: '2024-12-31T23:59:59.000Z',
            approvalStatus: 'APPROVED',
            recruiter: {
              name: 'Tech Company',
              companyProfile: 'Software development'
            },
            _count: { applications: 5 }
          },
          {
            id: 'job_2',
            jobDescription: 'Backend Developer',
            eligibilityCriteria: 'Node.js, MongoDB',
            applicationDeadline: '2024-11-30T23:59:59.000Z',
            approvalStatus: 'APPROVED',
            recruiter: {
              name: 'StartupCorp',
              companyProfile: 'Innovative startup'
            },
            _count: { applications: 3 }
          }
        ]
      })
    })

    const response = await fetch('/api/jobs?status=APPROVED')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(2)
    expect(result.jobs[0].approvalStatus).toBe('APPROVED')
    expect(result.jobs[1].approvalStatus).toBe('APPROVED')
  })

  it('should fetch recruiter\'s own job postings', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_recruiter_1',
            jobDescription: 'My Posted Job',
            eligibilityCriteria: 'Specific requirements',
            applicationDeadline: '2024-12-15T23:59:59.000Z',
            approvalStatus: 'PENDING',
            recruiter: {
              name: 'My Company',
              companyProfile: 'My company profile'
            },
            _count: { applications: 0 }
          }
        ]
      })
    })

    const response = await fetch('/api/jobs?recruiterId=current')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(1)
    expect(result.jobs[0].id).toBe('job_recruiter_1')
  })

  it('should validate required fields for job posting', async () => {
    const incompleteJobData = {
      jobDescription: 'Test job'
      // Missing eligibilityCriteria and applicationDeadline
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'All fields are required' }
      })
    })

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteJobData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('All fields are required')
  })
})