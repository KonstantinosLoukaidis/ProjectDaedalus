var analyticsData = new Array()
var index = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const forLoader = document.querySelector('.forLoader');
document.querySelector('.aa').classList += " active"

document.addEventListener('DOMContentLoaded', () => {
    var loader = document.createElement('div');
    loader.classList = `loader`;
    forLoader.appendChild(loader);
    loader.innerHTML = `<svg class="svg-calLoader" xmlns="http://www.w3.org/2000/svg" width="230" height="230"><path class="cal-loader__path" d="M86.429 40c63.616-20.04 101.511 25.08 107.265 61.93 6.487 41.54-18.593 76.99-50.6 87.643-59.46 19.791-101.262-23.577-107.142-62.616C29.398 83.441 59.945 48.343 86.43 40z" fill="none" stroke="#0099cc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 10 10 10 10 10 10 432" stroke-dashoffset="77"/><path class="cal-loader__plane" d="M141.493 37.93c-1.087-.927-2.942-2.002-4.32-2.501-2.259-.824-3.252-.955-9.293-1.172-4.017-.146-5.197-.23-5.47-.37-.766-.407-1.526-1.448-7.114-9.773-4.8-7.145-5.344-7.914-6.327-8.976-1.214-1.306-1.396-1.378-3.79-1.473-1.036-.04-2-.043-2.153-.002-.353.1-.87.586-1 .952-.139.399-.076.71.431 2.22.241.72 1.029 3.386 1.742 5.918 1.644 5.844 2.378 8.343 2.863 9.705.206.601.33 1.1.275 1.125-.24.097-10.56 1.066-11.014 1.032a3.532 3.532 0 0 1-1.002-.276l-.487-.246-2.044-2.613c-2.234-2.87-2.228-2.864-3.35-3.309-.717-.287-2.82-.386-3.276-.163-.457.237-.727.644-.737 1.152-.018.39.167.805 1.916 4.373 1.06 2.166 1.964 4.083 1.998 4.27.04.179.004.521-.076.75-.093.228-1.109 2.064-2.269 4.088-1.921 3.34-2.11 3.711-2.123 4.107-.008.25.061.557.168.725.328.512.72.644 1.966.676 1.32.029 2.352-.236 3.05-.762.222-.171 1.275-1.313 2.412-2.611 1.918-2.185 2.048-2.32 2.45-2.505.241-.111.601-.232.82-.271.267-.058 2.213.201 5.912.8 3.036.48 5.525.894 5.518.914 0 .026-.121.306-.27.638-.54 1.198-1.515 3.842-3.35 9.021-1.029 2.913-2.107 5.897-2.4 6.62-.703 1.748-.725 1.833-.594 2.286.137.46.45.833.872 1.012.41.177 3.823.24 4.37.085.852-.25 1.44-.688 2.312-1.724 1.166-1.39 3.169-3.948 6.771-8.661 5.8-7.583 6.561-8.49 7.387-8.702.233-.065 2.828-.056 5.784.011 5.827.138 6.64.09 8.62-.5 2.24-.67 4.035-1.65 5.517-3.016 1.136-1.054 1.135-1.014.207-1.962-.357-.38-.767-.777-.902-.893z" class="cal-loader__plane" fill="#000033"/></svg>`
    new Promise((resolve, rej) => {
            fetch(window.location.href + '/getAnalyticsData')
                .then((req) => req.json())
                .then((res) => {
                    analyticsData.push(res)
                    for (var x in res) {
                        index.push(x);
                    }
                    resolve()
                })
                .catch((err) => console.log(err))
        })
        .then((res) => {
            UpperCorner()
            MonthlyEarningsChart();
            PieChart();
            Calendar();
            BarChart();
        })
    new Promise((resolve, rej) => {
            fetch(window.location.href + '/getConnectedAirports')
                .then((req) => req.json())
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => console.log(err))
        })
        .then((res) => {
            AirportsWorldWide(res);
        })
    new Promise((resolve, rej) => {
            fetch(window.location.href + '/getPaymentTable')
                .then((req) => req.json())
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => console.log(err))
        })
        .then((res) => {
            PaymentTable(res)
            forLoader.remove()
            document.querySelector('.mainContent').style.display = 'block';

        })
})

