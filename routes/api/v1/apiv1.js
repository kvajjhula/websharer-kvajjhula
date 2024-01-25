import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser';
var router = express.Router();

router.get('/', (req, res) => {
  res.send('response')
})

router.get('/urls/preview/', async function (req, res, next) {
  res.type('html')
  let inputURL = req.query.url
  try {
    const response = await fetch(inputURL)
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
        titleTag = metaTags[i].getAttribute('content') + "";
      } else if (metaTags[i].rawAttrs.startsWith("property=\"og:description")) {
        descTag = metaTags[i].getAttribute('content') + "";
      } else if (metaTags[i].rawAttrs.startsWith("property=\"og:url")) {
        urlTag = metaTags[i].getAttribute('content') + "";
      } else if (metaTags[i].rawAttrs.startsWith("property=\"og:image\"")) {
        imgTag = metaTags[i].getAttribute('content') + "";
      } else if (metaTags[i].rawAttrs.startsWith("name=\"keywords")) {
        keywords = metaTags[i].getAttribute('content') + "";
      } else {
        continue
      }
    }

    if (urlTag === "" || urlTag === undefined) {
      urlTag = "<a href=\"" + inputURL + "\">" + inputURL + "</a>"
    }

    if (titleTag === "" || titleTag === undefined) {
      if (pageTitle === "" || pageTitle === undefined) {
        titleTag = inputURL
      } else {
        titleTag = pageTitle;
      }
    }
    res.type('html')
    res.send(
      `
      <html>
      <body>
          <div style="max-width: 500px; border: solid 5px; padding: 50px; margin: 50px; text-align: center;"> 
            <a href=${urlTag}>
                <p><strong> 
                    ${titleTag}
                </strong></p>
                <img src=${imgTag} style="max-height: 200px; max-width: 270px;">
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
});




export default router;
