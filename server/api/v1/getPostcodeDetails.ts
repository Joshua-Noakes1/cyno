import lcl from 'cli-color';
import gigaclearAPI from '~/assets/gigaclear/apiHandle';

// Returns all addresses from a postcode
export default defineEventHandler(async (event) => {
    try {
        // get postcode from ?postdode= query
        let URLSearchQuery = getQuery(event);
        let postcode = URLSearchQuery['postcode']?.toString().trim().replace(/\s/g, ''); // I don't know if the API accepts spaces in the postcode
        if (!postcode) throw new Error('No postcode provided'); 
        if (!postcode.match(/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i)) throw new Error('Invalid postcode'); // check if postcode matches regex

        // get postcode details from API
        let gigaclearPostcodeDetails = await gigaclearAPI(`/obj/address/${postcode}`);
        if (!gigaclearPostcodeDetails['success']) throw new Error(gigaclearPostcodeDetails['statusCode'] == 404 ? 'Gigaclear doesn\'t cover this postcode!' : gigaclearPostcodeDetails['message']);

        // sort addresses by house number (eg 1 Smith Street, 2 Smith Street, 3 Smith Street)
        gigaclearPostcodeDetails['data']['addresses'].sort((a: any, b: any) => {
            let aHouseNumber = parseInt(a['address'].match(/\d+/g)[0]);
            let bHouseNumber = parseInt(b['address'].match(/\d+/g)[0]);
            return aHouseNumber - bHouseNumber;
        });

        // return postcode details
        return {
            success: true,
            data: gigaclearPostcodeDetails['data']['addresses']
        }
    } catch (err: any) {
        console.log(`${lcl.redBright(`[Gigaclear API - Error]`)} Failed to get postcode details${process.env.NODE_ENV == 'development' ? `: ${err['message']}` : ''}`);
        throw createError({
            statusCode: 500,
            statusText: process.env.NODE_ENV == 'development' ? err['message'] : 'Something went wrong!',
        });
    }
});