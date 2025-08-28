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

    reader.onload = function (event) {
        mammoth.convertToHtml({ arrayBuffer: event.target.result })
            .then(function (result) {
                document.querySelector('.display_speech').innerHTML = result.value;
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    toggleBigUpload();
    reader.readAsArrayBuffer(event.target.files[0]);
};

function toggleBigUpload(){
    const bigUpload = document.querySelector('.upload_speech_big')
    if (bigUpload.style.display == 'none'){
        bigUpload.style.display = 'block';
    } else {
        bigUpload.style.display = 'none';
    }
}

function toggleSettings(){
    const bigUpload = document.querySelector('.settings')
    if (bigUpload.style.display == 'none'){
        bigUpload.style.display = 'block';
    } else {
        bigUpload.style.display = 'none';
    }
}

