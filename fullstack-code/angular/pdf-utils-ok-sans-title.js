const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const ARIAL = path.join(__dirname, 'ARIAL.TTF');
const ARIALBD = path.join(__dirname, 'ARIALBD.TTF');
const ARIALBI = path.join(__dirname, 'ARIALBI.TTF');
const ARIALI = path.join(__dirname, 'ARIALI.TTF');

function writeText(size, sizedown, doc, text) {
  if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage({ size: 'A4' });
  }

  const regex = /<p>(.*?)<\/p>|(<br>)|<ul>(.*?)<\/ul>/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const beforeMatch = text.substring(lastIndex, match.index);
    if (beforeMatch) {
    }

    if (match[1]) {
      writeTextP(size, sizedown, doc, match[1]);
    } else if (match[2]) {
      doc.font('ARIAL').moveDown(sizedown);
    } else if (match[3]) {
      writeTextUl(size, sizedown, doc, match[3]);
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
    doc.font('ARIAL').fontSize(size).fillColor('black').text(afterMatch);
  }
}

function writeTextP(size, sizedown, doc, text) {
  if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage({ size: 'A4' });
  }

  const regex = /(<br>)|<strong>(.*?)<\/strong>|<i>(.*?)<\/i>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const beforeMatch = text.substring(lastIndex, match.index);
    const nextMatch = text.substring(match.index + match[0].length).trim().startsWith('<br>');

    if (beforeMatch) {
      if (match[1]) {
        doc.font('ARIAL').fontSize(size).fillColor('black').text(beforeMatch);
        doc.font('ARIAL').moveDown(sizedown);
      } else {
        doc.font('ARIAL').fontSize(size).fillColor('black').text(beforeMatch, { continued: true });
      }
    }

    if (match[1]) {
      doc.font('ARIAL').moveDown(sizedown);
    } else if (match[2]) {
      doc.font('ARIALBD').fontSize(size).fillColor('black').text(match[2], { continued: !nextMatch });
    } else if (match[3]) {
      doc.font('ARIALI').fontSize(size).fillColor('black').text(match[3], { continued: true });
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
    doc.font('ARIAL').fontSize(size).fillColor('black').text(afterMatch);
    doc.font('ARIAL').moveDown(sizedown);
  }
}

function writeTextUl(size, sizedown, doc, text) {
  if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage({ size: 'A4' });
  }
  console.log('00000000000:' + text);
  const regex = /(<br>)|<strong>(.*?)<\/strong>|<i>(.*?)<\/i>|<li>(.*?)<\/li>/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {

    console.log('00000000001:' + match);
    console.log('00000000002:' + match[1]);
    console.log('00000000003:' + match[2]);
    console.log('00000000004:' + match[3]);
    console.log('00000000005:' + match[4]);

    const beforeMatch = text.substring(lastIndex, match.index);
    if (beforeMatch) {
    }

    if (match[1]) {
    } else if (match[2]) {
    } else if (match[3]) {
    } else if (match[4]) {
      writeTextLi(size, sizedown, doc, match[4]);
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
  }
}

function writeTextLi(size, sizedown, doc, text) {
  const bullet = '•';
  if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage({ size: 'A4' });
  }
  console.log('00000000000:' + text);
  const regex = /(<br>)|<strong>(.*?)<\/strong>|<i>(.*?)<\/i>/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {

    console.log('00000000001:' + match);
    console.log('00000000002:' + match[1]);
    console.log('00000000003:' + match[2]);
    console.log('00000000004:' + match[3]);

    const beforeMatch = text.substring(lastIndex, match.index);
    if (beforeMatch) {
      if (match[1]) {
        doc.font('ARIAL').fontSize(size).fillColor('black').text(`${beforeMatch}`);
        doc.font('ARIAL').moveDown(sizedown);
      } else {
        doc.font('ARIAL').fontSize(size).fillColor('black').text(`${bullet} ${beforeMatch}`, { continued: true });
      }
    }

    if (match[1]) {
      doc.moveDown(sizedown);
    } else if (match[2]) {
      doc.font('ARIALBD').fontSize(size).fillColor('black').text(match[2], { continued: true });
    } else if (match[3]) {
      doc.font('ARIALI').fontSize(size).fillColor('black').text(match[3], { continued: true });
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
  }
}

function sanitize(content) {
  return content.replace(/&nbsp;/g, ' ');
}

