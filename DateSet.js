const getDayEndDate = (date) => {
    date.setHours(0, 0, 0, 0);

    date.setHours(date.getHours() + 23, date.getMinutes() + 59);

    return date;
};

const getDayStartDate = (date) => {
    date.setHours(0, 0, 0, 0);

    return date;
};

export {getDayEndDate, getDayStartDate};