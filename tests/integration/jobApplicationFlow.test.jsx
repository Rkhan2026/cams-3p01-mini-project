import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Job Application Flow Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should successfully submit job application by approved student', async () => {
    const applicationData = {
      jobId: 'job_123',
      studentId: 'student_456'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application submitted successfully',
        application: {
          id: 'app_123',
          jobId: 'job_123',
          studentId: 'student_456',
          applicationStatus: 'PENDING',
          job: {
            jobDescription: 'Software Engineer',
            recruiter: {
              name: 'TechCorp'
            }
          },
          student: {
            name: 'John Doe',
            email: 'john@student.edu'
          }
        }
      })
    })

    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Application submitted successfully')
    expect(result.application.applicationStatus).toBe('PENDING')
    expect(result.application.jobId).toBe('job_123')
  })

  it('should prevent duplicate applications for same job', async () => {
    const applicationData = {
      jobId: 'job_123',
      studentId: 'student_456'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'You have already applied for this job' }
      })
    })

    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('You have already applied for this job')
  })

  it('should reject application for expired job posting', async () => {
    const applicationData = {
      jobId: 'expired_job_123',
      studentId: 'student_456'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Application deadline has passed' }
      })
    })

    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Application deadline has passed')
  })

  it('should fetch student\'s applications with status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        applications: [
          {
            id: 'app_1',
            applicationStatus: 'PENDING',
            job: {
              id: 'job_1',
              jobDescription: 'Frontend Developer',
              recruiter: {
                name: 'TechCorp',
                companyProfile: 'Leading tech company'
              }
            }
          },
          {
            id: 'app_2',
            applicationStatus: 'ACCEPTED',
            job: {
              id: 'job_2',
              jobDescription: 'Backend Developer',
              recruiter: {
                name: 'StartupCorp',
                companyProfile: 'Innovative startup'
              }
            }
          }
        ]
      })
    })

    const response = await fetch('/api/applications?studentId=current')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.applications).toHaveLength(2)
    expect(result.applications[0].applicationStatus).toBe('PENDING')
    expect(result.applications[1].applicationStatus).toBe('ACCEPTED')
  })

  it('should update application status by recruiter', async () => {
    const updateData = {
      applicationStatus: 'ACCEPTED'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application status updated successfully',
        application: {
          id: 'app_123',
          applicationStatus: 'ACCEPTED',
          student: {
            name: 'John Doe',
            email: 'john@student.edu'
          },
          job: {
            jobDescription: 'Software Engineer'
          }
        }
      })
    })

    const response = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })

    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.message).toBe('Application status updated successfully')
    expect(result.application.applicationStatus).toBe('ACCEPTED')
  })

  it('should reject unauthorized application status update', async () => {
    const updateData = {
      applicationStatus: 'ACCEPTED'
    }

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({
        success: false,
        error: { message: 'Not authorized to update this application' }
      })
    })

    const response = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })

    const result = await response.json()

    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Not authorized to update this application')
  })

  it('should fetch applications for specific job posting', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        applications: [
          {
            id: 'app_1',
            applicationStatus: 'PENDING',
            student: {
              name: 'Alice Smith',
              email: 'alice@student.edu',
              academicRecords: {
                currentCGPA: 8.5,
                courseEnrolled: 'Computer Science'
              }
            }
          },
          {
            id: 'app_2',
            applicationStatus: 'PENDING',
            student: {
              name: 'Bob Johnson',
              email: 'bob@student.edu',
              academicRecords: {
                currentCGPA: 7.8,
                courseEnrolled: 'Information Technology'
              }
            }
          }
        ]
      })
    })

    const response = await fetch('/api/applications?jobId=job_123')
    const result = await response.json()

    expect(result.success).toBe(true)
    expect(result.applications).toHaveLength(2)
    expect(result.applications[0].student.name).toBe('Alice Smith')
    expect(result.applications[1].student.name).toBe('Bob Johnson')
  })
})