// EmailJS configuration and utility functions
// Note: This requires actual EmailJS credentials to be configured in environment variables

export const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
};

// Email templates for different notification types
export const emailTemplates = {
  userApproval: {
    subject: "Account Approval Status",
    getContent: (approved, userName) => ({
      to_name: userName,
      message: approved 
        ? "Your account has been approved! You can now log in to the placement system."
        : "Your account registration has been reviewed and unfortunately was not approved."
    })
  },
  
  jobApproval: {
    subject: "Job Posting Status",
    getContent: (approved, jobTitle, recruiterName) => ({
      to_name: recruiterName,
      message: approved
        ? `Your job posting has been approved and is now visible to students.`
        : `Your job posting has been reviewed and was not approved.`
    })
  },
  
  applicationStatus: {
    subject: "Application Status Update",
    getContent: (status, studentName, companyName) => ({
      to_name: studentName,
      message: `Your application status with ${companyName} has been updated to: ${status.replace('_', ' ').toLowerCase()}`
    })
  },
  
  newJobPosting: {
    subject: "New Job Opportunity Available",
    getContent: (jobTitle, companyName, studentName) => ({
      to_name: studentName,
      message: `A new job opportunity from ${companyName} is now available. Check the placement portal for details.`
    })
  }
};

// Utility function to send email (placeholder implementation)
export const sendEmail = async (templateType, recipientEmail, templateData) => {
  // This is a placeholder implementation
  // In a real application, you would use EmailJS client-side or a server-side email service
  
  console.log('Email would be sent:', {
    type: templateType,
    to: recipientEmail,
    data: templateData
  });
  
  // Return success for now since we don't have real EmailJS credentials
  return { success: true };
};

// Client-side EmailJS sender (to be used in components)
export const sendClientEmail = async (templateType, recipientEmail, templateData) => {
  if (typeof window === 'undefined') {
    console.log('Server-side email sending not implemented');
    return { success: false, error: 'Server-side email not available' };
  }
  
  // This would use the actual EmailJS library when credentials are configured
  console.log('Client email would be sent:', {
    type: templateType,
    to: recipientEmail,
    data: templateData
  });
  
  return { success: true };
};