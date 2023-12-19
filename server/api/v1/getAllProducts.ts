import lcl from 'cli-color';
import gigaclearAPI from '~/assets/gigaclear/apiHandle';

// Returns all products from Gigaclear
export default defineEventHandler(async (event) => {
    try {
        // get api
        let gigaclearProducts = await gigaclearAPI('/obj/product');
        if (!gigaclearProducts['success']) throw new Error(gigaclearProducts['message']);

        // return products
        return {
            success: true,
            data: gigaclearProducts['data']
        }
    } catch(err: any) {
        throw createError({
            statusCode: 500,
            statusText: process.env.NODE_ENV == 'development' ? err['message'] : 'Something went wrong!',
        })
    }
});