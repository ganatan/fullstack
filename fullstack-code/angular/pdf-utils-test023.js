const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const ARIAL = path.join(__dirname, 'ARIAL.TTF');
const ARIALBD = path.join(__dirname, 'ARIALBD.TTF');
const ARIALBI = path.join(__dirname, 'ARIALBI.TTF');
const ARIALI = path.join(__dirname, 'ARIALI.TTF');

const PDF_SIZE = 'A4';
const PDF_TOP = 40;
const PDF_BOTTOM = 40;
const PDF_LEFT = 30;
const PDF_RIGHT = 30;

const PDF_WIDTH = 535;

const PDF_INTRO = {
  titleFont: 'ARIALBD',
  titleSize: 24,
  titleWidth: PDF_WIDTH,
  titleColor: '#2196f3',
  titleLeft: 60,
  titleAlign: 'left',
  textFont: 'ARIAL',
  textSize: 14,
  textWidth: 200,
  textColor: 'black',
  textLeft: 30,
  textAlign: 'left',
}

const PDF_DOWN = {
  sizeBrFirst: 0.2,
  sizeBrSecond: 0.7,
  sizeFont: 'ARIAL',
}

const COLOR_HREF = '#2196f3';
const LINE_GAP = 3;
const BULLET_LI = '•';

function sanitize(content) {
  return content.replace(/&nbsp;/g, ' ');
}

function addParagraph(content) {
  if (/^\s*<(p|ul)>/.test(content)) {
    return content;
  }
  return `<p>${content}</p>`;
}

function addImageWithShadow(active, doc, imagePath, posX, posY, scaleFactor = 0.6, shadowOffset = 5) {
  if (!fs.existsSync(imagePath)) {
    console.error(`Image not found: ${imagePath}`);
    return;
  }
  const image = doc.openImage(imagePath);
  const newWidth = image.width * scaleFactor;
  const newHeight = image.height * scaleFactor;
  doc.image(imagePath, posX, posY, { width: newWidth, height: newHeight });
  if (active) {
    doc.rect(posX + 1, posY + 1, newWidth, newHeight)
      .strokeColor('#cccccc')
      .lineWidth(1)
      .stroke();
    doc.rect(posX, posY, newWidth, newHeight)
      .strokeColor('#ffffff')
      .lineWidth(2)
      .stroke();
  }
}

function addLine(color, doc, posY, thickness = 1) {
  const pageWidth = doc.page.width;
  const pageMargins = doc.page.margins.left + doc.page.margins.right;
  const lineWidth = (pageWidth - pageMargins) * 1;
  const startX = (pageWidth - lineWidth) / 2;
  const endX = startX + lineWidth;
  doc.moveTo(startX, posY)
    .lineTo(endX, posY)
    .strokeColor(color)
    .lineWidth(thickness)
    .stroke();
  if (color !== 'white') {
    doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrSecond);
    checkPage(doc);
    doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrSecond);
    checkPage(doc);
  }

}

