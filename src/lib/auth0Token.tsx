import axios from 'axios';

let cachedToken: string | null = null;
let tokenExpiry = 0; 

export async function getManagementApiToken() {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && now < tokenExpiry - 60) {
    return cachedToken;
  }

  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_M2M_CLIENT_ID;
  const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
  const audience = process.env.AUTH0_MANAGEMENT_AUDIENCE;

  const res = await axios.post(`https://${domain}/oauth/token`, {
    client_id: clientId,
    client_secret: clientSecret,
    audience,
    grant_type: 'client_credentials',
  });

  const { access_token, expires_in } = res.data;
  cachedToken = access_token;
  tokenExpiry = now + expires_in;

  return cachedToken;
}
