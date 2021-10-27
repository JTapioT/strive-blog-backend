import PdfPrinter from "pdfmake";


function getPDFReadableStream(data) {
  const fonts = {
    Arial: {
      normal: "Arial",
      bold: "Arial-Bold",
    },
  }

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [...data],
    defaultStyle: {
      font: "Arial"
    }
  }

  const options = {}

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options);

  pdfReadableStream.end();
  return pdfReadableStream;
}

export default getPDFReadableStream;