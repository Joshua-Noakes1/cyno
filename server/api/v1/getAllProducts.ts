import lcl from 'cli-color';
import gigaclearAPI from '~/assets/gigaclear/apiHandle';

// map the extra products to a more readable format
function mapExtras(extraProduct: any) {
    return {
        "id": extraProduct['product_id']?.toString().trim(),
        "name": extraProduct['description']?.toString().trim(),
        "description": extraProduct['detailed_description']?.toString().trim(),
        "charge": extraProduct['charge']['charge_type']?.toString().toUpperCase().trim() == "FREE" ? '0.0' : extraProduct['charge']['charge']?.toString().trim(),
        "isOneOff": extraProduct['charge']['charge_type']?.toString().toUpperCase().trim() == "ONEOFF" ? true : false, // would be added at the start of the contract (eg an install fee)
        "isMonthly": extraProduct['charge']['charge_type']?.toString().toUpperCase().trim() == "MONTHLY" ? true : false,
        "isDefault": extraProduct['is_default']?.toString().trim() == "true" ? true : false,
        "isInternalProduct": extraProduct['internal_only']?.toString().trim() == "true" ? true : false,
    }
}

// Returns all products from Gigaclear
export default defineEventHandler(async (event) => {
    try {
        // get the product id from the query
        let URLSearchQuery = getQuery(event);
        let productID = URLSearchQuery['productID']?.toString().trim();

        // get api
        let gigaclearProducts = await gigaclearAPI('/obj/product');
        if (!gigaclearProducts['success']) throw new Error(gigaclearProducts['message']);

        // filter products eg business residential etc, and make data more readable
        let products: any = [];
        for (let productGroup of gigaclearProducts['data']['product_groups']) {
            let productGroupName = productGroup['product_group_name']?.toString().toLowerCase().trim();
            console.log(`${lcl.blueBright(`[Gigaclear API - Info]`)} Found Product Group "${productGroupName.charAt(0).toUpperCase() + productGroupName.slice(1)}", Sorting ${productGroup['products'].length} Products...`);

            // loop through products in product group and sort
            for (let productIndexAPI in productGroup['products']) {
                let productAPI = productGroup['products'][productIndexAPI];
                try {
                    let productJSON: any = {
                        // Main Product Info
                        "id": productAPI['service_product']['product_id']?.toString().trim(), // Certian product names have symbols in them this seems better 
                        "name": productAPI['service_product']['name']?.toString().toUpperCase().trim(),
                        "description": productAPI['service_product']['description']?.toString().trim(),
                        "contractLength": productAPI['service_product']['contract_length']?.toString().trim(), // Shown in months
                        "chargeMonthly": productAPI['service_product']['charge']['charge']?.toString().trim(), // Shown in £ and pence 
                        "type": productGroupName,
                        // Product Details
                        "speed": {
                            "max": productAPI['service_product']['speed']['maximum_speed']?.toString().trim(), // Shown in Mbps
                            "min": productAPI['service_product']['speed']['minimum_speed']?.toString().trim(), // Shown in Mbps
                            "avg": productAPI['service_product']['speed']['average_speed']?.toString().trim(), // Shown in Mbps
                        },
                        // product details
                        "details": {
                            "isDefault": productAPI['service_product']['is_default']?.toString().trim() == "true" ? true : false,
                            "isInternalProduct": productAPI['service_product']['internal_only']?.toString().trim() == "true" ? true : false,
                            "productUsageLimit": productAPI['service_product']['usage_limit']?.toString().trim(),
                            "wifi": {
                                "routerProvided": productAPI['service_product']['wifi_point_type']?.toString().trim(),
                                "amountOfWAP": productAPI['service_product']['number_of_wifi_points']?.toString().trim(),
                            }
                        },
                        "extras": {
                            "install": productAPI['installation_products'].map((installProduct: any) => mapExtras(installProduct)),
                            "ancilliary": productAPI['ancilliary_products'].map((ancilliaryProduct: any) => mapExtras(ancilliaryProduct)),
                            "activation": productAPI['activation_products'].map((activationProduct: any) => mapExtras(activationProduct)),
                            "maintenance": productAPI['maintenance_products'].map((maintenanceProduct: any) => mapExtras(maintenanceProduct)),
                            "support": productAPI['support_products'].map((supportProduct: any) => mapExtras(supportProduct)),
                            "voice": productAPI['voip_products'].map((voiceProduct: any) => mapExtras(voiceProduct)),
                        }
                    }

                    // Add product to products
                    products.push(productJSON);
                } catch (err: any) {
                    console.log(`${lcl.redBright(`[Gigaclear API - Error]`)} Failed to sort product ${Math.floor(Number(productIndexAPI) + 1)} / ${productGroup['products'].length} in Product Group "${productGroupName.charAt(0).toUpperCase() + productGroupName.slice(1)}" ${err}`);
                }
            }

            console.log(`${lcl.greenBright(`[Gigaclear API - Success]`)} Sorted Product Group "${productGroupName.charAt(0).toUpperCase() + productGroupName.slice(1)}"`);
        }

        // if productID is provided, filter products to only include that product
        if (productID) { // Copilot assumes that this is a salesforce ID
            if (!productID.match(/^[a-zA-Z0-9]{15,18}$/)) throw new Error('Invalid product ID');
            products = products.filter((product: any) => product['id'] == productID);
            if (products.length <= 0) throw new Error('No products found!');
            products = products[0];
        }
        
        // return products
        return {
            success: true,
            data: products
        }
    } catch (err: any) {
        console.log(`${lcl.redBright(`[Gigaclear API - Error]`)} Failed to get product details${process.env.NODE_ENV == 'development' ? `: ${err['message']}` : ''}`);
        throw createError({
            statusCode: 500,
            statusText: process.env.NODE_ENV == 'development' ? err['message'] : 'Something went wrong!',
        });
    }
});