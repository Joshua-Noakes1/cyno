require('dotenv').config();
const lcl = require('cli-color');
const fetch = require('node-fetch');
const headers = require('../../lib/headers')();

// fetch https://buy.gigaclear.com/api/obj/product to get all the vouchers
module.exports = async (req, res) => {
    try {
        var GCResponse = await fetch(`${process.env.GC_DOMAIN}/api/obj/product`, {
            method: 'GET',
            headers: headers
        });
        if (GCResponse.status !== 200) {
            console.log(lcl.red(`Error: ${GCResponse.status}`));
            throw new Error(`Error: ${GCResponse.status}`);
        }
        var product = await GCResponse.json();

        // sort over names and make a new array with data more sutiable for the frontend
        var productArray = [];
        for (var types of product["product_groups"]) {
            for (var plans of types["products"]) {
                var charge = {
                    "total": 0,
                    "unknown": 0,
                    "monthly": 0,
                    "oneoff": 0,
                }

                // work out all possible charges
                charge.monthly += Number(plans.service_product.charge.charge);
                for (var addon of plans.ancilliary_products) {
                    switch (addon.charge.charge_type) {
                        case "MONTHLY":
                            charge.monthly += Number(addon.charge.charge);
                            break;
                        case "ONEOFF":
                            charge.oneoff += Number(addon.charge.charge);
                            break;
                        default:
                            charge.unknown += Number(addon.charge.charge);

                    }
                }
                for (var install of plans.installation_products) {
                    switch (install.charge.charge_type) {
                        case "MONTHLY":
                            charge.monthly += Number(install.charge.charge);
                            break;
                        case "ONEOFF":
                            charge.oneoff += Number(install.charge.charge);
                            break;
                        default:
                            charge.unknown += Number(install.charge.charge);

                    }
                }
                for (var activation of plans.activation_products) {
                    switch (activation.charge.charge_type) {
                        case "MONTHLY":
                            charge.monthly += Number(activation.charge.charge);
                            break;
                        case "ONEOFF":
                            charge.oneoff += Number(activation.charge.charge);
                            break;
                        default:
                            charge.unknown += Number(activation.charge.charge);
                    }
                }
                for (var maintenance of plans.maintenance_products) {
                    switch (maintenance.charge.charge_type) {
                        case "MONTHLY":
                            charge.monthly += Number(maintenance.charge.charge);
                            break;
                        case "ONEOFF":
                            charge.oneoff += Number(maintenance.charge.charge);
                            break;
                        default:
                            charge.unknown += Number(maintenance.charge.charge);
                    }
                }
                for (var support of plans.support_products) {
                    switch (support.charge.charge_type) {
                        case "MONTHLY":
                            charge.monthly += Number(support.charge.charge);
                            break;
                        case "ONEOFF":
                            charge.oneoff += Number(support.charge.charge);
                            break;
                        default:
                            charge.unknown += Number(support.charge.charge);
                    }
                }
                for (var voice of plans.voip_products) {
                    switch (voice.charge.charge_type) {
                        case "MONTHLY":
                            charge.monthly += Number(voice.charge.charge);
                            break;
                        case "ONEOFF":
                            charge.oneoff += Number(voice.charge.charge);
                            break;
                        default:
                            charge.unknown += Number(voice.charge.charge);
                    }
                }
                // add the total
                charge.total = Math.floor(Number(charge.monthly) + Number(charge.oneoff) + Number(charge.unknown));


                var productToPush = {
                    int_id: plans.service_product.name,
                    name: plans.service_product.description,
                    description: plans.service_product.detailed_description,
                    type: types.product_group_name.charAt(0).toUpperCase() + types.product_group_name.slice(1).toLowerCase(),
                    int_only: plans.service_product.internal_only,
                    speed: plans.service_product.speed,
                    charge: { ...plans.service_product.charge, "total": charge.total, "unknown": charge.unknown, "monthly": charge.monthly, "oneoff": charge.oneoff },
                    addons: plans.ancilliary_products.map(addon => {
                        return {
                            int_id: addon.name,
                            name: addon.description,
                            description: addon.detailed_description,
                            charge: addon.charge,
                            default: addon.is_default,
                            int_only: addon.internal_only,
                        }
                    }) ,
                    installation: plans.installation_products.map(install => {
                        return {
                            int_id: install.name,
                            name: install.description,
                            description: install.detailed_description,
                            charge: install.charge,
                            default: install.is_default,
                            int_only: install.internal_only,
                        }
                    }),
                    activation: plans.activation_products.map(activation => {
                        return {
                            int_id: activation.name,
                            name: activation.description,
                            description: activation.detailed_description,
                            charge: activation.charge,
                            default: activation.is_default,
                            int_only: activation.internal_only,
                        }
                    }),
                    maintenance: plans.maintenance_products.map(maintenance => {
                        return {
                            int_id: maintenance.name,
                            name: maintenance.description,
                            description: maintenance.detailed_description,
                            charge: maintenance.charge,
                            default: maintenance.is_default,
                            int_only: maintenance.internal_only,
                        }
                    }),
                    support: plans.support_products.map(support => {
                        return {
                            int_id: support.name,
                            name: support.description,
                            description: support.detailed_description,
                            charge: support.charge,
                            default: support.is_default,
                            int_only: support.internal_only,
                        }
                    }),
                    voip: plans.voip_products.map(voice => {
                        return {
                            int_id: voice.name,
                            name: voice.description,
                            description: voice.detailed_description,
                            charge: voice.charge.map,
                            default: voice.is_default,
                            int_only: voice.internal_only,
                        }
                    }),
                    extras: {}
                }
                productToPush.extras = [...productToPush.addons, ...productToPush.installation, ...productToPush.activation, ...productToPush.maintenance, ...productToPush.support, ...productToPush.voip]

                productArray.push(productToPush);
            }
        }

        res.status(200).json({ success: true, productArray });
    } catch (err) {
        console.log(lcl.red(err));
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

function getCharge(charge) {

}