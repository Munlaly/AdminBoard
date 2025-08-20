//Selectors
const login = document.querySelector('#login');
const overlay = document.querySelector('#overlay');
const main = document.querySelector('main');
const mainContent = document.querySelector('#main-content');
const header = document.querySelector('header');
const sideBar = document.querySelector('#sidebar');
const logout = document.querySelector('#logout');
const contentTitle = document.querySelector('#content-title');

//Global variables
const users = [{username: 'Munlaly', password: 'Asd'}];
const uploadedFiles = [];
const projectItems = [];
let uploadForm;



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
    }
});

login.querySelector('#show-password-icon').addEventListener('click', () => {
    const passwordField = login.querySelector('#password');
    if(passwordField.type === 'password') passwordField.type = 'text';
    else passwordField.type = 'password';
})

logout.addEventListener('click', () => {
    location.reload();
})

// Add event listeners to each sidebar item
sideBar.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const h3 = item.querySelector('h3');
        const option = h3.innerText;
        switch (option) {
            case 'Projects': {
                contentTitle.innerHTML = 'Projects';
                mainContent.innerHTML = '';
                mainContent.className = 'projects'; 
                projectItems.forEach(item => {
                    mainContent.appendChild(item);
                });
                break;
            }

            case 'Upload':{
                contentTitle.innerHTML = 'Upload';
                mainContent.innerHTML = '';
                mainContent.className = 'upload';
                mainContent.appendChild(uploadForm);
                // Re-attach drag-and-drop listeners to #droparea
                setTimeout(() => {
                    const dropareaEl = document.querySelector('#droparea');
                    if (dropareaEl) {
                        ['dragenter', 'dragover'].forEach(e =>{
                            dropareaEl.addEventListener(e, dragareaActive);
                            dropareaEl.addEventListener(e, (e) => {e.preventDefault();});
                        });
                        ['dragleave', 'drop'].forEach(e => {
                            dropareaEl.addEventListener(e, dragareaInactive);
                            dropareaEl.addEventListener(e, (e) => {e.preventDefault();});
                        });
                        dropareaEl.addEventListener("drop", handleDrop);
                    }
                }, 0);
                break;
            }

            case 'Github':{
                window.open('https://github.com/Munlaly', '_blank');
                break;
            }

            case 'Contact':{
                const email = 'nemetdbence@gmail.com';
                const subject = 'Mail from admin site';
                const body = 'I would like to get in touch.';
                const mailto = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(mailto, '_blank');
                break;
            }
        }
    });
});

//Page loads
document.addEventListener('DOMContentLoaded', () => {
    login.classList.add('hidden');
    overlay.classList.add('hidden');
    //main.classList.add('hidden');
    //header.classList.add('hidden');

    //generate content
    generateProjectItems();
    generateUploadForm();

    // Wait for uploadForm to be generated and attached, then add droparea listeners
    setTimeout(() => {
        const dropareaEl = document.querySelector('#droparea');
        if (dropareaEl) {
            ['dragenter', 'dragover'].forEach(e =>{
                dropareaEl.addEventListener(e, dragareaActive);
                dropareaEl.addEventListener(e, (e) => {e.preventDefault();});
            });
            ['dragleave', 'drop'].forEach(e => {
                dropareaEl.addEventListener(e, dragareaInactive);
                dropareaEl.addEventListener(e, (e) => {e.preventDefault();});
            });
            dropareaEl.addEventListener("drop", handleDrop);
        }
    }, 0);

    
});

function dragareaActive() {
    document.querySelector('#droparea').style.borderColor = 'green';
};

function dragareaInactive() {
   document.querySelector('#droparea').style.borderColor = 'black';
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
            const fileNameSpan = uploadForm.querySelector('#file-name-span');
            if (fileNameSpan) fileNameSpan.textContent = file.name;
            const fileInput = document.querySelector('#file');
            if (fileInput) fileInput.required = false;
        } else {
            console.log('Invalid file type. Only JPG and PNG are allowed.');
            alert('Only JPG and PNG files are allowed!');
        }
    } else {
        console.log('No file dropped.');
    }
    
};

