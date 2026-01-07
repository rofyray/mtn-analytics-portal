import nodemailer from "nodemailer"

// Create transporter optimized for serverless environments
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Serverless-friendly timeouts (no connection pooling)
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
})

// Verify SMTP connection (can be called on startup for debugging)
export async function verifyEmailConnection() {
  try {
    await transporter.verify()
    console.log("SMTP connection verified successfully")
    return { success: true }
  } catch (error) {
    console.error("SMTP connection verification failed:", error)
    return { success: false, error }
  }
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "MTN Analytics Portal <noreply@mtn.com>",
    to: email,
    subject: "Your OTP Code - MTN Analytics Portal",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #014d6d 0%, #34718a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background: white; border: 2px solid #014d6d; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #014d6d; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MTN Analytics Portal</h1>
              <p>Admin Login Verification</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested to login to the MTN Analytics Portal. Use the following One-Time Password (OTP) to complete your login:</p>

              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; font-size: 12px; color: #999;">Valid for 5 minutes</p>
              </div>

              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in 5 minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>

              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Your OTP Code for MTN Analytics Portal

OTP: ${otp}

This code will expire in 5 minutes.
Do not share this code with anyone.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending OTP email:", error)
    throw new Error("Failed to send OTP email")
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send notification to admins about new request
export async function sendRequestNotification(
  request: any,
  admins: { email: string; name: string }[]
) {
  const adminEmails = admins.map((admin) => admin.email).join(", ")

  const mailOptions = {
    from: process.env.SMTP_FROM || "MTN Analytics Portal <noreply@mtn.com>",
    to: adminEmails,
    subject: `New Analytics Request - ${request.requestType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #014d6d 0%, #34718a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; border-left: 4px solid #014d6d; padding: 15px; margin: 15px 0; }
            .info-row { margin: 8px 0; }
            .label { font-weight: bold; color: #014d6d; }
            .button { display: inline-block; background: #014d6d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Analytics Request</h1>
            </div>
            <div class="content">
              <p>New analytics request submitted by <strong>${request.name}</strong> (${request.email})</p>

              <div class="info-box">
                <div class="info-row"><span class="label">Department:</span> ${request.department}</div>
                <div class="info-row"><span class="label">Type:</span> ${request.requestType}</div>
                <div class="info-row"><span class="label">Due:</span> ${new Date(request.dueDate).toLocaleDateString()}</div>
                <div class="info-row"><span class="label">Description:</span><br>${request.description}</div>
              </div>

              <p>Please log in to the Manager Portal to review and assign.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard" class="button">View in Dashboard</a>
              </div>

              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Admin notification sent to: ${adminEmails}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending admin notification:", error)
    return { success: false, error }
  }
}

// Send confirmation email to requester
export async function sendConfirmation(request: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "MTN Analytics Portal <noreply@mtn.com>",
    to: request.email,
    subject: `Request Received - ${request.requestType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #014d6d 0%, #34718a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .info-box { background: white; border-left: 4px solid #014d6d; padding: 15px; margin: 15px 0; }
            .info-row { margin: 8px 0; }
            .label { font-weight: bold; color: #014d6d; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Request Confirmed</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <h2 style="margin: 0 0 10px 0;">✓ Successfully Submitted</h2>
                <p style="margin: 0;">Your analytics request has been received and is being reviewed.</p>
              </div>

              <p>Dear ${request.name},</p>
              <p>Thank you for submitting your analytics request. Our team will review it and assign an analyst shortly.</p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #014d6d;">Request Details</h3>
                <div class="info-row"><span class="label">Request Type:</span> ${request.requestType}</div>
                <div class="info-row"><span class="label">Department:</span> ${request.department}</div>
                <div class="info-row"><span class="label">Due Date:</span> ${new Date(request.dueDate).toLocaleDateString()}</div>
                <div class="info-row"><span class="label">Description:</span><br>${request.description}</div>
              </div>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>An administrator will review your request</li>
                <li>An analyst will be assigned to work on it</li>
                <li>You'll receive email updates on the progress</li>
                <li>The completed analysis will be delivered by your requested due date</li>
              </ul>

              <p>If you have any questions, please don't hesitate to reach out.</p>

              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Confirmation email sent to: ${request.email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return { success: false, error }
  }
}

// Send assignment email to analyst
export async function sendAssignmentEmail(
  request: any,
  analyst: { email: string; name: string },
  notes?: string
) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "MTN Analytics Portal <noreply@mtn.com>",
    to: analyst.email,
    subject: `New Assignment - ${request.requestType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #014d6d 0%, #34718a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; border-left: 4px solid #014d6d; padding: 15px; margin: 15px 0; }
            .info-row { margin: 8px 0; }
            .label { font-weight: bold; color: #014d6d; }
            .notes-box { background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .button { display: inline-block; background: #014d6d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Request Assigned</h1>
            </div>
            <div class="content">
              <p>You have been assigned a new analytics task:</p>

              <div class="info-box">
                <div class="info-row"><span class="label">Type:</span> ${request.requestType}</div>
                <div class="info-row"><span class="label">Department:</span> ${request.department}</div>
                <div class="info-row"><span class="label">Description:</span><br>${request.description}</div>
                <div class="info-row"><span class="label">Due Date:</span> ${new Date(request.dueDate).toLocaleDateString()}</div>
              </div>

              ${
                notes
                  ? `
              <div class="notes-box">
                <strong>Notes:</strong> ${notes}
              </div>
              `
                  : ""
              }

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard" class="button">View in Dashboard</a>
              </div>

              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Assignment email sent to: ${analyst.email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending assignment email:", error)
    return { success: false, error }
  }
}

// Send completion email to requester
export async function sendCompletionEmail(request: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "MTN Analytics Portal <noreply@mtn.com>",
    to: request.email,
    subject: `Request Completed - ${request.requestType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; font-size: 18px; }
            .info-box { background: white; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
            .info-row { margin: 8px 0; }
            .label { font-weight: bold; color: #28a745; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Request Completed</h1>
            </div>
            <div class="content">
              <div class="success-box">
                Your analytics request "${request.requestType}" has been completed.
              </div>

              <div class="info-box">
                <div class="info-row"><span class="label">Description:</span><br>${request.description}</div>
                <div class="info-row"><span class="label">Completed on:</span> ${new Date().toLocaleString()}</div>
              </div>

              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Completion email sent to: ${request.email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending completion email:", error)
    return { success: false, error }
  }
}

// Send date change notification to requester
export async function sendDateChangeEmail(
  request: any,
  oldDate: Date,
  newDate: Date,
  reason: string
) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "MTN Analytics Portal <noreply@mtn.com>",
    to: request.email,
    subject: `Request Due Date Updated - ${request.requestType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .warning-box { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .info-box { background: white; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
            .info-row { margin: 8px 0; }
            .label { font-weight: bold; color: #856404; }
            .date-change { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: center; }
            .old-date { text-decoration: line-through; color: #dc3545; }
            .new-date { color: #28a745; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Due Date Updated</h1>
            </div>
            <div class="content">
              <p>Y'ello ${request.name},</p>

              <p>Your analytics request "${request.requestType}" (Department: ${request.department}) had its due date updated.</p>

              <div class="date-change">
                <div class="info-row"><span class="label">Old Due Date:</span> <span class="old-date">${new Date(oldDate).toLocaleDateString()}</span></div>
                <div class="info-row"><span class="label">New Due Date:</span> <span class="new-date">${new Date(newDate).toLocaleDateString()}</span></div>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #856404;">Reason</h3>
                <p style="margin: 0;">${reason}</p>
              </div>

              <p>If you have any concerns, please contact the analytics manager.</p>

              <p>Regards,<br><strong>Analytics Team</strong></p>

              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MTN Analytics Portal. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Date change email sent to: ${request.email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending date change email:", error)
    return { success: false, error }
  }
}