function writeTextLi(doc, text, font, color, width, size, left, align) {
  const bullet = BULLET_LI;
  const regex = /(<br>)(<br>)?|<strong>(.*?)<\/strong>|<em>(.*?)<\/em>|<a\s+href="([^"]+)">(.*?)<\/a>/g;

  let lastIndex = 0;
  let match;
  let index = 0;
  let bulletLi = '';
  let leftLi = 10;

  while ((match = regex.exec(text)) !== null) {
    const beforeMatch = text.substring(lastIndex, match.index);
    const nextMatchBr = text.substring(match.index + match[0].length).trim().startsWith('<br>');
    let lastMatch = regex.lastIndex === text.length;

    if (beforeMatch) {
      if (match[1]) {
        index += 1; bulletLi = ''; leftLi = 23; if (index === 1) { bulletLi = bullet + '  '; leftLi = 10; }
        doc.font(font)
          .fontSize(size)
          .fillColor(color)
          .text(`${bulletLi}${beforeMatch}`,
            left + leftLi,
            doc.y, {
            width: width,
            align: align,
            lineGap: LINE_GAP,
          });
        checkPage(doc);
      } else {
        index += 1; bulletLi = ''; leftLi = 23; if (index === 1) { bulletLi = bullet + '  '; leftLi = 10; }
        doc.font(font)
          .fontSize(size)
          .fillColor(color)
          .text(`${bulletLi}${beforeMatch}`,
            left + leftLi,
            doc.y, {
            width: width,
            align: align,
            lineGap: LINE_GAP,
            continued: true,
          });
        checkPage(doc);
      }
    }

    if (match[1]) {
      index += 1;
      doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrFirst);
      checkPage(doc);
      if (match[2]) {
        doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrSecond);
        checkPage(doc);
      }
    } else if (match[3]) {
      index += 1; bulletLi = ''; leftLi = 23; if (index === 1) { bulletLi = bullet + '  '; leftLi = 10; }
      doc.font('ARIALBD')
        .fontSize(size)
        .fillColor(color)
        .text(`${bulletLi}${match[3]}`,
          left + leftLi,
          doc.y, {
          width: width,
          align: align,
          lineGap: LINE_GAP,
          continued: !nextMatchBr && !lastMatch
        });
      checkPage(doc);
    } else if (match[4]) {
      index += 1; bulletLi = ''; leftLi = 23; if (index === 1) { bulletLi = bullet + '  '; leftLi = 10; }
      doc.font('ARIALI')
        .fontSize(size)
        .fillColor(color)
        .text(`${bulletLi}${match[4]}`,
          left + leftLi,
          doc.y, {
          width: width,
          align: align,
          lineGap: LINE_GAP,
          continued: !nextMatchBr && !lastMatch
        });
      checkPage(doc);
    } else if (match[5]) {
      doc.font(font)
        .fontSize(size)
        .fillColor(COLOR_HREF)
        .text(match[6], {
          link: match[5],
          underline: true,
          lineGap: LINE_GAP,
        });
      checkPage(doc);
    }
    lastIndex = regex.lastIndex;

  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
    index += 1; bulletLi = ''; leftLi = 23; if (index === 1) { bulletLi = bullet + '  '; leftLi = 10; }
    doc.font(font)
      .fontSize(size)
      .fillColor(color)
      .text(`${bulletLi}${afterMatch}`,
        left + leftLi,
        doc.y, {
        width: width,
        align: align,
        lineGap: LINE_GAP,
      });
    checkPage(doc);
  }

}

function writeTextUl(doc, text, font, color, width, size, left, align) {
  const regex = /(<br>)|<strong>(.*?)<\/strong>|<em>(.*?)<\/em>|<li>(.*?)<\/li>/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const beforeMatch = text.substring(lastIndex, match.index);
    if (beforeMatch) {
    }

    if (match[1]) {
    } else if (match[2]) {
    } else if (match[3]) {
    } else if (match[4]) {
      writeTextLi(doc, match[4], font, color, width, size, left, align);
      doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrSecond);
      checkPage(doc);
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
  }
}

