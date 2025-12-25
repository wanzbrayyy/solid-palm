const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const MIRRORS = [
    "moviebox.ph",
    "moviebox.pk",
    "netnaija.video",
    "h5.aoneroom.com",
    "movieboxapp.in"
];

const DEFAULT_HEADERS = {
    'X-Client-Info': '{"timezone":"Asia/Jakarta"}',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'application/json',
    'User-Agent': 'okhttp/4.12.0',
    'Connection': 'keep-alive',
    'X-Forwarded-For': '103.147.15.1',
    'CF-Connecting-IP': '103.147.15.1',
    'X-Real-IP': '103.147.15.1'
};

async function makeApiRequest(path, options = {}) {
    let lastError = null;

    for (const host of MIRRORS) {
        try {
            const jar = new CookieJar();
            const client = wrapper(axios.create({
                jar,
                withCredentials: true,
                timeout: 15000
            }));

            const baseUrl = `https://${host}`;
            const headers = {
                ...DEFAULT_HEADERS,
                'Referer': baseUrl,
                'Host': host,
                ...options.headers
            };

            await client.get(`${baseUrl}/wefeed-h5-bff/app/get-latest-app-pkgs?app_name=moviebox`, { headers });

            const response = await client({
                url: `${baseUrl}${path}`,
                method: options.method || 'GET',
                data: options.data,
                params: options.params,
                headers
            });

            if (response.data && response.data.data) {
                return response;
            }

        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(`All mirrors failed. Last error: ${lastError?.message}`);
}

module.exports = { makeApiRequest };