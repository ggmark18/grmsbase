import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export class PageInfo {
    size = 'A4';
    orientation = 'portrait';  // or landscape
    margins = [ 40, 60, 40, 60 ]; 
}

export class PDFWriter {
    printer = undefined;
    chartNode = undefined;
    
    writedir = undefined;
    contents = [];

    constructor( writedir, fontdir_r = '../../../assets/fonts') {
        this.writedir = writedir;
        let fontdir = __dirname + '/' + fontdir_r;
        let fonts = {
            Roboto: {
                normal: `${fontdir}/Koruri-Regular.ttf`,
                bold: `${fontdir}/Koruri-Bold.ttf`,
            },
            Koruri: {
                normal: `${fontdir}/Koruri-Regular.ttf`,
                bold: `${fontdir}/Koruri-Bold.ttf`,
            },
            NGT: {
                normal: `${fontdir}/ngtmp.ttf`
            },
        };
        this.printer = new PdfPrinter(fonts);
	this.makeChartArea(1000,400);
    }

    push( content ) {
        this.contents.push(content);
    }
    getContents() {
        return this.contents;
    }
    clearContents() {
        this.contents = [];
    }
    isEmptyContents() {
        return this.contents.length == 0;
    }

    makeChartArea(width, height) {
        if( this.chartNode ) {
            this.chartNode.destroy();
        }
        this.chartNode = new ChartJSNodeCanvas({width,height});
    }

    async drawChart(options) {
        return await this.chartNode.renderToBuffer(options);
//        return await this.chartNode.getImageBuffer('image/png');
    }
    writeDocument( filename, styles, page : PageInfo ) {
        return new Promise((resolve, reject) => {
            try {
                let docDefinition = {
                    pageSize: page.size,
                    //pageOrientation: page.orientation, // I don't know the reason why doesn't work
                    pageMargins: page.margins,
                    content: this.contents,
                    styles: styles
                };
                const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
                let output = fs.createWriteStream( this.writedir + filename );

                output.on('close', function() {
                    resolve(this.writedir + filename);
                });
            
                pdfDoc.pipe( output );
                pdfDoc.end();
            } catch ( error ) {
                reject(error);
            }
        });
    }

    createWriteStream( filename ) {
        return fs.createWriteStream(this.writedir + filename);
    }


    createReadStream( filename ) {
        return fs.createReadStream(this.writedir + filename);
    }

    getFile( fullpathname ) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fullpathname, function(err, data) {
                if(err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    holizontalLine(width, thick) {
        // full width A4( 210mm -> 595.27 [ 210 / 0.35278mm (1pt) ]
        // both side margin 60 so ....
        let x1 = (595.27 - 120 - width) / 2;
        let x2 = x1 + width;
        return { canvas: [{ type: 'line', x1: x1, y1: 0, x2: x2, y2: 0, lineWidth: thick }] };
    }
    
    destroy() {
    }

    filenameEscape( name ) {
        return name.replace(/\//g, "／");
    }

}
