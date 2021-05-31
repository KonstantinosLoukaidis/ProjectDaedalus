let add_more = document.querySelector('.bi').addEventListener('click', () => {
    let add_arrival = document.querySelector('.arrival_add');
    let add_dep = document.querySelector('.dep_add');
    let new_arrival = document.createElement('li');
    let new_dep = document.createElement('li');
    new_arrival.innerHTML = '<select class="w3-select w3-border" id="arr_day" name="arr_day"><option value="Monday">Monday</option><option value="Tuesday">Tuesday</option> <option value="Wednesday">Wednesday</option> <option value="Thursday">Thursday</option> <option value="Friday">Friday</option><option value="Saturday">Saturday</option> <option value="Sunday">Sunday</option></select><label for="arr_day"> Arrival at:</label><input type="time" id="arr_time" value="00:00" name="arrival_time"><small>time must be in GMT-2</small>';
    new_dep.innerHTML = '<select class="w3-select w3-border" id="dep_day" name="dep_day"><option value="Monday">Monday</option><option value="Tuesday">Tuesday</option> <option value="Wednesday">Wednesday</option> <option value="Thursday">Thursday</option> <option value="Friday">Friday</option><option value="Saturday">Saturday</option> <option value="Sunday">Sunday</option></select><label for="dep_day"> Arrival at:</label><input type="time" id="dep_time" value="00:00" name="dep_time"><small>time must be in GMT-2</small>';
    add_arrival.appendChild(new_arrival);
    add_dep.appendChild(new_dep);

});

let ac_selected = document.querySelector('.ac_man').addEventListener('click', (e) => {
    if (e.target.value != 'none') {
        let ac_model_select = document.querySelector('.ac_model').style.visibility = 'visible';
        ac_models(e.target.value);
    } else {
        let ac_model_select = document.querySelector('.ac_model').style.visibility = 'hidden';
    }
})

document.addEventListener('DOMContentLoaded', (event) => {
    fetch(window.location.href + '/ac_man_find')
        .then(req => req.json())
        .then(res => {
            let ac_selected = document.querySelector('.ac_man');
            for (manufacturer of res) {
                let mans = document.createElement('option');
                mans.value = manufacturer._id;
                mans.innerHTML = manufacturer._id;
                ac_selected.appendChild(mans);
            }
        })
        .catch(err => console.log(err));
});

function ac_models(manufacturer) {
    fetch(window.location.href + '/ac_model_find?key=' + manufacturer)
        .then(req => req.json())
        .then(res => {
            let ac_selected = document.querySelector('.ac_model');
            for (model of res) {
                let models = document.createElement('option');
                models.value = model.Model;
                models.innerHTML = model.Model;
                ac_selected.appendChild(models);
            }
        })
        .catch(err => console.log(err));
}

document.getElementById('form').classList = 'active'