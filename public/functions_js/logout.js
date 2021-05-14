function logoutUser() {
    fetch("http://localhost:3000/users/logout")
        .then(res => res)
        .then(res => {
            document.cookie = `logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            setTimeout(() => { window.location.replace("http://localhost:3000") }, 50);
        })
        .catch((error) => console.log(error));
}