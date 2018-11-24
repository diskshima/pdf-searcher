import "@babel/polyfill";
import { PDFDocumentProxy, PDFJSStatic } from "pdfjs-dist";

const PDFJS: PDFJSStatic = require( "pdfjs-dist" );

async function readDocument(path: string): Promise<void> {
  let doc = await PDFJS.getDocument(filepath);
  let outline = await doc.getOutline();
  let pages = doc.numPages;
  let titles = outline.map(e => e.title);

  for (let i = 1; i <= 1; i++) {
    let page = await doc.getPage(i);
    let textContent = await page.getTextContent();

    console.log(`----${i}----`);
    let items = textContent.items;
    console.log(items);
  }
}

let filepath = process.argv[2];

readDocument(filepath);
