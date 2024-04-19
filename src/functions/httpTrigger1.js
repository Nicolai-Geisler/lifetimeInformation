const { app } = require('@azure/functions');

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        context.log('JavaScript HTTP trigger function processed a request.');

        const reqBody = await req.json().catch(() => {});

        const year = req.query.get('year') || (reqBody && reqBody.year);
        const month = req.query.get('month') || (reqBody && reqBody.month);
        const day = req.query.get('day') || (reqBody && reqBody.day);

        const inputDate = validateArguments(year, month, day);
        if (!inputDate) {
              return { status: 401, body: "Invalid date" };
        };

        const today = new Date();
        const currentAge = calculateCurrentAge(today, inputDate);

        // Build response JSON
        const responseMessage = {
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

function validateArguments(year, month, day) {
    if(!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
        return { status: 401, body: "Invalid params" };
    };

    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    if (year < 0 || year > 2024) {
        return;
    };

    if (month < 0 || month > 11) {
        return;
    };

    if (day < 0 || day > 31) {
        return;
    };

    const inputDate = new Date(year, month, day);
    const isValidDate = inputDate.getFullYear() === year && inputDate.getMonth() === month && inputDate.getDate() === day;

    if (!isValidDate) {
        return;
    };

    return inputDate;
};

function getWeekdayOfBirth(inputDate) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return  weekdays[new Date(inputDate).getDay()];
};

function calculateDaysAlive(today, inputDate) {
    const diffInMs = new Date(today) - new Date(inputDate);
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

function calculateCurrentAge(today, inputDate) {
    let age = today.getFullYear() - inputDate.getFullYear();
    const dobThisYear = new Date(today.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    if(today < dobThisYear) {
        age--;
    };
    return age;
};

function calculateTurtleAge(age) {
    return (age / 270).toFixed(2)*100 + "%";
};
