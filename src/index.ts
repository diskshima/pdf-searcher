import "@babel/polyfill";
import { PDFDocumentProxy, PDFJSStatic } from "pdfjs-dist";

const PDFJS: PDFJSStatic = require( "pdfjs-dist" );

async function readDocument(path: string): Promise<void> {
  let doc = await PDFJS.getDocument(filepath);
  let outline = await doc.getOutline();
  console.log(outline.map(e => e.title));
}

let filepath = process.argv[2];

readDocument(filepath);