function writeTextP(doc, text, font, color, width, size, left, align) {

  const regex = /(<br>)(<br>)?|<strong>(.*?)<\/strong>|<em>(.*?)<\/em>|<a\s+href="([^"]+)">(.*?)<\/a>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const beforeMatch = text.substring(lastIndex, match.index);
    const nextMatchBr = text.substring(match.index + match[0].length).trim().startsWith('<br>');
    let lastMatch = regex.lastIndex === text.length;

    if (beforeMatch) {
      if (match[1]) {
        doc.font(font)
          .fontSize(size)
          .fillColor(color)
          .text(beforeMatch,
            left,
            doc.y, {
            width: width,
            align: align,
            lineGap: LINE_GAP,
          });
        checkPage(doc);
      } else {
        doc.font(font)
          .fontSize(size)
          .fillColor(color)
          .text(beforeMatch,
            left,
            doc.y, {
            width: width,
            align: align,
            lineGap: LINE_GAP,
            continued: true
          });
        checkPage(doc);
      }
    }

    if (match[1]) {
      doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrFirst);
      checkPage(doc);
      if (match[2]) {
        doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrSecond);
        checkPage(doc);
      }
    } else if (match[3]) {
      doc.font('ARIALBD')
        .fontSize(size)
        .fillColor(color)
        .text(match[3],
          left,
          doc.y, {
          width: width,
          align: align,
          lineGap: LINE_GAP,
          continued: !nextMatchBr && !lastMatch
        });
      checkPage(doc);
    } else if (match[4]) {
      doc.font('ARIALI')
        .fontSize(size)
        .fillColor(color)
        .text(match[4],
          left,
          doc.y, {
          width: width,
          align: align,
          lineGap: LINE_GAP,
          continued: !nextMatchBr && !lastMatch
        });
      checkPage(doc);
    } else if (match[5]) {
      doc.font(font)
        .fontSize(size)
        .fillColor(COLOR_HREF)
        .text(match[6], {
          link: match[5],
          underline: true,
          lineGap: LINE_GAP,
        });
      checkPage(doc);
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
    doc.font(font)
      .fontSize(size)
      .fillColor(color)
      .text(afterMatch,
        left,
        doc.y, {
        width: width,
        align: align,
        lineGap: LINE_GAP,
      });
    checkPage(doc);
  }
}

function writeText(doc, text, font, color, width, size, left, align) {
  const regex = /<p>(.*?)<\/p>|(<br>)|<ul>(.*?)<\/ul>/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const beforeMatch = text.substring(lastIndex, match.index);
    if (beforeMatch) {
    }

    if (match[1]) {
      writeTextP(doc, match[1], font, color, width, size, left, align);
    } else if (match[2]) {
    } else if (match[3]) {
      writeTextUl(doc, match[3], font, color, width, size, left, align);
    }

    lastIndex = regex.lastIndex;
  }

  const afterMatch = text.substring(lastIndex);
  if (afterMatch) {
  }
}

function checkPage(doc) {
  if (doc.y + 50 > doc.page.height - PDF_BOTTOM) {
    addNewPage(doc);
  }
}

function addNewPage(doc) {
  doc.addPage({
    size: PDF_SIZE,
    top: PDF_TOP,
    bottom: PDF_BOTTOM,
    left: PDF_LEFT,
    right: PDF_RIGHT,
  });
}

function checkPageNew(doc) {
  doc.addPage({
    size: 'A4',
    margins: {
      top: PDF_TOP,
      bottom: PDF_BOTTOM,
      left: PDF_LEFT,
      right: PDF_RIGHT,
    }
  });
}

