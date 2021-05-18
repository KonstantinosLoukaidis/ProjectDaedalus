document.addEventListener('DOMContentLoaded', (event) => {
    loadDaySlider();

    fetch(window.location.href + '/getArrivals?Monday')
        .then(req => req.json())
        .then(res => {
            console.log(res)
                // var data = res[0];
                // const createPagePromise = new Promise((res, rej) => {
                //         document.querySelector('.application-title').innerHTML += data._id.slice(-8).toUpperCase()
                //         document.getElementById('airline-logo').src = data.airline.logoLink;
                //         document.getElementById('airline-logo').alt = data.airline.name;
                //         document.getElementById('airline-name').innerHTML = data.airline.name;
                //         document.getElementById('airline-iata').innerHTML = `
                //         IATA: <strong>${data.airline.IATA}</strong> | ICAO: <strong>${data.airline.ICAO}</strong>`;
                //         document.querySelector('.plan-status').text = approvedToString[data.approved]
                //         document.querySelector('.plan-status').id = approvedToString[data.approved]
                //         document.querySelector('.skyvector-href').href = `https://skyvector.com/airport/${data.airport.icao}`;
                //         document.querySelector('.skyvector-href').innerHTML = `${data.airport.name} - ${data.airport.iata}`;
                //         document.getElementById('aircraft').innerHTML += ` ${data.aircraft.Manufacturer + data.aircraft.Model}`;
                //         document.getElementById('departure').innerHTML = `${data.ar_dep.departure_day} ${data.ar_dep.departure_time}`;
                //         document.getElementById('arrival').innerHTML = `${data.ar_dep.arrival_day} ${data.ar_dep.arrival_time}`;
                //         createMap(data.airport.name, data.airport.dd_latitude, data.airport.dd_longitude)
                //             for (i of application) i.style.display = "block"
                //         res()
                //     })
                //     .then(() => {
                //         forLoader.remove()
                //     })
        })
        .catch((err) => console.log(err))

})

function loadDaySlider() {
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    var input = document.getElementById('inputSlider'),
        output = document.getElementById('outputSlider');

    input.oninput = function() {
        output.innerHTML = days[this.value];
    };
    input.oninput();
}

function WeeksInDueDate(duedate, days) {
    let dates = new Array()
    let b = new Date()
    while (getWantedDate(days) < duedate) {
        b = getWantedDate(days)
        dates.push(b)
        days += 7
    }
    return dates
}