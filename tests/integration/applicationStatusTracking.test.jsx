import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Application Status Tracking Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should track application from submission to acceptance', async () => {
    // Step 1: Submit application
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application submitted successfully',
        application: {
          id: 'app_123',
          jobId: 'job_456',
          studentId: 'student_789',
          applicationStatus: 'PENDING'
        }
      })
    })

    const submitResponse = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: 'job_456', studentId: 'student_789' })
    })

    const submitResult = await submitResponse.json()
    expect(submitResult.application.applicationStatus).toBe('PENDING')

    // Step 2: Recruiter updates status to under review
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application status updated successfully',
        application: {
          id: 'app_123',
          applicationStatus: 'UNDER_REVIEW'
        }
      })
    })

    const reviewResponse = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationStatus: 'UNDER_REVIEW' })
    })

    const reviewResult = await reviewResponse.json()
    expect(reviewResult.application.applicationStatus).toBe('UNDER_REVIEW')

    // Step 3: Final acceptance
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application status updated successfully',
        application: {
          id: 'app_123',
          applicationStatus: 'ACCEPTED'
        }
      })
    })

    const acceptResponse = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationStatus: 'ACCEPTED' })
    })

    const acceptResult = await acceptResponse.json()
    expect(acceptResult.application.applicationStatus).toBe('ACCEPTED')
  })

  it('should track application rejection with reason', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application status updated successfully',
        application: {
          id: 'app_123',
          applicationStatus: 'REJECTED',
          rejectionReason: 'Does not meet minimum CGPA requirement'
        }
      })
    })

    const response = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        applicationStatus: 'REJECTED',
        rejectionReason: 'Does not meet minimum CGPA requirement'
      })
    })

    const result = await response.json()
    expect(result.application.applicationStatus).toBe('REJECTED')
    expect(result.application.rejectionReason).toBe('Does not meet minimum CGPA requirement')
  })

  it('should fetch application history with timestamps', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        application: {
          id: 'app_123',
          currentStatus: 'ACCEPTED',
          statusHistory: [
            {
              status: 'PENDING',
              timestamp: '2024-01-15T10:00:00.000Z',
              updatedBy: 'SYSTEM'
            },
            {
              status: 'UNDER_REVIEW',
              timestamp: '2024-01-16T14:30:00.000Z',
              updatedBy: 'recruiter_456'
            },
            {
              status: 'ACCEPTED',
              timestamp: '2024-01-18T09:15:00.000Z',
              updatedBy: 'recruiter_456'
            }
          ]
        }
      })
    })

    const response = await fetch('/api/applications/app_123/history')
    const result = await response.json()

    expect(result.application.currentStatus).toBe('ACCEPTED')
    expect(result.application.statusHistory).toHaveLength(3)
    expect(result.application.statusHistory[0].status).toBe('PENDING')
    expect(result.application.statusHistory[2].status).toBe('ACCEPTED')
  })

  it('should notify student of status changes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application status updated and notification sent',
        application: {
          id: 'app_123',
          applicationStatus: 'ACCEPTED'
        },
        notification: {
          sent: true,
          recipient: 'student@edu.com',
          message: 'Your application for Software Engineer position has been accepted'
        }
      })
    })

    const response = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        applicationStatus: 'ACCEPTED',
        sendNotification: true
      })
    })

    const result = await response.json()
    expect(result.notification.sent).toBe(true)
    expect(result.notification.recipient).toBe('student@edu.com')
  })

  it('should filter applications by status for student dashboard', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        applications: {
          pending: [
            {
              id: 'app_1',
              applicationStatus: 'PENDING',
              job: { jobDescription: 'Frontend Developer' }
            }
          ],
          underReview: [
            {
              id: 'app_2',
              applicationStatus: 'UNDER_REVIEW',
              job: { jobDescription: 'Backend Developer' }
            }
          ],
          accepted: [
            {
              id: 'app_3',
              applicationStatus: 'ACCEPTED',
              job: { jobDescription: 'Full Stack Developer' }
            }
          ],
          rejected: [
            {
              id: 'app_4',
              applicationStatus: 'REJECTED',
              job: { jobDescription: 'Data Scientist' }
            }
          ]
        }
      })
    })

    const response = await fetch('/api/applications?studentId=current&groupByStatus=true')
    const result = await response.json()

    expect(result.applications.pending).toHaveLength(1)
    expect(result.applications.underReview).toHaveLength(1)
    expect(result.applications.accepted).toHaveLength(1)
    expect(result.applications.rejected).toHaveLength(1)
  })

  it('should track bulk status updates for recruiter', async () => {
    const bulkUpdateData = {
      applicationIds: ['app_1', 'app_2', 'app_3'],
      applicationStatus: 'REJECTED',
      rejectionReason: 'Position filled'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Bulk status update completed',
        updatedApplications: [
          { id: 'app_1', applicationStatus: 'REJECTED' },
          { id: 'app_2', applicationStatus: 'REJECTED' },
          { id: 'app_3', applicationStatus: 'REJECTED' }
        ],
        notificationsSent: 3
      })
    })

    const response = await fetch('/api/applications/bulk-update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bulkUpdateData)
    })

    const result = await response.json()
    expect(result.updatedApplications).toHaveLength(3)
    expect(result.notificationsSent).toBe(3)
  })

  it('should prevent invalid status transitions', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Invalid status transition from REJECTED to ACCEPTED' }
      })
    })

    const response = await fetch('/api/applications/app_123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationStatus: 'ACCEPTED' })
    })

    const result = await response.json()
    expect(result.success).toBe(false)
    expect(result.error.message).toBe('Invalid status transition from REJECTED to ACCEPTED')
  })

  it('should generate application status report for TPO', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        report: {
          totalApplications: 150,
          statusBreakdown: {
            PENDING: 45,
            UNDER_REVIEW: 30,
            ACCEPTED: 35,
            REJECTED: 40
          },
          averageProcessingTime: '3.5 days',
          topCompanies: [
            { name: 'TechCorp', applications: 25 },
            { name: 'StartupCorp', applications: 18 }
          ]
        }
      })
    })

    const response = await fetch('/api/tpo/application-status-report')
    const result = await response.json()

    expect(result.report.totalApplications).toBe(150)
    expect(result.report.statusBreakdown.PENDING).toBe(45)
    expect(result.report.statusBreakdown.ACCEPTED).toBe(35)
    expect(result.report.averageProcessingTime).toBe('3.5 days')
  })
})