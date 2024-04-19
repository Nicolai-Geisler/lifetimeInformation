const { app } = require('@azure/functions');

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        context.log('JavaScript HTTP trigger function processed a request.');
        console.log('Received request: ' + req.query);

        let year = req.query.get('year');
        let month = req.query.get('month');
        let day = req.query.get('day');

        if(!year || !month|| !day) {
            return { status: 401, body: "Invalid params" }
        }

        day = parseInt(day, 10);
        month = parseInt(month, 10);
        year = parseInt(year, 10);

        if (year < 0 || year > 2024 || year == null) {
            return { status: 401, body: "Invalid year" }
        }

        if (month < 0 || month > 11 || month == null) {
            return { status: 401, body: "Invalid month" }
        }

        if (day < 0 || day > 31 || day == null) {
            return { status: 401, body: "Invalid day" }
        }

        let testDateObj = new Date(year, month, day);
        let validDate = testDateObj.getFullYear() === year && testDateObj.getMonth() === month && testDateObj.getDate() === day;

        if (!validDate) {
            return { status: 401, body: "Invalid date" }
        }

        const today = new Date();

        // Calculate weekday
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const birthday = weekdays[testDateObj.getDay()];

        // Calculate Days alive
        let diffInMs = today - testDateObj;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        // Calculate age
        let age = today.getFullYear() - testDateObj.getFullYear();
        const dobThisYear = new Date(today.getFullYear(), testDateObj.getMonth(), testDateObj.getDate());
        if(today < dobThisYear) {
            age--;
        }

        // Calculate turtle age
        let turtleAge = (age / 270).toFixed(2)*100 + "%";

        // Build respone JSON
        let responseMessage = {
            "Day of birth": birthday, 
            "Days alive": diffInDays,
            "Current age": age,
            "Compared to Hariett the turtle": turtleAge
        };
        
        context.res = {
            status: 200, /* Defaults to 200 */
            body: JSON.stringify(responseMessage)
        };
        
        return context.res;
    }
});
