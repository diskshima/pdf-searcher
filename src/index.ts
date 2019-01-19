import '@babel/polyfill';
import { PDFDocumentProxy, PDFJSStatic } from 'pdfjs-dist';
import { Client, GetResponse } from 'elasticsearch';
import program from 'commander';

type DocType = {
  document: {
    title: string,
  },
  page: {
    number: number,
  },
  content: {
    text: string,
  },
};

const PDFJS: PDFJSStatic = require( "pdfjs-dist" );
const DOC_TYPE = '_doc';
const DOC_INDEX = 'documents';

async function readDocument(path: string): Promise<void> {
  let doc = await PDFJS.getDocument(path);
  let outline = await doc.getOutline();
  let numPages = doc.numPages;
  let titles = outline.map(e => e.title);

  for (let i = 1; i <= numPages; i++) {
    let page = await doc.getPage(i);
    let textContent = await page.getTextContent();

    console.log(`Processing ${i}...`);
    let items = textContent.items;
    insertPage(titles[0], i, items.map(e => e.str).join(''));
  }
};

let getClient = () => {
  const options = {
    host: 'localhost:9200',
    log: 'info',
  };

  if (program.verbose) {
    options.log = 'trace';
  }

  return new Client(options);
};

let insertPage = async (title: string, pageNumber: number, text: string) => {
  let client = getClient();
  let document: DocType = {
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
      index: DOC_INDEX,
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

let searchDocuments = async (term: string) => {
  let client = getClient();

  let resp = await client.search({
    index: DOC_INDEX,
    body: {
      query: {
        simple_query_string : {
          query: term,
          default_operator: 'and',
        },
      },
    }
  });

  return resp;
};

program
  .version('0.1.0')
  .option('-v, --verbose', 'Verbose output');
program.command('add <path>')
  .action((path, cmd) => {
    readDocument(path);
  });
program.command('search <term>')
  .action(async (term, cmd) => {
    const result = await searchDocuments(term);
    const hits = result.hits;
    const totalCount = hits.total;
    const outputStr = hits.hits
      .sort((h1, h2) => {
        const p1 = (h1._source as DocType).page.number;
        const p2 = (h2._source as DocType).page.number;
        return p1 - p2;
      })
      .map((h) => {
        const source = h._source as DocType;
        const title = source.document.title;
        const page = source.page.number;
        const content = source.content.text;
        return `----------------------\n${title} P.${page}\n${content}`;
      }).join("\n");

    console.log(outputStr);
  });

program.parse(process.argv);
