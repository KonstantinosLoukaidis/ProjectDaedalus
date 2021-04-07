$(document).ready(() => {
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
                    if (data.length == 0) {
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

});

submit_btn = document.querySelector(".submit-btn").addEventListener('click', () => { alert("New plan added to db") }); //This should be done with fetch() from server side to client side