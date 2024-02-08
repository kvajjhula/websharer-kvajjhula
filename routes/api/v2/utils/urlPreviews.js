import fetch from 'node-fetch';
import parser from 'node-html-parser';
import sanitizeHtml from 'sanitize-html'

async function getURLPreview(url){
  try {
    const response = await fetch(url)
    const body = await response.text()
    const htmlPage = parser.parse(body);

    let metaTags = htmlPage.querySelectorAll("meta")
    let pageTitle = htmlPage.querySelector("title")

    // first check for open graph tags
    let titleTag = ""
    let descTag = ""
    let urlTag = ""
    let imgTag = ""
    let keywords = ""

    for (let i = 0; i < metaTags.length; i++) {
      if (metaTags[i].rawAttrs.startsWith("property=\"og:title")) {
        titleTag = sanitizeHtml(metaTags[i].getAttribute('content') + "");
      } else if (metaTags[i].rawAttrs.startsWith("property=\"og:description")) {
        descTag = sanitizeHtml(metaTags[i].getAttribute('content') + "");
      } else if (metaTags[i].rawAttrs.startsWith("property=\"og:url")) {
        urlTag = sanitizeHtml(metaTags[i].getAttribute('content') + "");
      } else if (metaTags[i].rawAttrs.startsWith("property=\"og:image\"")) {
        imgTag = sanitizeHtml(metaTags[i].getAttribute('content') + "");
      } else if (metaTags[i].rawAttrs.startsWith("name=\"keywords")) {
        keywords = sanitizeHtml(metaTags[i].getAttribute('content') + "");
      } else {
        continue
      }
    }

    if (urlTag === "" || urlTag === undefined) {
      urlTag = "<a href=\"" + url + "\">" + url + "</a>"
    }

    if (titleTag === "" || titleTag === undefined) {
      if (pageTitle === "" || pageTitle === undefined) {
        titleTag = url
      } else {
        titleTag = pageTitle;
      }
    }


    return(
      `
      <html>
      <body>
          <div style="max-width: 500px; border: solid 5px; padding: 10px; margin: 10px; text-align: center;"> 
            <a href=${sanitizeHtml(urlTag)}>
                <p><strong> 
                    ${titleTag}
                </strong></p>
                <img src=${imgTag} style="max-height: 200px; max-width: 250px;">
            </a>
            ${descTag ? `<p>${descTag}</p>` : ''} 
            ${keywords ? `<p>${keywords}</p>` : ''} 

          </div>
      </body>
      </html>
      `
    );
  } catch (error) {
    console.log(error)
  }

}

export default getURLPreview;