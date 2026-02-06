import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const service = formData.get('service')?.toString() || 'Not specified';
    const address = formData.get('address')?.toString() || 'Not provided';
    const message = formData.get('message')?.toString() || '';

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Please fill in all required fields.' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Service name mapping
    const serviceNames: Record<string, string> = {
      'pest-control': 'General Pest Control',
      'lawn-maintenance': 'Lawn Maintenance',
      'garden-care': 'Garden Care',
      '': 'Not specified'
    };

    const serviceName = serviceNames[service] || service;

    // Send email to business owner
    const { error } = await resend.emails.send({
      from: 'Highfields Website <noreply@highfieldspestandlawn.com.au>',
      to: ['HighfieldsLGM@outlook.com'],
      replyTo: email,
      subject: `New Enquiry: ${serviceName} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2c675c 0%, #1e4a43 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Website Enquiry</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <h2 style="color: #2c675c; margin-top: 0;">Contact Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 140px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">
                  <a href="mailto:${email}" style="color: #2c675c;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">
                  <a href="tel:${phone}" style="color: #2c675c;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Service:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Address:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${address}</td>
              </tr>
            </table>
            
            <h2 style="color: #2c675c; margin-top: 30px;">Message</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="color: #4b5563; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
          </div>
          
          <div style="padding: 20px; background-color: #2c675c; text-align: center;">
            <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
              This enquiry was submitted via the Highfields Pest & Lawn website
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to send message. Please try again or call us directly.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you! Your message has been sent. We\'ll be in touch within 24 hours.' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An unexpected error occurred. Please try again or call us directly.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
