let url = "https://devmoh-user-pass-rest-bend.herokuapp.com"

function onLogIn() {
    let email = document.getElementById("logInEmailId").value;
    let password = document.getElementById("loginPassword").value;

    fetch(url + `/login`, {
        method: "POST",
        body: JSON.stringify({
             email, password
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            
            let alertDiv = document.createElement('alert');
            alertDiv.setAttribute("role","alert" );
            alertDiv.setAttribute("id","alertDiv" );
            if(data.message === "Login success"){
                alertDiv.setAttribute("class","alert alert-success" );
                alertDiv.innerHTML = "<strong> Login Success! </strong>" ;
                deleteAlert(alertDiv);
            }
            else if(data.message === "Password Incorrect"){
                alertDiv.setAttribute("class","alert alert-danger" );
                alertDiv.innerHTML = "<strong>Incorrect Password!</strong>" ;
                deleteAlert(alertDiv);
            }
            else {
                alertDiv.setAttribute("class","alert alert-danger" );
                alertDiv.innerHTML = "<strong>User is not registered!</strong>" ;
                deleteAlert(alertDiv);
            }
            document.getElementById("login-form").append(alertDiv);
        })
        return false;

}

function onSignUp() {
    let email = document.getElementById("signupEmailId").value;
    let password = document.getElementById("signUpPassword").value;
    let reEnterPassword = document.getElementById("confirmPassword").value;
    
    // Write password and repeat password matching logic
    let passwordMismatchDiv = document.getElementById("passwordMismatchDiv");
    if(password!== reEnterPassword) {
        passwordMismatchDiv.classList.remove("d-none");
        return;
    }
    // Add logic to complete signup
    passwordMismatchDiv.classList.add("d-none");

    fetch(url + `/register`, {
        method: "POST",
        body: JSON.stringify({
             email, password
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            
            let alertDiv = document.createElement('alert');
            alertDiv.setAttribute("role","alert" );
            alertDiv.setAttribute("id","alertDiv" );
            if(data.message === "User registered successfully"){
                alertDiv.setAttribute("class","alert alert-success" );
                alertDiv.innerHTML = "<strong> Success! </strong>" + data.message;
                deleteAlert(alertDiv);
            }
            if(data.message === "User already exists"){
                alertDiv.setAttribute("class","alert alert-danger" );
                alertDiv.innerHTML = "<strong>Failure!</strong>" + data.message;
                deleteAlert(alertDiv);
            }
            document.getElementById("sign-up-form").append(alertDiv);
            
            
        })
        return false;
}

function sendPasswordResetLink(){
    let email = document.getElementById("emailToResetPassword").value;
    fetch(url + `/reset-password`, {
        method: "PUT",
        body: JSON.stringify({
             email
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            let alertDiv = document.createElement('alert');
            alertDiv.setAttribute("role","alert" );
            alertDiv.setAttribute("id","alertDiv" );
            if(data.message === "Verification mail is sent"){
                alertDiv.setAttribute("class","alert alert-success" );
                alertDiv.innerHTML = "<strong> Success! </strong>" + data.message + "<p> Please check your email </p>";
                deleteAlert(alertDiv);
            }
            if(data.message === "User doesn't exist"){
                alertDiv.setAttribute("class","alert alert-danger" );
                alertDiv.innerHTML = "<strong>Failure!</strong>" + data.message;
                deleteAlert(alertDiv);
            }
            document.getElementById("login-space").append(alertDiv);
            
            
        })
        return false;
}

function changePassword() {
    let currentLocation = new URL(window.location.href);
    let objId = JSON.stringify(currentLocation).split("&rs=")[0].split("?id=")[1];

    let newPassword = document.getElementById('newPassword').value;
    let reconfirmedPassword = document.getElementById('reEnterPassword').value;
    if(newPassword!== reconfirmedPassword) {
        let alertDiv = document.createElement('alert');
        alertDiv.setAttribute("role","alert" );
        alertDiv.setAttribute("id","alertDiv" );
        alertDiv.setAttribute("class","alert alert-danger" );
        alertDiv.innerHTML = "<strong>Failure! </strong> + <br> + <p> Re-entered Password did not match! </p>";
        deleteAlert(alertDiv);
        document.getElementById('changePasswordDiv').append(alertDiv);
        return false;
    }

    fetch(url + `/change-password/` + objId, {
        method: "PUT",
        body: JSON.stringify({
             password: newPassword
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            let alertDiv = document.createElement('alert');
            alertDiv.setAttribute("role","alert" );
            alertDiv.setAttribute("id","alertDiv" );
            if(data.message === "Password Updated Successfully"){
                alertDiv.setAttribute("class","alert alert-success" );
                alertDiv.innerHTML = "<strong> Success! </strong>" + data.message;
                deleteAlert(alertDiv);
            }
            else {
                alertDiv.setAttribute("class","alert alert-danger" );
                alertDiv.innerHTML = "<strong>Failure!</strong>" + data.message;
                deleteAlert(alertDiv);
            }
            document.getElementById('changePasswordDiv').append(alertDiv);
        })
        return false;

}

function deleteAlert(alert){
    setTimeout(function(){
        alert.remove()
    }, 3000)
}
