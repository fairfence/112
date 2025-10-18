// SendGrid API email service
import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

// Configuration variables
const SENDGRID_FROM = process.env.SENDGRID_FROM || 'admin@fairfencecontracting.co.nz';
const SENDGRID_TO = process.env.SENDGRID_TO || 'admin@fairfencecontracting.co.nz';
const SENDGRID_SANDBOX = process.env.SENDGRID_SANDBOX === 'true';

// Warn if using default from address
if (!process.env.SENDGRID_FROM) {
  console.warn('⚠️  SENDGRID_FROM not set, using default. Please verify this sender identity in SendGrid.');
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      ...(SENDGRID_SANDBOX && { mailSettings: { sandboxMode: { enable: true } } }),
    };
    
    if (params.text) {
      emailData.text = params.text;
    }
    
    if (params.html) {
      emailData.html = params.html;
    }
    
    if (params.replyTo) {
      emailData.replyTo = params.replyTo;
    }
    
    await mailService.send(emailData);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error: any) {
    console.error('SendGrid API email error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseBody: error.response?.body?.errors,
      details: error
    });
    return false;
  }
}

// Function to send contact form notification email
export async function sendContactFormEmail(contactData: {
  clientname: string;
  email?: string | null;
  phonenumber: string;
  serviceparts?: string | null;
  address?: string | null;
  siteaddress?: string | null;
  projectname?: string | null;
}): Promise<boolean> {
  const emailHtml = `
    <h2>New Quote Request from FairFence Website</h2>
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p><strong>Client Name:</strong> ${contactData.clientname}</p>
      <p><strong>Email:</strong> ${contactData.email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${contactData.phonenumber}</p>
      <p><strong>Service Type:</strong> ${contactData.serviceparts || 'Not specified'}</p>
      <p><strong>Project Name:</strong> ${contactData.projectname || 'Not specified'}</p>
      <p><strong>Client Address:</strong> ${contactData.address || 'Not provided'}</p>
      <p><strong>Site Address:</strong> ${contactData.siteaddress || 'Same as client address'}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This email was sent from the FairFence Contracting website contact form.
      </p>
    </div>
  `;

  const emailText = `
New Quote Request from FairFence Website

Client Name: ${contactData.clientname}
Email: ${contactData.email || 'Not provided'}
Phone: ${contactData.phonenumber}
Service Type: ${contactData.serviceparts || 'Not specified'}
Project Name: ${contactData.projectname || 'Not specified'}
Client Address: ${contactData.address || 'Not provided'}
Site Address: ${contactData.siteaddress || 'Same as client address'}

---
This email was sent from the FairFence Contracting website contact form.
  `;

  return await sendEmail({
    to: SENDGRID_TO,
    from: SENDGRID_FROM,
    replyTo: contactData.email || undefined,
    subject: `New Quote Request from ${contactData.clientname}`,
    html: emailHtml,
    text: emailText,
  });
}

interface FenceLineData {
  lineDescription?: string;
  length: string;
  height?: string;
  fenceType: string;
  railWireCount?: string;
  specialNotes?: string;
}

export async function sendSiteSurveyEmail(surveyData: {
  customerName: string;
  phone: string;
  email?: string | null;
  propertyAddress: string;
  removalRequired?: boolean;
  additionalNotes?: string | null;
  fenceLines: FenceLineData[];
  photoUrls?: string[];
}): Promise<boolean> {
  let fenceLinesHtml = '';
  let fenceLinesText = '';

  surveyData.fenceLines.forEach((line, index) => {
    fenceLinesHtml += `
      <div style="margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #f97316;">
        <h4 style="margin: 0 0 10px 0; color: #f97316;">Fence Line ${index + 1}</h4>
        ${line.lineDescription ? `<p><strong>Description:</strong> ${line.lineDescription}</p>` : ''}
        <p><strong>Length:</strong> ${line.length} metres</p>
        ${line.height ? `<p><strong>Height:</strong> ${line.height}</p>` : ''}
        <p><strong>Fence Type:</strong> ${line.fenceType}</p>
        ${line.railWireCount ? `<p><strong>Rails/Wires:</strong> ${line.railWireCount}</p>` : ''}
        ${line.specialNotes ? `<p><strong>Notes:</strong> ${line.specialNotes}</p>` : ''}
      </div>
    `;

    fenceLinesText += `
Fence Line ${index + 1}:
${line.lineDescription ? `  Description: ${line.lineDescription}` : ''}
  Length: ${line.length} metres
${line.height ? `  Height: ${line.height}` : ''}
  Fence Type: ${line.fenceType}
${line.railWireCount ? `  Rails/Wires: ${line.railWireCount}` : ''}
${line.specialNotes ? `  Notes: ${line.specialNotes}` : ''}
`;
  });

  let photosHtml = '';
  let photosText = '';

  if (surveyData.photoUrls && surveyData.photoUrls.length > 0) {
    photosHtml = '<h3 style="color: #f97316; margin-top: 20px;">Site Photos</h3><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';

    surveyData.photoUrls.forEach((url, index) => {
      photosHtml += `<div><a href="${url}" target="_blank"><img src="${url}" alt="Site photo ${index + 1}" style="width: 100%; max-width: 300px; height: auto; border-radius: 8px; border: 2px solid #e5e7eb;"/></a></div>`;
    });

    photosHtml += '</div>';

    photosText = '\nSite Photos:\n';
    surveyData.photoUrls.forEach((url, index) => {
      photosText += `  Photo ${index + 1}: ${url}\n`;
    });
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">New Site Survey Submission</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">FairFence Contracting Website</p>
      </div>

      <div style="padding: 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Customer Information</h2>
        <p><strong>Name:</strong> ${surveyData.customerName}</p>
        <p><strong>Phone:</strong> ${surveyData.phone}</p>
        <p><strong>Email:</strong> ${surveyData.email || 'Not provided'}</p>
        <p><strong>Property Address:</strong> ${surveyData.propertyAddress}</p>

        <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 30px;">Fence Lines</h2>
        ${fenceLinesHtml}

        <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 30px;">Additional Information</h2>
        <p><strong>Removal of Existing Fence Required:</strong> ${surveyData.removalRequired ? 'Yes' : 'No'}</p>
        ${surveyData.additionalNotes ? `<p><strong>Additional Notes:</strong> ${surveyData.additionalNotes}</p>` : '<p><strong>Additional Notes:</strong> None</p>'}

        ${photosHtml}
      </div>

      <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">This email was sent from the FairFence Contracting website site survey form.</p>
        <p style="margin: 5px 0 0 0;">Submitted on ${new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}</p>
      </div>
    </div>
  `;

  const emailText = `
NEW SITE SURVEY SUBMISSION
FairFence Contracting Website

CUSTOMER INFORMATION
=====================
Name: ${surveyData.customerName}
Phone: ${surveyData.phone}
Email: ${surveyData.email || 'Not provided'}
Property Address: ${surveyData.propertyAddress}

FENCE LINES
===========
${fenceLinesText}

ADDITIONAL INFORMATION
======================
Removal of Existing Fence Required: ${surveyData.removalRequired ? 'Yes' : 'No'}
Additional Notes: ${surveyData.additionalNotes || 'None'}
${photosText}

---
This email was sent from the FairFence Contracting website site survey form.
Submitted on ${new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}
  `;

  return await sendEmail({
    to: SENDGRID_TO,
    from: SENDGRID_FROM,
    replyTo: surveyData.email || undefined,
    subject: `New Site Survey from ${surveyData.customerName} - ${surveyData.propertyAddress}`,
    html: emailHtml,
    text: emailText,
  });
}