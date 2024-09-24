'use server';

import { Twilio } from 'twilio';

export async function sendSMS(to, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new Twilio(accountSid, authToken);

  try {
    const response = await client.messages.create({
      body: message, // SMS message content
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to, // Recipient's phone number
    });

    return { success: true, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
