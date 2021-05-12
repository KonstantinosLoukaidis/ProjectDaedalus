document.querySelectorAll('.airline').forEach((item) => {
    item.addEventListener('keydown', async(e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            var info = e.target.value;
            fetch('http://localhost:3000/network_planning/retrieve_airlines?key=' + info)
                .then(req => req.json())
                .then(res => {
                    if (res.length == 0 && info === "") {
                        document.getElementById("airline_icao").value = "";
                        document.getElementById("airline_iata").value = "";
                        document.getElementById("airline_name").value = "";
                    } else {
                        document.getElementById("airline_icao").value = res[0].ICAO;
                        document.getElementById("airline_iata").value = res[0].IATA;
                        document.getElementById("airline_name").value = res[0].name;
                    }
                })
                .catch(err => document.getElementById("airline_name").value = "Couldn't find such airline");

        }
    });
});

document.querySelectorAll('.airport').forEach((item) => {
    item.addEventListener('keydown', async(e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            var info = e.target.value;
            fetch('http://localhost:3000/network_planning/retrieve_airports?key=' + info)
                .then(req => req.json())
                .then(res => {
                    if (res.length == 0 && info === "") {
                        document.getElementById("airport_icao").value = "";
                        document.getElementById("airport_iata").value = "";
                        document.getElementById("airport_name").value = "";
                    } else {
                        document.getElementById("airport_icao").value = res[0].icao;
                        document.getElementById("airport_iata").value = res[0].iata;
                        document.getElementById("airport_name").value = res[0].name;
                    }
                })
                .catch(err => document.getElementById("airport_name").value = "Couldn't find such aiport");

        }
    });
});


/*$(document).ready(() => {
    $('.airline').on('keydown', function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            var info = $(e.target).val();
            $.ajax({
                url: "http://localhost:3000/network_planning/retrieve_airlines?key=" + info,
                data: info,
                type: "GET",
                contentType: "application/json",
                success: (data) => {
                    console.log(data);
                       $('#airline_icao').val("");
                        $('#airline_iata').val("");
                        $('#airline').val("");
                    } else {
                        $('#airline_icao').val(data[0].ICAO);
                        $('#airline').val(data[0].name);
                        $('#airline_iata').val(data[0].IATA);
                    }
                },
                error: (xhr, status, err) => {
                    console.log(err);
                }
            });
        }
    });
    $('.airport').on('keydown', function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            var info = $(e.target).val();
            $.ajax({
                url: "http://localhost:3000/network_planning/retrieve_airports?key=" + info,
                data: info,
                type: "GET",
                contentType: "application/json",
                success: (data) => {
                    console.log(data);
                    if (data.length == 0) {
                        $('#airport_icao').val("");
                        $('#airport_iata').val("");
                        $('#airport').val("");
                    } else {
                        $('#airport_icao').val(data[0].icao);
                        $('#airport').val(data[0].name);
                        $('#airport_iata').val(data[0].iata);
                    }
                },
                error: (xhr, status, err) => {
                    console.log(err);
                }
            });
        }
    });

});*/