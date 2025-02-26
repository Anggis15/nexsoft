
document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const loginForm = document.getElementById('loginForm');
    const passwordFields = document.getElementById('passwordFields');
    const actionBtn = document.querySelector('.action-btn');
    const textLogin = document.getElementById('text-login')

    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        passwordFields.style.display = 'block'; 
        actionBtn.textContent = 'Login'; 
        forgotPasswordLink.style.display = 'none'; 
        textLogin.style.display = 'none';
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const uri = "/api/login"
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;
        let message = validatePasswordFields(userId,password,null,null)
        if(message){
            showError(message)
        }
        let data = {userId,password}
        

        let dataResponse = fetch(uri, {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json',  
                                },
                                body: JSON.stringify(data)
                            }).then(response => {
                            if (response.ok) {
                                window.location.href = "/dashboard";
                                
                            }else{
                                showError("Userid atau password salah!!!")
                            }
                            })
                            .then(data => {
                                return data.json()
                            })
                            .catch(error => {
                                showError("Userid atau password salah!!!")
                            });
    });

    document.getElementById('resetButton').addEventListener('click', function(event) {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let message = validatePasswordFields(userId,currentPassword,newPassword,confirmPassword)
        if (message){
            showError(message)
            passwordFields.style.display = 'none';
            loginForm.style.display = 'block';
            forgotPasswordLink.style.display = 'block';
            textLogin.style.display = '';
        }
        let uri = `/nexdist/userchangepassword?action=save&userID=${encodeURIComponent(userID)}&password=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`
        let responseData = fetch(uri).then(response => {
            if (!response.ok) {
                showError("Gagal mereset password")
            }
            })
            .then(data => {
                return data.json()
            })
            .catch(error => {
                showError("Gagal mereset password")
            });
        alert('Password reset successfully!');
            passwordFields.style.display = 'none';
            loginForm.style.display = 'block';
            forgotPasswordLink.style.display = 'block';
            textLogin.style.display = '';
    });

    

    
    actionBtn.addEventListener('click', function() {
        if (actionBtn.textContent === 'Login') {
            passwordFields.style.display = 'none';
            loginForm.style.display = 'block';
            forgotPasswordLink.style.display = 'block';
            
        }
    });
});



function validatePasswordFields(userID, currentPassword, newPassword, confirmPassword) {
    let messages = [];

    if (!userID)
        messages.push("Harap isi user ID");
    if (!currentPassword)
        messages.push("Harap isi password saat ini");
    if (!checkRegex(newPassword, /^.{8,}$/))
        messages.push("Kata sandi setidaknya memiliki 8 karakter");
    if (!checkRegex(newPassword, /^(?=.*?[A-Z])/))
        messages.push("Kata sandi setidaknya memiliki 1 huruf besar");
    if (!checkRegex(newPassword, /^(?=.*?[0-9])/))
        messages.push("Kata sandi setidaknya memiliki 1 angka");
    if (!checkRegex(newPassword, /^(?=.*?[!@#$%&*])/))
        messages.push("Kata sandi setidaknya memiliki 1 special character");
    if (checkRegex(newPassword, /(\s)/))
        messages.push("Kata sandi tidak boleh mengandung spasi");
    if (newPassword !== confirmPassword)
        messages.push("Sandi Baru dan Sandi Konfirmasi harus sama");
    if (newPassword === currentPassword)
        messages.push("Bedakan kata sandi baru dengan yang lama");

    return messages.length ? messages.join(", ") : "";
}

function checkRegex(value, regex) {
    return regex.test(value);
}


function showError(errorMsg) {
    const loginMessage = document.getElementById("loginmessage");
    var modal = document.getElementById("content-popup");
        loginMessage.textContent = errorMsg;
        modal.classList.remove("modal-content-hide");
        modal.classList.add("modal-content-show");

        setTimeout(() => {
            modal.classList.remove("modal-content-show");
            modal.classList.add("modal-content-hide")
        }, 2500);
}

function clearInputFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field)
            field.value = "";
    });
}