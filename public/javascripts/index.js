
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    console.log(url)
    
    let preview = "TODO: Fetch the url preview from your API"
    try {
        const response = await fetch("api/v1/urls/preview?url=" + url)
        if (response.ok) {
            preview = await response.text()
        }
    } catch (error) {
        displayPreviews(error)
    }
    
    displayPreviews(preview)
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