function UpperCorner() {
    var earnings = document.getElementById('total_earnings');
    var montlhy_earnings = document.getElementById('total_earnings_monthly');
    var flights = document.getElementById('total_flights');
    var passengers = document.getElementById('passengers_total');
    var earningsDiff = document.getElementById('total_earnings_diff');
    // var taxesDiff = document.getElementById('taxes_diff');
    var flightsDiff = document.getElementById('total_flights_diff');
    var passengersDiff = document.getElementById('passengers_diff');

    let today = new Date()

    earnings.innerHTML = beautifyNum(analyticsData[0].totals.earnings, true) + "€";
    montlhy_earnings.innerHTML = beautifyNum(analyticsData[0][months[today.getMonth()]].earnings, true) + "€";
    flights.innerHTML = beautifyNum(analyticsData[0].totals.flights, false);
    passengers.innerHTML = beautifyNum(analyticsData[0].totals.passengers, false);

    earningsDiff.innerHTML = ((analyticsData[0][months[today.getMonth()]].earnings - analyticsData[0][months[today.getMonth() - 1]].earnings) / analyticsData[0][months[today.getMonth() - 1]].earnings * 100).toFixed(2) + "%"
        // taxesDiff.innerHTML = (((analyticsData[0].totals.parking_fees + analyticsData[0].totals.landing_charges - analyticsData[0][months[today.getMonth() - 1]].parking_fees + analyticsData[0][months[today.getMonth() - 1]].landing_charges) / (analyticsData[0].totals.parking_fees + analyticsData[0].totals.landing_charges)) * 100).toFixed(2) + "%"
    flightsDiff.innerHTML = (((analyticsData[0][months[today.getMonth()]].flights - analyticsData[0][months[today.getMonth() - 1]].flights) / analyticsData[0][months[today.getMonth() - 1]].flights) * 100).toFixed(2) + "%"
    passengersDiff.innerHTML = (((analyticsData[0][months[today.getMonth()]].passengers - analyticsData[0][months[today.getMonth() - 1]].passengers) / analyticsData[0][months[today.getMonth() - 1]].flights) * 100).toFixed(2) + "%"
}

function beautifyNum(num, dec) {
    num = String(num.toFixed(2))
    total = num.split('.')
    num = total[0]
    var newnum = ""
        //console.log(Math.floor(num.length/3))
    for (var i = num.length - 3; i > 0; i = i - 3) {
        newnum = "," + num.slice(i, i + 3) + newnum
    }
    newnum = num.slice(0, Math.abs(3 + i)) + newnum
    if (dec) return newnum + "." + total[1].slice(0, 2)
    else return newnum
}

function MonthlyEarningsChart() {
    var ctx = document.getElementById('chartjs-dashboard-line').getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 225);
    gradient.addColorStop(0, 'rgba(215, 227, 244, 1)');
    gradient.addColorStop(1, 'rgba(215, 227, 244, 0)');
    // Line chart
    var data = new Array();
    for (i = 1; i < 13; i++) data.push(analyticsData[0][index[i]].earnings)
    new Chart(document.getElementById("chartjs-dashboard-line"), {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Earnings (€)",
                fill: true,
                backgroundColor: gradient,
                borderColor: window.theme.primary,
                data: data
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                intersect: false
            },
            hover: {
                intersect: true
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            scales: {
                xAxes: [{
                    reverse: true,
                    gridLines: {
                        color: "rgba(0,0,0,0.0)"
                    }
                }],
                yAxes: [{
                    ticks: {
                        stepSize: 100000
                    },
                    display: true,
                    borderDash: [3, 3],
                    gridLines: {
                        color: "rgba(0,0,0,0.0)"
                    }
                }]
            }
        }
    });
};

function PieChart() {
    // Pie chart
    var piedata = new Array();
    piedata.push(analyticsData[0].totals.parking_fees);
    piedata.push(analyticsData[0].totals.landing_charges);
    piedata.push(analyticsData[0].totals.prm_charges);
    document.getElementById('park_fees').innerHTML = beautifyNum(piedata[0], true) + " €"
    document.getElementById('land_c').innerHTML = beautifyNum(piedata[1], true) + " €"
    document.getElementById('prm_c').innerHTML = beautifyNum(piedata[2], true) + " €"
    new Chart(document.getElementById("chartjs-dashboard-pie"), {
        type: 'pie',
        data: {
            labels: ["Parking Fees", "Landing Charges", "PRM charge"],
            datasets: [{
                data: piedata,
                backgroundColor: [
                    window.theme.primary,
                    window.theme.warning,
                    window.theme.danger
                ],
                borderWidth: 5
            }]
        },
        options: {
            responsive: !window.MSInputMethodContext,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            cutoutPercentage: 75
        }
    });
};

