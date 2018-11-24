import '@babel/polyfill';
import { PDFDocumentProxy, PDFJSStatic } from 'pdfjs-dist';
import { Client } from 'elasticsearch';

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

let queryES = async () => {
  let client = new Client({
    host: 'localhost:9200',
    log: 'trace',
  });

  let error = await client.ping({});
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Ping worked.');
  }
};

let filepath = process.argv[2];

// readDocument(filepath);

queryES();
