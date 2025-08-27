document.addEventListener("DOMContentLoaded", (event) => { 
    const speech = document.querySelector('#speech')
    speech.addEventListener('change', uploadSpeech)

    const small_upload = document.querySelector('.upload_speech_small')
    small_upload.addEventListener('click', toggleBigUpload)
})

function lineHeightSlider(){
    const lineHeight = document.querySelector('.line_height_controller')
    lineHeight.addEventListener('input', (event) => {
        setLineHeight(event.target.value)
    })
}

function setLineHeight(lineHeight){
    document.querySelector('.displaySpeech').style.lineHeight = lineHeight;
}

function fontSizeSlider(){
    const fontSize = document.querySelector('.font_size_controller')
    fontSize.addEventListener('input', (event) => {
        setfontSize(event.target.value)
    })
}

function setfontSize(fontSize){
    document.querySelector('.displaySpeech').style.fontSize = fontSize;
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

