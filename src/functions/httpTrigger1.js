const { app } = require('@azure/functions');

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        context.log('JavaScript HTTP trigger function processed a request.');

        const reqBody = await req.json();
        let year = req.query.get('year') || (reqBody && reqBody.year);
        let month = req.query.get('month') || (reqBody && reqBody.month);
        let day = req.query.get('day') || (reqBody && reqBody.day);

        if(!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
            return { status: 401, body: "Invalid params" }
        }

        day = parseInt(day, 10);
        month = parseInt(month, 10);
        year = parseInt(year, 10);

        if (year < 0 || year > 2024) {
            return { status: 401, body: "Invalid year" }
        }

        if (month < 0 || month > 11) {
            return { status: 401, body: "Invalid month" }
        }

        if (day < 0 || day > 31) {
            return { status: 401, body: "Invalid day" }
        }

        const inputDate = new Date(year, month, day);
        const isValidDate = inputDate.getFullYear() === year && inputDate.getMonth() === month && inputDate.getDate() === day;

        if (!isValidDate) {
            return { status: 401, body: "Invalid date" }
        }

        const today = new Date();
        const currentAge = calculateCurrentAge(today, inputDate);

        // Build response JSON
        let responseMessage = {
            "Day of birth": getWeekdayOfBirth(inputDate),
            "Days alive": calculateDaysAlive(today, inputDate),
            "Current age": currentAge,
            "Compared to Hariett the turtle": calculateTurtleAge(currentAge)
        };

        return {
            status: 200, /* Defaults to 200 */
            body: JSON.stringify(responseMessage)
        };
    },
});

function getWeekdayOfBirth(inputDate) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return  weekdays[new Date(inputDate).getDay()];
}

function calculateDaysAlive(today, inputDate) {
    const diffInMs = new Date(today) - new Date(inputDate);
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

function calculateCurrentAge(today, inputDate) {
    let age = today.getFullYear() - inputDate.getFullYear();
    const dobThisYear = new Date(today.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    if(today < dobThisYear) {
        age--;
    }
    return age;
}

function calculateTurtleAge(age) {
    return (age / 270).toFixed(2)*100 + "%";
}
