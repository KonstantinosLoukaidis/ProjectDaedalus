const tableArrivalData = { "0": [], "1": [], "2": [], "3": [], "4": [], "5": [], "6": [] }
const tableDepartureData = { "0": [], "1": [], "2": [], "3": [], "4": [], "5": [], "6": [] }
const arrivals_html = document.querySelector('.arrivals')
const departures_html = document.querySelector('.departures')
const daysParser = Object({
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 0
})
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getrawDate(wanted_days) {
    const wanted_date = new Date(Date.now());
    wanted_date.setDate(wanted_date.getDate() + wanted_days);
    return wanted_date
}

function getTableDates() {
    var returnDays = new Array()
    for (let i = -1; i < 3; i++) {
        let a = getrawDate(i)
        returnDays.push(days[a.getDay()] + " " + ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + ("0" + (a.getYear())).slice(-2))
    }
    return returnDays
}

const ArLoader = document.querySelector('.forArLoader');
const DepLoader = document.querySelector('.forDepLoader');

document.addEventListener('DOMContentLoaded', (event) => {
    var loader1 = document.createElement('div');
    loader1.innerHTML = `<svg class="svg-calLoader" xmlns="http://www.w3.org/2000/svg" width="230" height="230"><path class="cal-loader__path" d="M86.429 40c63.616-20.04 101.511 25.08 107.265 61.93 6.487 41.54-18.593 76.99-50.6 87.643-59.46 19.791-101.262-23.577-107.142-62.616C29.398 83.441 59.945 48.343 86.43 40z" fill="none" stroke="#0099cc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 10 10 10 10 10 10 432" stroke-dashoffset="77"/><path class="cal-loader__plane" d="M141.493 37.93c-1.087-.927-2.942-2.002-4.32-2.501-2.259-.824-3.252-.955-9.293-1.172-4.017-.146-5.197-.23-5.47-.37-.766-.407-1.526-1.448-7.114-9.773-4.8-7.145-5.344-7.914-6.327-8.976-1.214-1.306-1.396-1.378-3.79-1.473-1.036-.04-2-.043-2.153-.002-.353.1-.87.586-1 .952-.139.399-.076.71.431 2.22.241.72 1.029 3.386 1.742 5.918 1.644 5.844 2.378 8.343 2.863 9.705.206.601.33 1.1.275 1.125-.24.097-10.56 1.066-11.014 1.032a3.532 3.532 0 0 1-1.002-.276l-.487-.246-2.044-2.613c-2.234-2.87-2.228-2.864-3.35-3.309-.717-.287-2.82-.386-3.276-.163-.457.237-.727.644-.737 1.152-.018.39.167.805 1.916 4.373 1.06 2.166 1.964 4.083 1.998 4.27.04.179.004.521-.076.75-.093.228-1.109 2.064-2.269 4.088-1.921 3.34-2.11 3.711-2.123 4.107-.008.25.061.557.168.725.328.512.72.644 1.966.676 1.32.029 2.352-.236 3.05-.762.222-.171 1.275-1.313 2.412-2.611 1.918-2.185 2.048-2.32 2.45-2.505.241-.111.601-.232.82-.271.267-.058 2.213.201 5.912.8 3.036.48 5.525.894 5.518.914 0 .026-.121.306-.27.638-.54 1.198-1.515 3.842-3.35 9.021-1.029 2.913-2.107 5.897-2.4 6.62-.703 1.748-.725 1.833-.594 2.286.137.46.45.833.872 1.012.41.177 3.823.24 4.37.085.852-.25 1.44-.688 2.312-1.724 1.166-1.39 3.169-3.948 6.771-8.661 5.8-7.583 6.561-8.49 7.387-8.702.233-.065 2.828-.056 5.784.011 5.827.138 6.64.09 8.62-.5 2.24-.67 4.035-1.65 5.517-3.016 1.136-1.054 1.135-1.014.207-1.962-.357-.38-.767-.777-.902-.893z" class="cal-loader__plane" fill="#000033"/></svg>`
    var loader2 = loader1.cloneNode(true)
    loader1.classList = `loader`;
    loader2.classList = `loader`;
    ArLoader.appendChild(loader1);
    DepLoader.appendChild(loader2)
    fetch(window.location.href + '/getArrivals')
        .then((req) => req.json())
        .then((res) => {
            if (res != null) {
                console.log(res)
                for (flight of res) {
                    let tz = (new Date()).getTimezoneOffset() * 60000;
                    tz = Math.abs(tz)
                    let temp_date = new Date((new Date(flight.flight_arrival)) - tz)
                    let temp_expected = new Date((new Date(flight.expected_arrival)) - tz)
                    let flightStatus = flightStatusArrival(temp_date, temp_expected).split('/');
                    tableArrivalData[`${temp_date.getDay()}`].push(`
                    <td>
                    <img src="https://www.countryflags.io/${flight.gate_dispatcher.network_plan.airport.CountryCode}/flat/64.png"> <br> ${flight.gate_dispatcher.network_plan.airport.name} (${flight.gate_dispatcher.network_plan.airport.iata})
                    </td>
                    <td><img src=${flight.gate_dispatcher.network_plan.airline.logoLink} width="120em">
                        <br> ${flight.gate_dispatcher.network_plan.airline.name}
                    </td>
                    <td>${flight.gate_dispatcher.flight_number}</td>
                    <td>${("0" + temp_expected.getDate()).slice(-2)+"/"+("0" + (temp_expected.getMonth()+1)).slice(-2)+"/"+("0" + temp_expected.getYear()).slice(-2)+" "+("0" + temp_expected.getHours()).slice(-2)+":"+("0" + temp_expected.getMinutes()).slice(-2)}</td>
                    <td>${("0" + temp_date.getDate()).slice(-2)+"/"+("0" + (temp_date.getMonth()+1)).slice(-2)+"/"+("0" + temp_date.getYear()).slice(-2)+" "+("0" + temp_date.getHours()).slice(-2)+":"+("0" + temp_date.getMinutes()).slice(-2)}</td>
                    <td><span class="badge badge-success ${flightStatus[0]}">${flightStatus[1]}</span></td>
                    <td>${flight.gate_dispatcher.gate.Name}</td>`)
                }
            }
            ArLoader.removeChild(loader1)
            document.querySelector('.Arrival_card').style.display = "block"
            loadDaySlider();
        })
        .catch((err) => console.log(err))
    fetch(window.location.href + '/getDepartures')
        .then((req) => req.json())
        .then((res) => {
            if (res != null) {
                for (flight of res) {
                    let tz = (new Date()).getTimezoneOffset() * 60000;
                    tz = Math.abs(tz)
                    let temp_date = new Date((new Date(flight.flight_departure)) - tz)
                    let flightStatus = flightStatusDeparture(temp_date).split('/');
                    tableDepartureData[`${temp_date.getDay()}`].push(`
                    <td>
                        <img src="https://www.countryflags.io/${flight.gate_dispatcher.network_plan.airport.CountryCode}/flat/64.png"> <br> ${flight.gate_dispatcher.network_plan.airport.name} (${flight.gate_dispatcher.network_plan.airport.iata})
                    </td>
                    <td><img src=${flight.gate_dispatcher.network_plan.airline.logoLink} width="120em">
                        <br> ${flight.gate_dispatcher.network_plan.airline.name}
                    </td>
                    <td>${flight.gate_dispatcher.flight_number}</td>
                    <td>${("0" + temp_date.getDate()).slice(-2)+"/"+("0" + (temp_date.getMonth()+1)).slice(-2)+"/"+("0" + temp_date.getYear()).slice(-2)+" "+("0" + temp_date.getHours()).slice(-2)+":"+("0" + temp_date.getMinutes()).slice(-2)}</td>
                    <td>${("0" + temp_date.getDate()).slice(-2)+"/"+("0" + (temp_date.getMonth()+1)).slice(-2)+"/"+("0" + temp_date.getYear()).slice(-2)+" "+("0" + temp_date.getHours()).slice(-2)+":"+("0" + temp_date.getMinutes()).slice(-2)}</td>
                    <td><span class="badge badge-success ${flightStatus[0]}">${flightStatus[1]}</span></td>
                    <td>${flight.gate_dispatcher.gate.Name}</td>`)
                }
            }
            DepLoader.removeChild(loader2)
            document.querySelector('.Departure_card').style.display = "block"
            loadDaySlider();
        })
        .catch((err) => console.log(err))

})

