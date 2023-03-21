require('dotenv').config();

module.exports = () => {
    return {
        "User-Agent": "Cyno (Github:Joshua-Noakes1)",
        "x-api-key": process.env.GC_KEY
    }
}
