document.addEventListener('DOMContentLoaded', (event) => {
    const forLoader = document.querySelector('.forLoader');
    var loader = document.createElement('div');
    loader.innerHTML = `<svg class="svg-calLoader" xmlns="http://www.w3.org/2000/svg" width="230" height="230"><path class="cal-loader__path" d="M86.429 40c63.616-20.04 101.511 25.08 107.265 61.93 6.487 41.54-18.593 76.99-50.6 87.643-59.46 19.791-101.262-23.577-107.142-62.616C29.398 83.441 59.945 48.343 86.43 40z" fill="none" stroke="#0099cc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 10 10 10 10 10 10 432" stroke-dashoffset="77"/><path class="cal-loader__plane" d="M141.493 37.93c-1.087-.927-2.942-2.002-4.32-2.501-2.259-.824-3.252-.955-9.293-1.172-4.017-.146-5.197-.23-5.47-.37-.766-.407-1.526-1.448-7.114-9.773-4.8-7.145-5.344-7.914-6.327-8.976-1.214-1.306-1.396-1.378-3.79-1.473-1.036-.04-2-.043-2.153-.002-.353.1-.87.586-1 .952-.139.399-.076.71.431 2.22.241.72 1.029 3.386 1.742 5.918 1.644 5.844 2.378 8.343 2.863 9.705.206.601.33 1.1.275 1.125-.24.097-10.56 1.066-11.014 1.032a3.532 3.532 0 0 1-1.002-.276l-.487-.246-2.044-2.613c-2.234-2.87-2.228-2.864-3.35-3.309-.717-.287-2.82-.386-3.276-.163-.457.237-.727.644-.737 1.152-.018.39.167.805 1.916 4.373 1.06 2.166 1.964 4.083 1.998 4.27.04.179.004.521-.076.75-.093.228-1.109 2.064-2.269 4.088-1.921 3.34-2.11 3.711-2.123 4.107-.008.25.061.557.168.725.328.512.72.644 1.966.676 1.32.029 2.352-.236 3.05-.762.222-.171 1.275-1.313 2.412-2.611 1.918-2.185 2.048-2.32 2.45-2.505.241-.111.601-.232.82-.271.267-.058 2.213.201 5.912.8 3.036.48 5.525.894 5.518.914 0 .026-.121.306-.27.638-.54 1.198-1.515 3.842-3.35 9.021-1.029 2.913-2.107 5.897-2.4 6.62-.703 1.748-.725 1.833-.594 2.286.137.46.45.833.872 1.012.41.177 3.823.24 4.37.085.852-.25 1.44-.688 2.312-1.724 1.166-1.39 3.169-3.948 6.771-8.661 5.8-7.583 6.561-8.49 7.387-8.702.233-.065 2.828-.056 5.784.011 5.827.138 6.64.09 8.62-.5 2.24-.67 4.035-1.65 5.517-3.016 1.136-1.054 1.135-1.014.207-1.962-.357-.38-.767-.777-.902-.893z" class="cal-loader__plane" fill="#000033"/></svg>`
    forLoader.appendChild(loader)
    fetch(window.location.href + '/getInvoiceData')
        .then((req) => req.json())
        .then((res) => {
            var data = res[0];
            var airline = data.gate_dispatcher.network_plan.airline;
            var airport = data.gate_dispatcher.network_plan.airport;
            var aircraft = data.gate_dispatcher.network_plan.aircraft;
            var arr_date = new Date(data.flight_arrival)
            var dep_date = new Date(data.flight_departure)
            var exp_date = new Date(data.expected_arrival)
            var timeDiffinHours = Math.ceil((dep_date.getTime() - arr_date.getTime()) / (1000 * 60 * 60))
            var MTOW = aircraft.MTOW.split(',').slice(0, 2).join('.')
            document.getElementById('airline-name').innerText = airline.name;
            document.getElementById('total-ammount').innerText = data.total_ammount + "€"
            document.getElementById('total-ammount2').innerText = data.total_ammount + "€"
            document.getElementById('payment-date').innerText = arr_date.toLocaleString()
            document.getElementById('inv_num').innerText = generateInvNo(data._id)
            document.querySelector('.client').innerHTML = `
            <strong>
                ${airline.name}
            </strong>
            <p>
                ICAO: ${airline.ICAO} <br> IATA: ${airline.IATA} <br> Flight: ${data.gate_dispatcher.flight_number} <br> ATH --> ${airport.iata} <br> Aircraft: ${aircraft.Manufacturer +" "+aircraft.Model}
            </p>`
            document.getElementById('flight_number1').innerText = data.gate_dispatcher.flight_number;
            document.getElementById('arrival-date1').innerText = exp_date.toLocaleString();
            document.getElementById('departure-date1').innerText = dep_date.toLocaleString();
            document.getElementById('airport-iaco1').innerText = airport.icao;
            document.getElementById('airbus_passengers1').innerHTML = `${aircraft.Manufacturer+" "+aircraft.Model} aircraft carrying ${data.passengers} passengers`
            document.getElementById('raw_mtow').innerText = MTOW + " tons"
            document.getElementById('landing_charge').innerText = data.landing_charge + " €"
            document.querySelector(".mtowmsg").innerHTML = getMTOWMsg(Number(MTOW))
            document.getElementById('hours_parking').innerText = timeDiffinHours + " hrs"
            document.getElementById('parking_charge').innerText = data.parking_charge + " €"
            document.querySelector(".mtowmsg2").innerHTML = getTimeMTOWMsg(Number(MTOW))
            document.getElementById('total_passengers').innerText = data.passengers + " passengers";
            document.getElementById('prm_charges').innerText = data.passengers_charges + " €";
            document.getElementById('landing_surcharges').innerText = surcharges(data.landing_surcharges);
            document.getElementById('parking_surcharges').innerText = surcharges(data.parking_surcharges);
            forLoader.removeChild(loader)
            document.querySelector('.invoiceCard').style.display = "block"
        })
})

