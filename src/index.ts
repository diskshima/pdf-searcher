import '@babel/polyfill';
import { PDFDocumentProxy, PDFJSStatic } from 'pdfjs-dist';
import { Client, GetResponse } from 'elasticsearch';

const PDFJS: PDFJSStatic = require( "pdfjs-dist" );

const DOC_TYPE = '_doc';

async function readDocument(path: string): Promise<void> {
  let doc = await PDFJS.getDocument(filepath);
  let outline = await doc.getOutline();
  let pages = doc.numPages;
  let titles = outline.map(e => e.title);

  for (let i = 1; i <= 10; i++) {
    let page = await doc.getPage(i);
    let textContent = await page.getTextContent();

    console.log(`Processing ${i}...`);
    let items = textContent.items;
    insertPage(titles[0], i, items.map(e => e.str).join(''));
  }
};

let getClient = () => {
  return new Client({
    host: 'localhost:9200',
    log: 'trace',
  });
};

let insertPage = async (title: string, pageNumber: number, text: string) => {
  let client = getClient();
  let document = {
    document: {
      title,
    },
    page: {
      number: pageNumber,
    },
    content: {
      text,
    }
  };

  try {
    await client.create({
      index: 'documents',
      type: DOC_TYPE,
      id: `${title}_${pageNumber}`,
      body: document,
    });

    return;
  } catch (e) {
    console.warn(e);
  }
};

let getPage = async (index: string , id: string) => {
  let client = getClient();

  let resp = await client.get({ id, index, type: DOC_TYPE });
  return resp;
};

let filepath = process.argv[2];

// readDocument(filepath);

getPage('documents', 'クラウドサービス事業者が医療情報を取り扱う際の安全管理に関するガイドライン第1版_9').then((page) => {
  console.log(page._source);
});