function generatePDF(data, outputPath, callback) {
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  const doc = new PDFDocument({
    size: PDF_SIZE,
    margins: {
      top: PDF_TOP,
      bottom: PDF_BOTTOM,
      left: PDF_LEFT,
      right: PDF_RIGHT,
    }
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  doc.registerFont('ARIAL', ARIAL);
  doc.registerFont('ARIALBD', ARIALBD);
  doc.registerFont('ARIALBI', ARIALBI);
  doc.registerFont('ARIALI', ARIALI);


  let pageWidth = doc.page.width;
  let pageHeight = doc.page.height;

  let marginLeft = doc.page.margins.left;
  let marginRight = doc.page.margins.right;
  let marginTop = doc.page.margins.top;
  let marginBottom = doc.page.margins.bottom;

  let contentWidth = pageWidth - marginLeft - marginRight;
  let contentHeight = pageHeight - marginTop - marginBottom;

  // let textWidth = 0;
  // let xCentered = 0;
  // let lineHeight = 0;
  // let spaceAdded = 0;
  // let textWidthItem = 200;
  // let pathImages = 'D:/chendra/02-applications/201-admin/01-data/admin/features/images/tutorials/';
  // let releaseDate = data.releaseDate;

  data.elements.forEach((element, index) => {

    let typeimage = element.typeimage;
    let typetext = element.typetext;
    let typeintro = element.typeintro;
    let typecode = element.typecode;
    let typechapter = element.typechapter;
    let typesignup = element.typesignup;

    let linkable = element.linkable;
    let title = element.title;
    let content = element.content;
    content = sanitize(content);

    // let itemTitleText = element.title;
    // let codefilename = element.codefilename;
    // let nameimage = element.nameimage;
    // let libelleImage = element.libelleimage;
    // let chapternameimage = element.chapternameimage;

    let displayIntro = false;
    let displayText = false;
    let displayChapter = false;
    let displayImage = false;
    let displayCode = false;


    if (!typeimage && !typeintro && !typecode && !typechapter && !typesignup) {
      if (typetext) {
        displayText = true;
      }
    }

    // if (!typeimage && typeintro && !typecode && !typechapter && !typesignup) {
    //   if (typetext) {
    //     displayIntro = true;
    //   }
    // }


    // if (typechapter) {
    //   displayChapter = true;
    // }

    // if (typeimage) {
    //   displayImage = true;
    // }

    // if (typecode) {
    //   displayCode = true;
    // }

    // A3
    // doc.font('ARIAL').fontSize(20).fillColor('black')
    //   .text('abcdefghijklmnopqrstuvwxyz-abcdefghijklmnopqrstuvwxyz-abcdefghi', 
    //     0, 0, 
    //     { width: 612 });

    // A4
    // doc.font('ARIAL').fontSize(20).fillColor('black')
    //   .text('abcdefghijklmnopqrstuvwxyz-abcdefghijklmnopqrstuvwxyz-abcdefg', 
    //     0, 0, 
    //     { width: 595 });

    if (displayText) {

      let textHeight = 0;
      xCentered = marginLeft + (contentWidth - PDF_INTRO.titleWidth) / 2;
      if (linkable) {
        doc.font(PDF_INTRO.titleFont).fontSize(PDF_INTRO.titleSize);
        textHeight = doc.heightOfString(`${index}-${title}`, {
          width: PDF_INTRO.titleWidth,
          align: 'center',
          lineGap: 3,
        });
      }
      content = addParagraph(content);
      content = sanitize(content);
      doc.font(PDF_INTRO.textFont).fontSize(PDF_INTRO.textSize);
      textHeight += doc.heightOfString(`${content}`, {
        width: PDF_INTRO.textWidth,
        align: 'left',
        lineGap: 3,
      });
      lineHeight = doc.currentLineHeight();
      if (linkable) {
        spaceAdded = PDF_DOWN.sizeBrSecond * lineHeight;
        textHeight = textHeight + spaceAdded;
      }
      while (doc.y + textHeight > contentHeight) {
        checkPageNew(doc);
        textHeight -= contentHeight;
      }
      if (linkable) {
        doc.font(PDF_INTRO.titleFont).fontSize(PDF_INTRO.titleSize);
        doc.fillColor(PDF_INTRO.titleColor)
          .text(`${index}-${title}`, xCentered, doc.y, {
            width: PDF_INTRO.titleWidth,
            align: 'center',
            lineGap: 3,
          });
        doc.font(PDF_DOWN.sizeFont).moveDown(PDF_DOWN.sizeBrSecond);
      } else {
        addLine('grey', doc, doc.y, 1);
      }
      writeText(doc,
        content,
        PDF_INTRO.textFont,
        PDF_INTRO.textColor,
        PDF_INTRO.textWidth,
        PDF_INTRO.textSize,
        PDF_INTRO.textLeft,
      );
    }


    // if (displayText) {
    //   doc.font('ARIAL').fontSize(20).fillColor('black')
    //     .text('abcdefghijklmnopqrstuvwxyz-abcdefghijklmnopqrstuvwxyz-abcdefg',
    //       0, 0,
    //       { width: 595 });
    // }


  })

  doc.end();
  stream.on('finish', () => {
    if (callback) callback();
  });
}


module.exports = {
  generatePDF,
};


