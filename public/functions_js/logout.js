function logoutUser() {
    fetch("/users/logout")
        .then(res => res)
        .then(res => {
            setTimeout(() => { window.location.replace("/") }, 50);
        })
        .catch((error) => console.log(error));
}