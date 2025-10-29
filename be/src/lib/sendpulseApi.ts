import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  // Nếu token còn hạn => dùng lại
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  

  const { data } = await axios.post(`${process.env.SENDPULSE_API_URL}/oauth/access_token`, {
    grant_type: "client_credentials",
    client_id: process.env.SENDPULSE_API_USER_ID,
    client_secret: process.env.SENDPULSE_API_SECRET,
  });

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60_000; // trừ 1 phút an toàn

  return cachedToken!;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const token = await getAccessToken();
  
  const body = {
    email: {
      subject,
      html,
      text: text || "",
      from: {
        name: "Your App",
        email: process.env.SMTP_FROM?.match(/<(.*)>/)?.[1] || process.env.SMTP_FROM,
      },
      to: [{ email: to }],
    },
  };

  await axios.post(`${process.env.SENDPULSE_API_URL}/smtp/emails`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
