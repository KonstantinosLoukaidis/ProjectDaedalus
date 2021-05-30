const login = document.getElementById('login');
const logged = document.getElementById('logged');
login.addEventListener('click', (event) => {
    window.history.pushState({}, "", '/users/login');
    document.getElementById('loginForm').style.display = 'block';
})


const modal = document.getElementById('loginForm');
window.onclick = function(event) {
    if (event.target == modal) {
        window.history.back();
        modal.style.display = "none";
    }
}

const cancelBtn = document.querySelector('.cancelbtn').addEventListener('click', (event) => {
    window.history.back();
    modal.style.display = "none";
})

function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    fetch(window.location.href + "/users/login", {
            method: 'POST',
            body: JSON.stringify({
                username: value.username,
                password: value.password,
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            modal.style.display = "none";
        })
        .catch((error) => {
            alert("The username or password is wrong");
            document.getElementById('enterpsw').value = "";
            console.error('Error:', error);
        });
}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

const x = document.getElementById('x').addEventListener('click', () => {
    window.history.back();
    modal.style.display = "none";
})