require('dotenv').config();
const lcl = require('cli-color');
const fetch = require('node-fetch');
const date = require('../../lib/date');
const headers = require('../../lib/headers')();

// fetch https://buy.gigaclear.com/api/obj/property/ID to get all the vouchers
module.exports = async (req, res) => {
    var { propertyID } = req.query;
    if (!propertyID) return res.status(400).json({ error: 'Missing propertyID' });
    try {
        var GCProperty = await fetch(`${process.env.GC_DOMAIN}/api/obj/property/${propertyID}`, {
            method: 'GET',
            headers: headers
        });
        if (GCProperty.status !== 200) {
            console.log(lcl.red(`Error: ${GCProperty.status}`));
            throw new Error(`Error: ${GCProperty.status}`);
        }
        var property = await GCProperty.json();

        return res.status(200).json({
            success: true, service: {
                property: {
                    id: property.property_id,
                    address: property.address,
                    building_number: property.building_number,
                    street_name: property.street_name,
                    locality: property.locality,
                    post_town: property.post_town,
                    post_code: property.post_code,
                    county: property.county,
                    building_digital_uk: property.bduk_flag,
                    order_available: property.rfs || property.pre_order,
                    ready_for_service: property.rfs,
                    pre_order: property.pre_order,
                },
                community: {
                    id: property.community_id,
                    name: property.community_name,
                    estimated_completion: date(new Date(property.estimated_completion)),
                    estimated_start_date: date(new Date(property.estimated_start_date)),
                    status: property.status,
                    service_installed: property.service_installed,
                    market_town_community: property.market_town_community,
                }
            }
        });
    } catch (err) {
        console.log(lcl.red(err));
        res.status(500).json({ error: err });
    }
}