import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Job Approval and Visibility Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should show only approved jobs to students', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_1',
            jobDescription: 'Software Engineer - Full Stack Development',
            eligibilityCriteria: 'Bachelor\'s degree, 7.0+ CGPA, JavaScript knowledge',
            applicationDeadline: '2024-12-31T23:59:59.000Z',
            approvalStatus: 'APPROVED',
            recruiter: {
              name: 'TechCorp Solutions',
              companyProfile: 'Leading technology company'
            },
            _count: { applications: 25 }
          },
          {
            id: 'job_2',
            jobDescription: 'Data Analyst Position',
            eligibilityCriteria: 'Statistics background, Python/R skills',
            applicationDeadline: '2024-11-30T23:59:59.000Z',
            approvalStatus: 'APPROVED',
            recruiter: {
              name: 'DataCorp Analytics',
              companyProfile: 'Data analytics and insights'
            },
            _count: { applications: 18 }
          }
        ]
      })
    })

    const response = await fetch('/api/jobs?status=APPROVED')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(2)
    expect(result.jobs.every(job => job.approvalStatus === 'APPROVED')).toBe(true)
  })

  it('should hide pending and rejected jobs from students', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [] // No pending or rejected jobs should be visible to students
      })
    })

    const response = await fetch('/api/jobs?status=PENDING')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(0)
  })

  it('should show all job statuses to TPO admin', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_1',
            jobDescription: 'Approved Job',
            approvalStatus: 'APPROVED',
            recruiter: { name: 'Company A' }
          },
          {
            id: 'job_2',
            jobDescription: 'Pending Job',
            approvalStatus: 'PENDING',
            recruiter: { name: 'Company B' }
          },
          {
            id: 'job_3',
            jobDescription: 'Rejected Job',
            approvalStatus: 'REJECTED',
            recruiter: { name: 'Company C' }
          }
        ]
      })
    })

    const response = await fetch('/api/tpo/all-jobs')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(3)
    expect(result.jobs.map(job => job.approvalStatus)).toEqual(['APPROVED', 'PENDING', 'REJECTED'])
  })

  it('should allow recruiters to see their own jobs regardless of status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_1',
            jobDescription: 'My Approved Job',
            approvalStatus: 'APPROVED',
            recruiterId: 'recruiter_123'
          },
          {
            id: 'job_2',
            jobDescription: 'My Pending Job',
            approvalStatus: 'PENDING',
            recruiterId: 'recruiter_123'
          },
          {
            id: 'job_3',
            jobDescription: 'My Rejected Job',
            approvalStatus: 'REJECTED',
            recruiterId: 'recruiter_123'
          }
        ]
      })
    })

    const response = await fetch('/api/jobs?recruiterId=current')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(3)
    expect(result.jobs.every(job => job.recruiterId === 'recruiter_123')).toBe(true)
  })

  it('should update job visibility after TPO approval', async () => {
    // First, approve the job
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Job posting approved successfully',
        job: {
          id: 'job_123',
          approvalStatus: 'APPROVED'
        }
      })
    })

    const approvalResponse = await fetch('/api/jobs/job_123/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' })
    })

    const approvalResult = await approvalResponse.json()
    expect(approvalResult.job.approvalStatus).toBe('APPROVED')

    // Then verify it's now visible to students
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_123',
            jobDescription: 'Newly Approved Job',
            approvalStatus: 'APPROVED',
            recruiter: { name: 'TechCorp' }
          }
        ]
      })
    })

    const visibilityResponse = await fetch('/api/jobs?status=APPROVED')
    const visibilityResult = await visibilityResponse.json()

    expect(visibilityResult.jobs.find(job => job.id === 'job_123')).toBeDefined()
  })

  it('should hide job from students after rejection', async () => {
    // Reject the job
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Job posting rejected successfully',
        job: {
          id: 'job_456',
          approvalStatus: 'REJECTED'
        }
      })
    })

    const rejectionResponse = await fetch('/api/jobs/job_456/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject' })
    })

    const rejectionResult = await rejectionResponse.json()
    expect(rejectionResult.job.approvalStatus).toBe('REJECTED')

    // Verify it's not visible to students
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [] // Rejected job should not appear
      })
    })

    const visibilityResponse = await fetch('/api/jobs?status=APPROVED')
    const visibilityResult = await visibilityResponse.json()

    expect(visibilityResult.jobs.find(job => job.id === 'job_456')).toBeUndefined()
  })

  it('should prevent students from applying to unapproved jobs', async () => {
    const applicationData = {
      jobId: 'pending_job_123',
      studentId: 'student_456'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Cannot apply to unapproved job posting' }
      })
    })

    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Cannot apply to unapproved job posting')
  })

  it('should filter jobs by approval status for TPO dashboard', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobsByStatus: {
          PENDING: [
            {
              id: 'job_1',
              jobDescription: 'Pending Job 1',
              recruiter: { name: 'Company A' },
              submittedAt: '2024-01-20T10:00:00.000Z'
            },
            {
              id: 'job_2',
              jobDescription: 'Pending Job 2',
              recruiter: { name: 'Company B' },
              submittedAt: '2024-01-19T15:30:00.000Z'
            }
          ],
          APPROVED: [
            {
              id: 'job_3',
              jobDescription: 'Approved Job 1',
              recruiter: { name: 'Company C' },
              approvedAt: '2024-01-18T12:00:00.000Z'
            }
          ],
          REJECTED: [
            {
              id: 'job_4',
              jobDescription: 'Rejected Job 1',
              recruiter: { name: 'Company D' },
              rejectedAt: '2024-01-17T09:45:00.000Z'
            }
          ]
        }
      })
    })

    const response = await fetch('/api/tpo/jobs-by-status')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobsByStatus.PENDING).toHaveLength(2)
    expect(result.jobsByStatus.APPROVED).toHaveLength(1)
    expect(result.jobsByStatus.REJECTED).toHaveLength(1)
  })

  it('should notify recruiter when job status changes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Job posting approved successfully',
        job: {
          id: 'job_123',
          approvalStatus: 'APPROVED'
        },
        notification: {
          sent: true,
          recipient: 'recruiter@company.com',
          message: 'Your job posting "Software Engineer" has been approved'
        }
      })
    })

    const response = await fetch('/api/jobs/job_123/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', sendNotification: true })
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.notification.sent).toBe(true)
    expect(result.notification.recipient).toBe('recruiter@company.com')
  })

  it('should track job approval history', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        job: {
          id: 'job_123',
          currentStatus: 'APPROVED',
          approvalHistory: [
            {
              status: 'PENDING',
              timestamp: '2024-01-15T10:00:00.000Z',
              updatedBy: 'SYSTEM',
              comment: 'Job posting submitted'
            },
            {
              status: 'APPROVED',
              timestamp: '2024-01-16T14:30:00.000Z',
              updatedBy: 'tpo_admin_123',
              comment: 'Job posting meets all criteria'
            }
          ]
        }
      })
    })

    const response = await fetch('/api/jobs/job_123/approval-history')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.job.approvalHistory).toHaveLength(2)
    expect(result.job.approvalHistory[1].status).toBe('APPROVED')
    expect(result.job.approvalHistory[1].updatedBy).toBe('tpo_admin_123')
  })
})