import type { NextApiRequest, NextApiResponse } from 'next';

const INTERNAL_API_URL = 'http://10.101.29.182:8080';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;
  const url = `${INTERNAL_API_URL}/Services/${endpoint}`;
  
  try {
    const fetchOptions: RequestInit = {
      method: req.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.cookie ? { 'Cookie': req.headers.cookie } : {}),
      },
      credentials: 'include',
    };

    if (req.method !== 'GET' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);

    // Forward cookies from backend
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