function generatePDF(data, outputPath, callback) {
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }
  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  doc.registerFont('ARIAL', ARIAL);
  doc.registerFont('ARIALBD', ARIALBD);
  doc.registerFont('ARIALBI', ARIALBI);
  doc.registerFont('ARIALI', ARIALI);

  doc.addPage({ size: 'A4' });
  let size = 14;
  let sizedown = 0.2;

  // let text = `<p>Nous allons réaliser une&nbsp;<strong>Application Web.</strong><br><br>Dans ce</p>`;
  // let text = `
  // <p>Nous allons réaliser une&nbsp;<strong>Application Web.</strong><br><br>Dans ce tutoriel nous utiliserons&nbsp;<strong>Angular version 19.1.3</strong><br><br>Pour commencer notre application nous partirons de rien (<strong>from scratch</strong>) en nous efforçant de suivre les meilleures pratiques (<strong>best practices)&nbsp;</strong>d'Angular.<br><br></p>
  // <ul><li>Angular a été créé par&nbsp;<strong>Google</strong>.<br><br></li><li>Angular est&nbsp;<strong>open source</strong>, son utilisation est donc gratuite.<br><br></li><li>Angular utilise&nbsp;<strong>Typescript</strong>.<br><br></li><li>Angular est un&nbsp;<strong>framework javascript Frontend</strong>.</li></ul>
  // `;
  // let content = sanitize(text);
  // writeText(size, sizedown, doc, content);

  // let text = `
  // <p>Nous allons réaliser une&nbsp;<strong>Application Web.</strong><br>Dans ce tutoriel nous
  // utiliserons&nbsp;<strong>Angular version 19.1.3<br></strong>Dans ce tutoriel nous utiliserons&nbsp;<strong>Angular
  //   version 19.1.3</strong><br><br>Pour commencer notre application nous partirons de rien (<strong>from
  //   scratch</strong>) en nous efforçant de suivre les meilleures pratiques (<strong>best
  //   practices)&nbsp;</strong>d'Angular.<br><br>Liste des informations<br><br></p>
  //   `;
  // text = `<p>Nous allons réaliser une&nbsp;<strong>Application Web.</strong>
  // Dans ce tutoriel nous utiliserons&nbsp;<strong>Angular version 19.1.3<br></strong></p>
  // `;
  // let content = sanitize(text);
  // writeText(size, sizedown, doc, content);



  data.elements.forEach(element => {
    if (element.typetext && element.content) {
      let content = sanitize(element.content);
      writeText(size, sizedown, doc, content);
    }
  });

  // let text =
  //   '<p>toto<br>toto <strong>toto </strong> toto toto</p><p><strong>Popular Frameworks</strong> :</p>' +
  //   '<ul><li>The Spring Framework for Java</li><li>The Django Framework for Python</li></ul>';
  //   writeText(size, sizedown, doc, text);
  // doc.moveDown(sizedown);

  // doc.font('ARIAL').fontSize(size).fillColor('black').text('toto');
  // doc.moveDown(sizedown);
  // doc.font('ARIAL').fontSize(size).fillColor('black').text('toto ', { continued: true });
  // doc.font('ARIALBD').fontSize(size).fillColor('black').text('toto ', { continued: true });
  // doc.font('ARIAL').fontSize(size).fillColor('black').text('toto toto');
  // doc.moveDown(sizedown);
  // const bullet = '•';
  // doc.font('ARIALBD').fontSize(size).fillColor('black').text('Popular Frameworks:');
  // doc.moveDown(sizedown);
  // doc.font('ARIAL').fontSize(size).fillColor('black').text(`${bullet} The Spring Framework for Java`);
  // doc.moveDown(sizedown);
  // doc.font('ARIAL').fontSize(size).fillColor('black').text(`${bullet} The Django Framework for Python`);
  // doc.moveDown(sizedown);


  // let text = `
  //   <strong>Popular Framework</strong>
  //   <ul><li>Le Framework Spring pour Java</li><li>le Framework Django pour Python</li></ul>`;
  // writeText(size, doc, text);

  // text = `Nous allons réaliser une <br><strong>Application Web</strong>.<br>Dans ce tutoriel <i>nous utiliserons</i> Angular version 19.1.3`;
  // writeText(size, doc, text);

  // doc.moveDown();

  // doc.font('ARIAL').fontSize(size).fillColor('black').text('Nous allons réaliser une ');
  // doc.font('ARIAL').moveDown(0.2);
  // doc.font('ARIALBD').fontSize(size).fillColor('black').text('Application Web.');
  // doc.font('ARIAL').moveDown(0.2);
  // doc.font('ARIAL').fontSize(size).fillColor('black').text('Dans ce tutoriel ', { continued: true });
  // doc.font('ARIALI').fontSize(size).fillColor('black').text('nous utiliserons ', { continued: true });
  // doc.font('ARIAL').fontSize(size).fillColor('black').text('Angular version 19.1.3');

  // const bullet = '•';

  // doc.moveDown(0.5);
  // doc.font('ARIALBD').fontSize(size).fillColor('black').text('Popular Frameworks:');
  // doc.moveDown(0.2);

  // doc.font('ARIAL').fontSize(size).fillColor('black').text(`${bullet} The Spring Framework for Java`);
  // doc.moveDown(0.2);
  // doc.font('ARIAL').fontSize(size).fillColor('black').text(`${bullet} The Django Framework for Python`);
  // doc.moveDown(0.2);
  // doc.font('ARIAL').fontSize(size).fillColor('black').text(`${bullet} The Laravel or Symfony Frameworks for PHP`);

  doc.end();
  stream.on('finish', () => {
    if (callback) callback();
  });
}

module.exports = {
  generatePDF,
};