function loadDaySlider() {
    var sliderDays = getTableDates();

    var input = document.getElementById('inputSlider'),
        output = document.getElementById('outputSlider');

    input.oninput = function() {
        output.innerHTML = sliderDays[this.value];
        var aTableRows = arrivals_html.getElementsByTagName('tr');
        var dTableRows = departures_html.getElementsByTagName('tr')
        var Arowcount = aTableRows.length
        var Drowcount = dTableRows.length
        for (var x = Arowcount - 1; x >= 0; x--) {
            arrivals_html.removeChild(aTableRows[x])
        }
        for (var x = Drowcount - 1; x >= 0; x--) {
            departures_html.removeChild(dTableRows[x])
        }
        for (item of tableArrivalData[daysParser[sliderDays[this.value].split(" ")[0]]]) {
            let new_tr = document.createElement('tr');
            new_tr.innerHTML = item;
            arrivals_html.appendChild(new_tr)
        }
        for (item of tableDepartureData[daysParser[sliderDays[this.value].split(" ")[0]]]) {
            let new_tr = document.createElement('tr')
            new_tr.innerHTML = item;
            departures_html.appendChild(new_tr)
        }
    };
    input.oninput();
}

function flightStatusArrival(time, expected) {
    let today = new Date()
    let timeDif = (time.getTime() - today.getTime()) / (1000 * 60)
    let expectedDif = (expected.getTime() - time.getTime()) / (1000 * 60)
    if (timeDif < 0 && expectedDif >= 15) return "S0/Flight Arrived Delayed"
    else if (timeDif < 0) return "S0/Flight Arrived"
    else if (timeDif >= 0 && timeDif <= 120) return "S1/Flight Arriving"
    else if (timeDif > 120) return "S2/No status yet"
}

function flightStatusDeparture(time) {
    let today = new Date()
    let timeDif = (time.getTime() - today.getTime()) / (1000 * 60)
    if (timeDif < 0) return "S0/Flight Departed"
    else if (timeDif > 0 && timeDif <= 30) return "S1/Boarding"
    else if (timeDif > 30 && timeDif <= 60) return "S1/Opening gate"
    else if (timeDif > 60) return "S2/No status yet"
}