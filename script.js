const DROPBOX_ACCESS_TOKEN = 'YOUR_DROPBOX_ACCESS_TOKEN';

const dbx = new Dropbox.Dropbox({ accessToken: sl.B2qe-4Rs2Spk3le7LZu3lUrypGO0FOqD7DGNsbDF8LdvWutJDKJORsQWXTJqFcDLroT5aXzcVOnG0bpKJKQYoA_2LHa9asqlhhuLM6dtuy7pfAx6bm9skg62EUXmplfTqG1OwhiCfsfPv4g });

const dropArea = document.getElementById('drop-area');
const fileList = document.getElementById('file-list');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    [...files].forEach(uploadFile);
}

function uploadFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        dbx.filesUpload({path: '/' + file.name, contents: event.target.result})
            .then(response => {
                return dbx.sharingCreateSharedLink({path: response.path_display});
            })
            .then(linkResponse => {
                displayFile({ name: file.name, url: linkResponse.url.replace('?dl=0', '?raw=1') });
            })
            .catch(error => console.error(error));
    };
    reader.readAsArrayBuffer(file);
}

function displayFile(file) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = file.url;
    a.textContent = file.name;
    a.target = '_blank';
    li.appendChild(a);
    fileList.appendChild(li);
}
