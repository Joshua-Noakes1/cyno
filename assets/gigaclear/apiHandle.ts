import lcl from 'cli-color';

export default async function apiHandle(url: String, method: String = 'GET', body: Object = {}) {
    try {
        // add body if not GET or HEAD
        let gigaclearOptions: any = {
            "method": method.toString(),
            "headers": {
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0 (Github: @Joshua-Noakes1/cyno)",
                "Referer": "https://buy.gigaclear.com/",
                "x-api-key": process.env.API_KEY || "dzdRdkxmZHlmUFVncXM1YlBPaHY="
            }
        }
        if (method?.toString() !== 'GET' && method?.toString() !== 'HEAD') gigaclearOptions['body'] = JSON.stringify(body);


        // Fetch API from Gigaclear
        let gigaclearResponse = await fetch(`https://buy.gigaclear.com/api${url}`, gigaclearOptions);
        if (gigaclearResponse['status'] !== 200) {
            throw new Error(`Status code ${gigaclearResponse['status']}`);
        }

        // Parse response
        return {
            success: true,
            data: await gigaclearResponse.json()
        }
    } catch (err: any) {
        console.log(`${lcl.redBright(`[Gigaclear API - Error]`)} Failed to fetch "${url}"${process.env.NODE_ENV == 'development' ? `: ${err['message']}` : ''}`);
        return {
            success: false,
            message: `Failed to fetch "${url}"${process.env.NODE_ENV == 'development' ? `: ${err['message']}` : ''}`
        }
    }
}