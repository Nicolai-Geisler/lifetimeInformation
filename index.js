module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let year = (req.query.year || (req.body && req.body.year));
    let month = (req.query.month || (req.body && req.body.month));
    let day = (req.query.day || (req.body && req.body.day));

    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    if(year < 0 || year > 2024 || year == NULL) {
        context.res = { status: 401, body: "Invalid year" }
        return;
    }

    if(month < 1 || month > 12 || month == NULL) {
        context.res = { status: 401, body: "Invalid month" }
        return;
    }

    if(day < 0 || day > 31 || day == NULL) {
        context.res = { status: 401, body: "Invalid day" }
        return;
    }
 
    let testDateObj = new Date(year, month, day);
    let validDate = testDateObj.getFullYear() === year && testDateObj.getMonth() === month && testDateObj.getDate() === day;
 
    if (!validDate) {
        context.res = { status: 401, body: "Invalid date" }
        return;
    }

    // Calculate weekday
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const birthday = weekdays[testDateObj.getDay()];
    console.log(birthday);

    const responseMessage = "";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}
