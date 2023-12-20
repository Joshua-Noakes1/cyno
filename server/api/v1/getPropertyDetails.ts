import lcl from 'cli-color';
import gigaclearAPI from '~/assets/gigaclear/apiHandle';

// Returns all addresses from a postcode
export default defineEventHandler(async (event) => {
    try {
        // get the property id from the query
        let URLSearchQuery = getQuery(event);
        let propertyID = URLSearchQuery['propertyID']?.toString().trim();
        if (!propertyID) throw new Error('No property ID provided');
        if (!propertyID.match(/^[a-zA-Z0-9]{15,18}$/)) throw new Error('Invalid property ID'); // Copilot assumes that this is a salesforce ID

        let gigaclearPropertyDetails = await gigaclearAPI(`/obj/property/${propertyID}`);
        if (!gigaclearPropertyDetails['success']) throw new Error(gigaclearPropertyDetails['statusCode'] == 404 ? 'Gigaclear doesn\'t cover this property!' : gigaclearPropertyDetails['message']);

        // filter property details
        let propertyDetails = {
            "property": {
                "id": gigaclearPropertyDetails['data']['property_id']?.toString().trim(),
                "name": gigaclearPropertyDetails['data']['address']?.toString().trim(),
                "message": gigaclearPropertyDetails['data']['message']?.toString().trim(),
                "address": {
                    "line1": gigaclearPropertyDetails['data']['address']?.toString().split(gigaclearPropertyDetails['data']['locality']?.toString().trim())[0].trim(),
                    "village": gigaclearPropertyDetails['data']['locality']?.toString().trim(),
                    "town": gigaclearPropertyDetails['data']['post_town']?.toString().trim(),
                    "county": gigaclearPropertyDetails['data']['county']?.toString().trim(),
                    "postcode": gigaclearPropertyDetails['data']['post_code']?.toString().trim(),
                },
                "service": {
                    "isOrderAvailable": gigaclearPropertyDetails['data']['rfs']?.toString().trim() == "true" || gigaclearPropertyDetails['data']['pre_order']?.toString().trim() == "true" ? true : false,
                    "isReadyForService": gigaclearPropertyDetails['data']['rfs']?.toString().trim() == "true" ? true : false,
                    "isPreOrder": gigaclearPropertyDetails['data']['pre_order']?.toString().trim() == "true" ? true : false,
                    "hasServiceInstalled": gigaclearPropertyDetails['data']['service_installed']?.toString().trim() == "true" ? true : false,
                }
            },
            "community": {
                "id": gigaclearPropertyDetails['data']['community_id']?.toString().trim(),
                "name": gigaclearPropertyDetails['data']['community_name']?.toString().trim(),
                "isMarketTown": gigaclearPropertyDetails['data']['market_town_community']?.toString().trim(),
                "isBuildDigital": gigaclearPropertyDetails['data']['bduk_flag']?.toString().trim() == "true" ? true : false,
                "isRuralGigabitCommunity": gigaclearPropertyDetails['data']['rgc_active']?.toString().trim() == "true" ? true : false,
            }
        };

        // return property details
        return {
            success: true,
            data: propertyDetails            
        }
    } catch (err: any) {
        console.log(`${lcl.redBright(`[Gigaclear API - Error]`)} Failed to get postcode details${process.env.NODE_ENV == 'development' ? `: ${err['message']}` : ''}`);
        throw createError({
            statusCode: 500,
            statusText: process.env.NODE_ENV == 'development' ? err['message'] : 'Something went wrong!',
        })
    }
});