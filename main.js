
  
document.addEventListener("DOMContentLoaded", (event) => { 
    const speech = document.querySelector('#speech')
    speech.addEventListener('change', checkFileExtension(event))

    const small_upload = document.querySelector('.upload_speech_small')
    small_upload.addEventListener('click', toggleBigUpload)

})

function searchAndHighlightString(string, class_name){
    const speech = document.querySelector('.display_speech');
    var marked_speech = new Mark(speech);
    marked_speech.unmark({"className":class_name,});
    marked_speech.mark(string, {"separateWordSearch": false, "className": class_name});
}

function spokeString(string){
    searchAndHighlightString(string, 'read')

    const spokeStringElement = document.querySelector('.read');
    var nextString = spokeStringElement.nextSibling.nodeValue.split(' ').slice(1,4).join(' ');
    searchAndHighlightString(nextString, 'toread');
}


function setLineHeight(lineHeight){
    document.querySelector('.display_speech').style.lineHeight = lineHeight;
}

function setFontSize(fontSize){
    document.querySelector('.display_speech').style.fontSize = `${fontSize}px`;
}

function checkFileExtension(event){
    const file = document.querySelector('#speech');
    
    const PDF_EXTENSION = /(\.pdf)$/i;

    const DOC_EXTENSION  = /(\.doc|\.docx)$/i;
    if (file.value){
        if (file.value.match(PDF_EXTENSION).length > 0) uploadDocSpeech(event)
        else if (file.value.exec(DOC_EXTENSION).length > 0) uploadPdfSpeech(event)
    }
    
}

function extractPdfText(pdf){

  return pdf.promise.then(function (pdf) {
    var totalPageCount = pdf.numPages;
    var countPromises = [];
    for (
      var currentPage = 1;
      currentPage <= totalPageCount;
      currentPage++
    ) {
      var page = pdf.getPage(currentPage);
      countPromises.push(
        page.then(function (page) {
          var textContent = page.getTextContent();
          return textContent.then(function (text) {
            return text.items
              .map(function (s) {
                return s.str;
              })
              .join('');
          });
        }),
      );
    }

    return Promise.all(countPromises).then(function (texts) {
      return texts.join('');
    });
  });
}

function uploadPdfSpeech(event){
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs";

    var pdf = pdfjsLib.getDocument(event.target.result);

    extractPdfText(pdf).then(
        function (result) {
          console.log('parse ' + result);
          document.querySelector('.display_speech').innerHTML = result.value;
        },
        function (reason) {
          console.error(reason);
        },
    );

}

function uploadDocSpeech(event){
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
    textarea.value = texts.innerHTML
    texts.innerHTML = ''
    texts.appendChild(textarea)

    toggleSaveEditIcon();
}

function saveText(){
    const texts = document.querySelector('.display_speech');
    const textarea = document.querySelector('.edittext')

    texts.innerHTML = textarea.value
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

