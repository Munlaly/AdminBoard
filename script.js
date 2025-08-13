//Selectors
const login = document.querySelector('#login');
const overlay = document.querySelector('#overlay');
const content = document.querySelector('#content');

//Global variables
let users = [{username: 'Munlaly', password: 'Asd'}];


//Event listeners
login.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameField = login.querySelector('#username');
    const passwordField = login.querySelector('#password');

    const username = usernameField.value.trim();
    const password = passwordField.value;

    const validUser = users.find(user => user.username === username && user.password === password);

    if(!validUser){
        alert('Username and password don\'t match!');
    }
    else{
        alert('Successful login!');
        login.classList.add('hidden');
        overlay.classList.add('hidden');
        content.hidden = false;
    }
});

login.querySelector('#show-password-icon').addEventListener('click', () => {
    const passwordField = login.querySelector('#password');
    if(passwordField.type === 'password') passwordField.type = 'text';
    else passwordField.type = 'password';
})


//Page loads
document.addEventListener('DOMContentLoaded', () => {
    //remove this
    login.classList.add('hidden');
    login.hidden = true;
    overlay.hidden = true;

    
    //content.hidden = true;
})