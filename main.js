document.addEventListener("DOMContentLoaded", (event) => { 
    const speech = document.querySelector('#speech')
    speech.addEventListener('change', uploadSpeech)
})


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

    reader.readAsArrayBuffer(event.target.files[0]);
};