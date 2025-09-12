
  
document.addEventListener("DOMContentLoaded", (event) => { 
    const speech = document.querySelector('#speech')
    speech.addEventListener('change', checkFileExtension)

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
    var remainingSpace = document.querySelector('.read').nextSibling.nodeValue.split(' ').length;
    // if next string length not less than 3, 
    var nextString;
    if (document.querySelector('.toread')){
        if(remainingSpace < 2){
            var addOn = document.querySelector('.read').nextSibling.nextSibling.nextSibling.nodeValue.split(' ').slice(0,2).join(' ');
            nextString = document.querySelector('.read').nextSibling.nextSibling.innerHTML.split(' ').slice(1).join(' ') + addOn;
        } else {
            nextString = spokeStringElement.nextSibling.nextSibling.innerHTML.split(' ').slice(1,4).join(' ');
        }
    } else{
        nextString = spokeStringElement.nextSibling.nodeValue.split(' ').slice(1,4).join(' ')
    }
    
    searchAndHighlightString(nextString, 'toread');
}


function setLineHeight(lineHeight){
    document.querySelector('.display_speech').style.lineHeight = lineHeight;
}

function setFontSize(fontSize){
    document.querySelector('.display_speech').style.fontSize = `${fontSize}px`;
}

function checkFileExtension(event){
    event.preventDefault();
    const file = document.querySelector('#speech');
    
    const PDF_EXTENSION = /(\.pdf)$/i;

    const DOC_EXTENSION  = /(\.doc|\.docx)$/i;
    if (file.value != ''){
        if (file.value.match(PDF_EXTENSION)) uploadPdfSpeech(event)
        else if (file.value.match(DOC_EXTENSION)) uploadDocSpeech(event)
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

        //   to have line breaks
          return textContent.then(function (text) {
            var finalString = "";
            var line = 0;
            var textItems = text.items;
            // Concatenate the string of the item to the final string
            for (var i = 0; i < textItems.length; i++) {
                if (line != textItems[i].transform[5]) {
                    if (line != 0) {
                        finalString +='\r\n';
                    }

                    line = textItems[i].transform[5]
                }                     
                var item = textItems[i];

                finalString += item.str;
            }

            return finalString;
            
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
    var { pdfjsLib } = globalThis;

  // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';
    // pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs";

    let reader = new FileReader();
    

    const fileURL = URL.createObjectURL(event.target.files[0])

    var pdf = pdfjsLib.getDocument(fileURL);
    extractPdfText(pdf).then(
        function (result) {
            console.log('parse ' + result);
            document.querySelector('.display_speech').innerHTML = result;
        },
        function (reason) {
            console.error(reason);
        },
    );
    // reader.onload = function (){
    //     var typedarray = new Uint8Array(this.result);

    //     var pdf = pdfjsLib.getDocument(typedarray);

    //     extractPdfText(pdf).then(
    //         function (result) {
    //             console.log('parse ' + result);
    //             document.querySelector('.display_speech').innerHTML = result.value;
    //         },
    //         function (reason) {
    //             console.error(reason);
    //         },
    //     );
    // }

    // reader.readAsDataURL(fileURL)

}

function uploadDocSpeech(event){

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

