const displayEvents = (data) => {
    const events = []
    data.forEach(item => {
        events.push({
            id: item.Id,
            title: `${item.VehicleName} - ${item.CustomerName} - ${item.EndLocation} - ${item.StartLocation}`,
            description: `Start Date:${item.StartDate} - End Date ${item.EndDate} `,
            start: item.StartDate,
            end: item.EndDate,
        });
    })
    return events;
}

export { displayEvents }