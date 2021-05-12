const login = document.getElementById('login');
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
    fetch("http://localhost:3000/users/login", {
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
            window.history.back();
            modal.style.display = "none";
            document.cookie = "logged=loggedIn; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";
            togglelog();
        })
        .catch((error) => {
            alert("The username or password is wrong");
            document.getElementById('enterpsw').value = "";
            console.error('Error:', error);
        });
}

const logout = document.getElementById('logout');
const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

logout.addEventListener('click', logoutUser);

function logoutUser(event) {
    fetch("http://localhost:3000/users/logout")
        .then(res => res)
        .then(res => {
            document.cookie = "logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            togglelog();
        })
        .catch((error) => console.log(error));
}

window.onload = togglelog();

function togglelog() {
    if (document.cookie == 'logged=loggedIn') {
        logout.style.display = "block";
        login.style.display = "none";
    } else {
        logout.style.display = "none";
        login.style.display = "block";
    }
}

const x = document.getElementById('x').addEventListener('click', () => {
    document.cookie = 'logged';
})