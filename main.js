document.addEventListener("DOMContentLoaded", (event) => { 
    const speech = document.querySelector('#speech')
    speech.addEventListener('change', uploadSpeech)

    const small_upload = document.querySelector('.upload_speech_small')
    small_upload.addEventListener('click', toggleBigUpload)

})


function setLineHeight(lineHeight){
    document.querySelector('.display_speech').style.lineHeight = toString(lineHeight);
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
        mammoth.convertToHtml(
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
    const textarea = document.querySelector('textarea');
    textarea.style.display = 'none';
}

function toggleBigUpload(){
    const bigUpload = document.querySelector('.upload_speech_big');
    if (bigUpload.style.display == 'none'){
        bigUpload.style.display = 'flex';
    } else {
        bigUpload.style.display = 'none';
    }

    if (document.querySelector('.settings').style.display == 'block') toggleSettings()
}

function toggleSettings(){
    const setting = document.querySelector('.settings')
    if (setting.style.display == 'none'){
        setting.style.display = 'block';
    } else {
        setting.style.display = 'none';
    }

    if (document.querySelector('.upload_speech_big').style.display == 'flex') toggleBigUpload()
}