function BarChart() {
    // Bar chart
    var data = new Array();
    for (i = 1; i < 13; i++) data.push(analyticsData[0][index[i]].passengers)
    new Chart(document.getElementById("chartjs-dashboard-bar"), {
        type: 'bar',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "2021",
                backgroundColor: window.theme.primary,
                borderColor: window.theme.primary,
                hoverBackgroundColor: window.theme.primary,
                hoverBorderColor: window.theme.primary,
                data: data,
                barPercentage: .75,
                categoryPercentage: .5
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    stacked: true,
                    ticks: {
                        stepSize: 100
                    }
                }],
                xAxes: [{
                    stacked: false,
                    gridLines: {
                        color: "transparent"
                    }
                }]
            }
        }
    });
};

function AirportsWorldWide(airports) {
    var markers = new Array()
    for (airport of airports) {
        markers.push({
            latLng: [airport.dd_latitude, airport.dd_longitude],
            name: airport.name
        })
    }
    $("#world_map").vectorMap({
        map: "world_mill",
        normalizeFunction: "polynomial",
        hoverOpacity: .7,
        hoverColor: false,
        regionStyle: {
            initial: {
                fill: "#e3eaef"
            }
        },
        markerStyle: {
            initial: {
                "r": 9,
                "fill": window.theme.primary,
                "fill-opacity": .95,
                "stroke": "#fff",
                "stroke-width": 7,
                "stroke-opacity": .4
            },
            hover: {
                "stroke": "#fff",
                "fill-opacity": 1,
                "stroke-width": 1.5
            }
        },
        backgroundColor: "transparent",
        zoomOnScroll: false,
        markers: markers
    });
    setTimeout(function() {
        $(window).trigger('resize');
    }, 250)
};

function Calendar() {
    $('#datetimepicker-dashboard').datetimepicker({
        inline: true,
        sideBySide: false,
        format: 'L'
    });
};

function PaymentTable(tableData) {
    const table = document.querySelector('.paymentTable');
    var id = 0;
    var today = new Date()
    document.getElementById('payment_day').innerHTML = `${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()} ${"20"+("0" + today.getYear()).slice(-2)}`
    if (tableData.length == 0) {
        var null_msg = document.createElement('h1');
        null_msg.innerText = 'No flights today';
        document.querySelector('.payment_title').appendChild(null_msg)
    } else {
        for (data of tableData) {
            var new_tr = document.createElement('tr');
            new_tr.id = id++;
            var status = checkPayment(data.passed).split('/');
            var paymentstart = new Date(data.flight_arrival);
            var paymentend = new Date(data.flight_arrival);
            paymentend.setDate(paymentend.getDate() + 15)
            new_tr.innerHTML = `
            <td>${data.gate_dispatcher.flight_number}</td>
            <td>${data.gate_dispatcher.network_plan.airline.name}</td>
            <td class="d-none d-xl-table-cell">${("0" + paymentstart.getDate()).slice(-2)+"/"+("0" + (paymentstart.getMonth()+1)).slice(-2)+"/"+"20"+("0" + paymentstart.getYear()).slice(-2)}</td>
            <td class="d-none d-xl-table-cell">${("0" + paymentend.getDate()).slice(-2)+"/"+("0" + (paymentend.getMonth()+1)).slice(-2)+"/"+"20"+("0" + paymentend.getYear()).slice(-2)}</td>
            <td><span class="badge badge-success ${status[0]}">${status[1]}</span></td>
            <td class="d-none d-md-table-cell">${beautifyNum(data.total_ammount,true)} €</td>
            `
            new_tr.addEventListener('dblclick', (event) => {
                window.location.replace(window.location.href + `/${tableData[event.target.parentElement.id]._id}`)
            })
            table.appendChild(new_tr)
        }
    }
}


function checkPayment(passed) {
    if (passed == true) return "S0/Paid"
    else return "S1/Pending"
}