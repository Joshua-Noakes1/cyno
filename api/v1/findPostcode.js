require('dotenv').config();
const lcl = require('cli-color');
const fetch = require('node-fetch');
const date = require('../../lib/date');
const headers = require('../../lib/headers')();

// fetch https://buy.gigaclear.com/api/obj/property/ID to get all the vouchers
module.exports = async (req, res) => {
    var { postcode } = req.query;
    if (!postcode) return res.status(400).json({ error: 'Missing postcode' });
    // regex postcode
    var regex = new RegExp(/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i);
    if (!regex.test(postcode)) return res.status(400).json({ error: 'Invalid postcode' });

    try {
        var GCResponse = await fetch(`${process.env.GC_DOMAIN}/api/obj/address/${postcode}`, {
            method: 'GET',
            headers: headers
        });
        if (GCResponse.status !== 200) {
            if (GCResponse.status === 404) return res.status(404).json({ error: 'Postcode not yet covered by Gigaclear' });
            console.log(lcl.red(`Error: ${GCResponse.status}`));
            throw new Error(`Error: ${GCResponse.status}`);
        }
        var postcode = await GCResponse.json();

        // split the first space of address from the address and sort 1 - xx
        postcode.addresses.forEach(address => {
            var split = address.address.split(' ');
            address.building_number = Number(split[0]);
            address.url = "/property/" + address.property_id;
        });
        // sort the addresses by building_number going up from 0
        postcode.addresses.sort((a, b) => a.building_number - b.building_number);
        // delete the building_number from the address
        postcode.addresses.forEach(address => {
            delete address.building_number;
        });


        return res.status(200).json({
            success: true, addresses: postcode.addresses
        });
    } catch (err) {
        console.log(lcl.red(err));
        res.status(500).json({ error: err });
    }
}