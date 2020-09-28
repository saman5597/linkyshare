export const uploadFile = () => {

    const fileInput = document.querySelector('#fileInput');
    const progressContainer = document.querySelector('.progress-container');
    const uploadUrl = "/api/files";
    const FILE_MAX_SIZE = 100 * 1024 * 1024; //100mb

    if (fileInput.files.length > 1) {
        resetFileInput();
        showToast('You can only upload 1 file !');
        return;
    }

    const inputFile = fileInput.files[0];

    if (inputFile.size > FILE_MAX_SIZE) {
        resetFileInput();
        showToast('You can only upload file upto 100MB!');
        return;
    }
    progressContainer.style.display = 'block';

    const formData = new FormData();
    formData.append("fileInput", inputFile);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            showLink(JSON.parse(xhr.response));
        }
    };
    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        resetFileInput();
        showToast(`Error in uploading file: ${xhr.statusText}`);
    };
    xhr.open('POST',uploadUrl);
    xhr.send(formData);
};

export const updateProgress = (e) => {
    const bgProgress = document.querySelector('.bg-progress');
    const progressBar = document.querySelector('.progress-bar');
    const percentSpan = document.querySelector('#percent');
    
    const percent = Math.round((e.loaded / e.total) * 100);
    
    bgProgress.style.width = `${percent}%`;
    progressBar.style.transform = `scaleX(${percent/100})`;
    percentSpan.innerText = `${percent}%`;
};

export const showLink = (res) => {
    const progressContainer = document.querySelector('.progress-container');
    const shareContainer = document.querySelector('.share-container');
    const emailForm = document.querySelector('#emailForm');
    const fileUrlInput = document.querySelector('#fileUrlInput');

    resetFileInput();
    progressContainer.style.display = 'none';
    shareContainer.style.display = 'block';
    emailForm[2].removeAttribute('disabled');

    fileUrlInput.value = res.file;
};

let toastTimer;
export const showToast = (msg) => {
    const toast = document.querySelector('.toast');
    toast.innerText = msg;
    toast.style.transform = 'translate(-50%,0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = 'translate(-50%,60px)';
    }, 2000);
};

export const resetFileInput = () => {
    const fileInput = document.querySelector('#fileInput');
    fileInput.value = "";
};