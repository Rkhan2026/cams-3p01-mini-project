import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Admin Approval Flow Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should fetch pending student registrations for TPO approval', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        pendingStudents: [
          {
            id: 'student_1',
            name: 'John Doe',
            email: 'john@student.edu',
            enrollmentNo: 'ENR2024001',
            facultyNo: 'FAC001',
            accountStatus: 'PENDING_STUDENT',
            academicRecords: {
              currentCGPA: 8.5,
              courseEnrolled: 'Computer Science Engineering'
            }
          },
          {
            id: 'student_2',
            name: 'Jane Smith',
            email: 'jane@student.edu',
            enrollmentNo: 'ENR2024002',
            accountStatus: 'PENDING_STUDENT',
            academicRecords: {
              currentCGPA: 7.8,
              courseEnrolled: 'Information Technology'
            }
          }
        ]
      })
    })

    const response = await fetch('/api/auth/pending?type=students')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.pendingStudents).toHaveLength(2)
    expect(result.pendingStudents[0].accountStatus).toBe('PENDING_STUDENT')
    expect(result.pendingStudents[1].accountStatus).toBe('PENDING_STUDENT')
  })

  it('should fetch pending recruiter registrations for TPO approval', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        pendingRecruiters: [
          {
            id: 'recruiter_1',
            name: 'Alice Johnson',
            email: 'alice@techcorp.com',
            companyProfile: 'Leading technology solutions provider',
            accountStatus: 'PENDING_RECRUITER'
          },
          {
            id: 'recruiter_2',
            name: 'Bob Wilson',
            email: 'bob@startup.com',
            companyProfile: 'Innovative AI startup',
            accountStatus: 'PENDING_RECRUITER'
          }
        ]
      })
    })

    const response = await fetch('/api/auth/pending?type=recruiters')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.pendingRecruiters).toHaveLength(2)
    expect(result.pendingRecruiters[0].accountStatus).toBe('PENDING_RECRUITER')
    expect(result.pendingRecruiters[1].accountStatus).toBe('PENDING_RECRUITER')
  })

  it('should approve student registration', async () => {
    const approvalData = {
      userId: 'student_123',
      userType: 'student',
      action: 'approve'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Student approved successfully',
        user: {
          id: 'student_123',
          name: 'John Doe',
          email: 'john@student.edu',
          accountStatus: 'APPROVED'
        }
      })
    })

    const response = await fetch('/api/auth/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(approvalData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Student approved successfully')
    expect(result.user.accountStatus).toBe('APPROVED')
  })

  it('should reject student registration', async () => {
    const rejectionData = {
      userId: 'student_123',
      userType: 'student',
      action: 'reject'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Student rejected successfully',
        user: {
          id: 'student_123',
          name: 'John Doe',
          email: 'john@student.edu',
          accountStatus: 'REJECTED'
        }
      })
    })

    const response = await fetch('/api/auth/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rejectionData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Student rejected successfully')
    expect(result.user.accountStatus).toBe('REJECTED')
  })

  it('should approve recruiter registration', async () => {
    const approvalData = {
      userId: 'recruiter_123',
      userType: 'recruiter',
      action: 'approve'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Recruiter approved successfully',
        user: {
          id: 'recruiter_123',
          name: 'Alice Johnson',
          email: 'alice@techcorp.com',
          accountStatus: 'APPROVED'
        }
      })
    })

    const response = await fetch('/api/auth/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(approvalData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Recruiter approved successfully')
    expect(result.user.accountStatus).toBe('APPROVED')
  })

  it('should fetch pending job postings for approval', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobs: [
          {
            id: 'job_1',
            jobDescription: 'Software Engineer Position',
            eligibilityCriteria: 'Bachelor\'s degree, 7.0+ CGPA',
            applicationDeadline: '2024-12-31T23:59:59.000Z',
            approvalStatus: 'PENDING',
            recruiter: {
              name: 'TechCorp',
              companyProfile: 'Leading tech company'
            }
          },
          {
            id: 'job_2',
            jobDescription: 'Data Analyst Role',
            eligibilityCriteria: 'Statistics background, Python skills',
            applicationDeadline: '2024-11-30T23:59:59.000Z',
            approvalStatus: 'PENDING',
            recruiter: {
              name: 'DataCorp',
              companyProfile: 'Data analytics company'
            }
          }
        ]
      })
    })

    const response = await fetch('/api/jobs?status=PENDING')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.jobs).toHaveLength(2)
    expect(result.jobs[0].approvalStatus).toBe('PENDING')
    expect(result.jobs[1].approvalStatus).toBe('PENDING')
  })

  it('should approve job posting', async () => {
    const approvalData = {
      jobId: 'job_123',
      action: 'approve'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Job posting approved successfully',
        job: {
          id: 'job_123',
          jobDescription: 'Software Engineer Position',
          approvalStatus: 'APPROVED'
        }
      })
    })

    const response = await fetch('/api/jobs/job_123/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(approvalData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Job posting approved successfully')
    expect(result.job.approvalStatus).toBe('APPROVED')
  })

  it('should reject job posting', async () => {
    const rejectionData = {
      jobId: 'job_123',
      action: 'reject'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Job posting rejected successfully',
        job: {
          id: 'job_123',
          jobDescription: 'Software Engineer Position',
          approvalStatus: 'REJECTED'
        }
      })
    })

    const response = await fetch('/api/jobs/job_123/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rejectionData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Job posting rejected successfully')
    expect(result.job.approvalStatus).toBe('REJECTED')
  })

  it('should reject approval action from unauthorized user', async () => {
    const approvalData = {
      userId: 'student_123',
      userType: 'student',
      action: 'approve'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({
        success: false,
        error: { message: 'Only TPO admins can approve registrations' }
      })
    })

    const response = await fetch('/api/auth/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(approvalData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Only TPO admins can approve registrations')
  })
})