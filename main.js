document.addEventListener("DOMContentLoaded", (event) => { 
    const speech = document.querySelector('#speech')
    speech.addEventListener('change', uploadSpeech)

    const small_upload = document.querySelector('.upload_speech_small')
    small_upload.addEventListener('click', toggleBigUpload)

})


function setLineHeight(lineHeight){
    document.querySelector('.display_speech').style.lineHeight = lineHeight;
}

function setFontSize(fontSize){
    document.querySelector('.display_speech').style.fontSize = `${fontSize}px`;
}

function uploadSpeech(event){
    event.preventDefault();

    let reader = new FileReader();

    var options = {
         convertImage: mammoth.images.imgElement((image) => {
            return image.read('base64').then((imageBuffer) => {
                return {
                src: 'data:' + image.contentType + ';base64,' + imageBuffer,
                style: 'max-width: 90vw',
                };
            });
        }),
    }

    reader.onload = function (event) {
        mammoth.extractRawText(
            { arrayBuffer: event.target.result },
            options
        )
            .then(function (result) {
                document.querySelector('.display_speech').innerHTML = result.value;
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    toggleBigUpload();
    reader.readAsArrayBuffer(event.target.files[0]);

    // remove textarea
    hideTextarea();

};

function hideTextarea(){
    const textarea = document.querySelector('.textbox');
    textarea.style.display = 'none';
}

function editText(){
    const texts = document.querySelector('.display_speech');

    const textarea = document.createElement('textarea');
    textarea.setAttribute('class', 'edittext')
    textarea.innerHTML = texts.innerHTML
    texts.innerHTML = ''
    texts.appendChild(textarea)

    toggleSaveEditIcon();
}

function saveText(){
    const texts = document.querySelector('.display_speech');
    const textarea = document.querySelector('.edittext')

    texts.innerHTML = textarea.innerHTML
    textarea.remove()

    toggleSaveEditIcon();
}

function toggleSaveEditIcon(){
    const editButton = document.querySelector('#editText')
    const saveButton = document.querySelector('#saveText')

    if (editButton.style.display == 'none') {
        saveButton.style.display = 'none';
        editButton.style.display = 'block';
    } else{
        saveButton.style.display = 'block';
        editButton.style.display = 'none';
    }
}


function toggleBigUpload(){
    if (document.querySelector('.settings').style.display == 'block') toggleSettings()

    const bigUpload = document.querySelector('.upload_speech_big');
    if (bigUpload.style.display == 'none'){
        bigUpload.style.display = 'flex';
    } else {
        bigUpload.style.display = 'none';
    }

}

function toggleSettings(){
    if (document.querySelector('.upload_speech_big').style.display == 'flex') toggleBigUpload()

    const setting = document.querySelector('.settings')
    if (setting.style.display == 'none'){
        setting.style.display = 'block';
    } else {
        setting.style.display = 'none';
    }

}

