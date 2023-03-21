const lcl = require('cli-color');
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTime(intDate) {
    // get date 
    var date = intDate !== typeof Date ? new Date(intDate) : intDate;

    // check if date is valid
    if (isNaN(date.getTime())) {
        console.log(lcl.red("[DnT - Error]"), `"${intDate}" is not a valid date`);
        return {
            "success": false,
            "message": "Invalid date"
        };
    }

    // add ordinal
    switch (date.getDate()) {
        case 1:
        case 21:
        case 31:
            var ordinal = 'st';
            break;
        case 2:
        case 22:
            var ordinal = 'nd';
            break;
        case 3:
        case 23:
            var ordinal = 'rd';
            break;
        default:
            var ordinal = 'th';
    }

    // return date data
    return {
        "date": `${date.getDate()}`,
        "dateName": `${dayNames[date.getDay()]}`,
        "month": `${Math.floor(date.getMonth() + 1)}`,
        "monthName": `${monthNames[date.getMonth()]}`,
        "year": `${date.getFullYear()}`,
        "ordinal": `${ordinal}`,
        "string": `${dayNames[date.getDay()]} ${monthNames[date.getMonth()]} ${date.getDate()}${ordinal} ${date.getFullYear()}`,
        "original": new Date(date),
    }
}

module.exports = getTime;