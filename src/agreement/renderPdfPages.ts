/** Client-only: rasterize a filled agreement PDF into page image data URLs. */

import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function renderPdfPagesToDataUrls(
  pdfBytes: ArrayBuffer | Uint8Array,
  scale = 2,
): Promise<string[]> {
  const data = pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes);
  const doc = await pdfjs.getDocument({ data }).promise;
  const urls: string[] = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create canvas for PDF preview.");

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;
    urls.push(canvas.toDataURL("image/jpeg", 0.92));
  }

  return urls;
}