function generateProjectItems() {
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load projects.json');
            return response.json();
        })
        .then(data => {
            data.forEach(project => {
                const item = document.createElement('div');
                item.className = 'project-item';
                const container = document.createElement('div');
                container.className = 'img-container';
                const img = document.createElement('img');
                img.src = project.img;
                img.alt = project.title;
                img.className = 'project-img';
                container.appendChild(img);
                const title = document.createElement('h3');
                title.textContent = project.title;
                item.appendChild(container);
                item.appendChild(title);
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    window.open(project.link, '_blank');
                });
                projectItems.push(item);
            });
        })
        .catch(err => {
            console.error('Error loading project items:', err);
        });
}

function generateUploadForm(){
    const form = document.createElement('form');
    form.id = 'upload-form';
    form.enctype = 'multipart/form-data';

    // Drop area for file upload
    const droparea = document.createElement('div');
    droparea.id = 'droparea';
    const container = document.createElement('div');
    container.className = 'img-container';
    const img = document.createElement('img');
    img.src = 'img/icons/file.png';
    img.alt = 'File';
    container.appendChild(img);
    droparea.appendChild(container);
    const p = document.createElement('p');
    p.innerText = 'Drop your .jpg or .png file here!';
    droparea.appendChild(p);
    form.appendChild(droparea);

    // Helper to create label/input pairs
    function createField(labelText, inputType, inputName, inputId, placeholder) {
        const item = document.createElement('div');
        item.classList.add('upload-form-item');
        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.innerText = labelText;
        const input = document.createElement('input');
        input.type = inputType;
        input.name = inputName;
        input.id = inputId;
        if(placeholder) input.placeholder = placeholder;
        input.required = true;
        item.appendChild(label);
        item.appendChild(input);
        return item;
    }

    // Image field
    form.appendChild(createField('Choose the image:', 'file', 'file', 'file', 'Choose file'));
    const fileNameSpan = document.createElement('span');
    fileNameSpan.id = 'file-name-span';
    fileNameSpan.textContent = 'No file chosen';
    fileNameSpan.style.marginLeft = '10px';
    form.querySelector('.upload-form-item').appendChild(fileNameSpan);
    // Title field
    form.appendChild(createField('Enter title:', 'text', 'input-title', 'input-title'));
    // Link field
    form.appendChild(createField('Enter link:', 'url', 'link', 'upload-link'));

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Upload Project';
    submitBtn.id = 'upload-btn';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const div = document.createElement('div');
        div.className = 'project-item';

        // Create image container and image
        const container = document.createElement('div');
        container.className = 'img-container';
        const img = document.createElement('img');
        // Use the last uploaded file (from drag & drop)
        const file = uploadedFiles[uploadedFiles.length - 1];
        if (file) {
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
        } else {
            img.alt = 'No image';
        }
        container.appendChild(img);
        div.appendChild(container);

        const title = form.querySelector('#input-title').value;
        const link = form.querySelector('#upload-link').value;

        const h3 = document.createElement('h3');
        h3.innerText = title;
        div.appendChild(h3);
        div.addEventListener('click', () => {
            window.open(link, '_blank');
        });
        projectItems.push(div);

        // Reset the form and file name span
        form.reset();
        const fileNameSpan = form.querySelector('#file-name-span');
        if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
        // Remove the last uploaded file from the array
        uploadedFiles.length = 0;

        // Make the form appear as if it reappears (clear and re-append)
        mainContent.innerHTML = '';
        mainContent.className = 'upload';
        mainContent.appendChild(uploadForm);
        // Re-attach drag-and-drop listeners to #droparea
        setTimeout(() => {
            const dropareaEl = document.querySelector('#droparea');
            if (dropareaEl) {
                ['dragenter', 'dragover'].forEach(e =>{
                    dropareaEl.addEventListener(e, dragareaActive);
                    dropareaEl.addEventListener(e, (e) => {e.preventDefault();});
                });
                ['dragleave', 'drop'].forEach(e => {
                    dropareaEl.addEventListener(e, dragareaInactive);
                    dropareaEl.addEventListener(e, (e) => {e.preventDefault();});
                });
                dropareaEl.addEventListener("drop", handleDrop);
            }
        }, 0);
    });
    
    uploadForm = form;
}
