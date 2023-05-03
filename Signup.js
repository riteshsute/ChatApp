function signUpUser(event) {
    event.preventDefault();
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const phonenumber = event.target.phonenumber.value;

    const obj = {
        name,
        email,
        password,
        phonenumber
    };
    console.log(obj);

    axios.post("http://localhost:7000/expense/signup", obj)
    .then((response) => {
        alert(response.data.message);
        window.location.href = "../views/Login.html"
    })
    .catch((error) => {
        console.log(error);
    });
}
