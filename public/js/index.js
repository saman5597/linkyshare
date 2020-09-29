/* eslint-disable */
import '@babel/polyfill';
import { uploadFile , resetFileInput, showToast } from './main';

console.log("It's working");

//DOM ELEMENTS
const dropZone = document.querySelector('.drop-zone');
const browseBtn = document.querySelector('.browse-btn');
const fileInput = document.querySelector('#fileInput');
const shareContainer = document.querySelector('.share-container');
const fileUrlInput = document.querySelector('#fileUrlInput');
const copyBtn = document.querySelector('#copyBtn');
const emailForm = document.querySelector('#emailForm');

const emailUrl = "/api/files/send";

if (dropZone) {
    dropZone.addEventListener('dragover', (e)=> {
        e.preventDefault();
        if(!dropZone.classList.contains('dragged')){
            dropZone.classList.add('dragged');
        }
    });

    dropZone.addEventListener('dragleave', ()=> {
        dropZone.classList.remove('dragged');
    });

    dropZone.addEventListener('drop', (e)=> {
        e.preventDefault();
        dropZone.classList.remove('dragged');
        const files = e.dataTransfer.files;
        if(files.length) {
            fileInput.files = files;
            uploadFile();
        }
    });
}

if (fileInput) {
    fileInput.addEventListener('change', ()=> {
        uploadFile();
    });
}

if (browseBtn) {
    browseBtn.addEventListener('click', ()=> {
        fileInput.click();
    });
}

if (copyBtn) {
    copyBtn.addEventListener('click',()=> {
        fileUrlInput.select();
        document.execCommand('copy');
        showToast('Link copied to clipboard.');
    });
}

if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = fileUrlInput.value;
        const formData = {
            uuid : url.split('/').splice(-1, 1)[0],
            senderEmail: emailForm.elements['senderEmail'].value,
            receiverEmail: emailForm.elements['receiverEmail'].value
        }

        fetch(emailUrl, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(formData)
        }).then(res => res.json()).then(data => {
            if (data.status) {
                emailForm[2].setAttribute('disabled', 'true');
                shareContainer.style.display = 'none';
                showToast(data.message);
            }
            else {
                showToast(data.message);
                return;
            }
        }).catch(err => {
            showToast(err.message);
        });
    });
}