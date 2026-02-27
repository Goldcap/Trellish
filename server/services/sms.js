import twilio from 'twilio';

let twilioClient = null;

function getClient() {
  if (twilioClient) return twilioClient;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    throw new Error('Twilio credentials not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)');
  }

  twilioClient = twilio(sid, token);
  return twilioClient;
}

export async function sendSms(to, body) {
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!fromNumber) {
    throw new Error('Twilio from number not configured (TWILIO_FROM_NUMBER)');
  }

  const client = getClient();
  const message = await client.messages.create({
    body,
    from: fromNumber,
    to,
  });
  return message.sid;
}
