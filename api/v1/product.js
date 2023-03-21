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
        res.status(200).json({ success: true, product });
    } catch (err) {
        console.log(lcl.red(err));
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}