function surcharges(sur) {
    if (sur > 0) return "+" + sur * 100 + "%"
    else if (sur == 0) return sur * 100 + "%"
    else return "-" + sur * 100 + "%"
}

function getMTOWMsg(MTOW) {
    let mtowmsg = [];
    if (MTOW <= 10) mtowmsg = ["W≤10", 11.5, ""]
    else if (MTOW > 10 && MTOW <= 25) mtowmsg = ["10&lt;W≤25", "11,50", "25 tons and 1.1455"]
    else if (MTOW > 25 && MTOW <= 50) mtowmsg = ["25&lt;W≤50", "28,67", "25 tons and 1,438"]
    else if (MTOW > 50 && MTOW <= 65) mtowmsg = ["50&lt;W≤65", "64,62", "50 tons and 1,6141"]
    else if (MTOW > 65 && MTOW <= 80) mtowmsg = ["65&lt;W≤80", "88,83", "65 tons and 1,6434"]
    else if (MTOW > 80 && MTOW <= 150) mtowmsg = ["80&lt;W≤150", "113,48", "80 tons and 1,6141"]
    else if (MTOW > 150 && MTOW <= 300) mtowmsg = ["150&lt;W≤300", "226,47", "150 tons and 1,6434"]
    else mtowmsg = ["W&gt;300", "472,99", "300 tons and  1,2913"]
    return `M.T.O.W. (tons) ${mtowmsg[0]}<br>Charges (Eur.) ${mtowmsg[1]}<br>For the first ${mtowmsg[2]}€ per additional ton or fraction thereof`
}

function getTimeMTOWMsg(MTOW) {
    let parkingmsg = [];
    if (MTOW <= 10) parkingmsg = ["10&lt;W", "", "0,0344"]
    else if (MTOW > 10 && MTOW <= 50) parkingmsg = ["10&lt;W≤50", "W x T x", "0,0275"]
    else if (MTOW > 50 && MTOW <= 100) parkingmsg = ["50&lt;W≤100", "W x T x", "0,0344"]
    else if (MTOW > 100 && MTOW <= 200) parkingmsg = ["100&lt;W≤200", "W x T x", "0,0412"]
    else parkingmsg = ["&gt;200", "W x T x", "0,0481"]
    return `M.T.O.W. (tons) ${parkingmsg[0]}<br>Charges (Eur.) ${parkingmsg[1]} ${parkingmsg[2]}€ per hour of layover`
}

function generateInvNo(id) {
    var invno = "";
    for (let i = 0, counter = 0; i < id.length; i++) {
        if (id.slice(-(i + 1), -i).match(/[0-9]/i) != null) {
            invno += id.slice(-(i + 1), -i)
            counter++;
        }
        if (counter == 7) break
    }
    return invno
}