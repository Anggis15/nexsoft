function main(e){
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const loginForm = document.getElementById('loginForm');
    const passwordFields = document.getElementById('passwordFields');
    const loginBtn = document.querySelector('.action-btn');
    const textLogin = document.getElementById('text-login')

    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        passwordFields.style.display = 'block'; 
        loginBtn.textContent = 'Login'; 
        forgotPasswordLink.style.display = 'none'; 
        textLogin.style.display = 'none';
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const uri = "/api/login"
        const userId = sanitizeInput(document.getElementById('userId').value);
        const password = sanitizeInput(document.getElementById('password').value);
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
        const userId = document.getElementById('userIdReset').value;
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
        }else{
            clearInputFields(["userIdReset", "currentPassword", "newPassword", "confirmPassword"]);
        let uri = `/nexdist/userchangepassword?action=save&userID=${sanitizeInput(userId)}&password=${sanitizeInput(currentPassword)}&newPassword=${sanitizeInput(newPassword)}`
        let responseData = fetch(uri).then(response => {
            if (!response.ok) {
                alert("Gagal mereset password!!!");
                
            }else if(response.ok){
                showError('Password reset successfully!');
            }
            })
            .then(data => {
                return data.json()
            })
            .catch(error => {
                alert("Server error")
            });
        
            passwordFields.style.display = 'none';
            loginForm.style.display = 'block';
            forgotPasswordLink.style.display = 'block';
            textLogin.style.display = '';
        }
        
    });
    
    loginBtn.addEventListener('click', function() {
        if (loginBtn.textContent === 'Login') {
            passwordFields.style.display = 'none';
            loginForm.style.display = 'block';
            forgotPasswordLink.style.display = 'block';
            
        }
    });
}

document.addEventListener("DOMContentLoaded", main)



function validatePasswordFields(userId, currentPassword, newPassword, confirmPassword) {
    let messages = [];

    if (!userId)
        messages.push("Harap isi user ID");
    if (!currentPassword)
        messages.push("Harap isi password saat ini");
    if (!checkRegex(newPassword, /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[_#\-$])(\s).{8,16}$/))
        messages.push("Kata sandi setidaknya memiliki 8 karakterFormat minimal 1 angka, 1 huruf kecil, 1 huruf besar, 1 spesial karakter, tanpa spasi min 8 max 16 alfanumerik, contoh : aB4$12345");
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
function sanitizeInput(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}