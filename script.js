//Selectors
const login = document.querySelector('#login');
const overlay = document.querySelector('#overlay');
const main = document.querySelector('main');
const header = document.querySelector('header');
const droparea = document.querySelector('#droparea');

//Global variables
const users = [{username: 'Munlaly', password: 'Asd'}];
const uploadedFiles = [];


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
        main.classList.remove('hidden');
        header.classList.remove('hidden');
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
    login.classList.add('hidden');
    overlay.classList.add('hidden');
    //main.classList.add('hidden');
    //header.classList.add('hidden');

    //prevent deafuelt behavior for drag and drop events and change dragarea border
   
    ['dragenter', 'dragover'].forEach(e =>{
        droparea.addEventListener(e,dragareaActive);
        droparea.addEventListener(e, (e) => {e.preventDefault();});
    });

    ['dragleave', 'drop'].forEach(e => {
        droparea.addEventListener(e,dragareaInactive);
        droparea.addEventListener(e, (e) => {e.preventDefault();});
    });

    droparea.addEventListener("drop", handleDrop);
});

function dragareaActive() {
    droparea.style.borderColor = 'green';
};

function dragareaInactive() {
    droparea.style.borderColor = 'black';
};

function handleDrop(e){
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        const file = files[0];
        const validTypes = ['image/jpeg', 'image/png'];
        if (validTypes.includes(file.type)) {
            uploadedFiles.push(file);
            console.log('File added:', file);
        } else {
            console.log('Invalid file type. Only JPG and PNG are allowed.');
            alert('Only JPG and PNG files are allowed!');
        }
    } else {
        console.log('No file dropped.');
    }
    
};
