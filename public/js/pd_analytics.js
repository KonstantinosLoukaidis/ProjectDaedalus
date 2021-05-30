var analyticsData = new Array()
var index = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var tableData = [];

document.querySelector('.aa').classList += " active"

document.addEventListener('DOMContentLoaded', () => {
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
                    var connectedAirports = [];
                    for (data of res) {
                        if (data.gate_dispatcher.network_plan != null) {
                            if (!connectedAirports.includes(data.gate_dispatcher.network_plan.airport)) {
                                connectedAirports.push(data.gate_dispatcher.network_plan.airport)
                            }
                        } else console.log(data)
                    }
                    for (data of res.slice(0, 6)) tableData.push(data)
                    resolve(connectedAirports)
                })
                .catch((err) => console.log(err))
        })
        .then((res) => {
            AirportsWorldWide(res);
            PaymentTable();
        })
})

function UpperCorner() {
    var earnings = document.getElementById('total_earnings');
    var taxes = document.getElementById('taxes');
    var flights = document.getElementById('total_flights');
    var passengers = document.getElementById('passengers_total');
    var earningsDiff = document.getElementById('total_earnings_diff');
    var taxesDiff = document.getElementById('taxes_diff');
    var flightsDiff = document.getElementById('total_flights_diff');
    var passengersDiff = document.getElementById('passengers_diff');

    earnings.innerHTML = analyticsData[0].totals.earnings + " €";
    taxes.innerHTML = analyticsData[0].totals.parking_fees + analyticsData[0].totals.landing_charges + " €";
    flights.innerHTML = analyticsData[0].totals.flights;
    passengers.innerHTML = analyticsData[0].totals.passengers;

    let today = new Date()
    earningsDiff.innerHTML = (((analyticsData[0].totals.earnings - analyticsData[0][months[today.getMonth() - 1]].earnings) / analyticsData[0].totals.earnings) * 100).toFixed(2) + "%"
    taxesDiff.innerHTML = (((analyticsData[0].totals.parking_fees + analyticsData[0].totals.landing_charges - analyticsData[0][months[today.getMonth() - 1]].parking_fees + analyticsData[0][months[today.getMonth() - 1]].landing_charges) / (analyticsData[0].totals.parking_fees + analyticsData[0].totals.landing_charges)) * 100).toFixed(2) + "%"
    flightsDiff.innerHTML = (((analyticsData[0].totals.flights - analyticsData[0][months[today.getMonth() - 1]].flights) / analyticsData[0].totals.flights) * 100).toFixed(2) + " %"
    passengersDiff.innerHTML = (((analyticsData[0].totals.passengers - analyticsData[0][months[today.getMonth() - 1]].passengers) / analyticsData[0].totals.passengers) * 100).toFixed(2) + " %"
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
                        stepSize: 1000
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
    piedata.push(analyticsData[0][index[0]].parking_fees);
    piedata.push(analyticsData[0][index[0]].landing_charges);
    piedata.push(analyticsData[0][index[0]].prm_charges);
    document.getElementById('park_fees').innerHTML = piedata[0] + " €"
    document.getElementById('land_c').innerHTML = piedata[1] + " €"
    document.getElementById('prm_c').innerHTML = piedata[2] + " €"
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
                    stacked: false,
                    ticks: {
                        stepSize: 50
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

function PaymentTable() {
    const table = document.querySelector('.paymentTable');
    for (data of tableData) {
        var new_tr = document.createElement('tr');
        var status = checkPayment(data.passed).split('/');
        new_tr.innerHTML = `
        <td>${data.gate_dispatcher.flight_number}</td>
        <td>${data.gate_dispatcher.network_plan.airline.name}</td>
        <td class="d-none d-xl-table-cell">01/01/2020</td>
        <td class="d-none d-xl-table-cell">31/06/2020</td>
        <td><span class="badge badge-success ${status[0]}">${status[1]}</span></td>
        <td class="d-none d-md-table-cell">${data.total_ammount} €</td>
        `
        new_tr.addEventListener('dblclick', (event) => {
            window.location.replace(window.location.href + `/${data._id}`)
        })
        table.appendChild(new_tr)
    }
}


function checkPayment(passed) {
    if (passed == true) return "S0/Paid"
    else return "S1/Pending"
}