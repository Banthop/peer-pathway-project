import fs from 'fs';

const filePath = '/Users/dongraham/Desktop/peer-pathway-project/final-subpage.html';
let content = fs.readFileSync(filePath, 'utf8');

// Replace isolated dashes
content = content.replace(/ \- /g, ', ');
content = content.replace(/ \– /g, ', ');
content = content.replace(/ \— /g, ', ');
content = content.replace(/—/g, ', ');
content = content.replace(/–/g, '-');

// Fix specific awkwardly introduced commas from the dash replace
content = content.replace(/Not overnight, but/g, 'Not overnight, but');
content = content.replace(/smaller firms, hedge funds/g, 'smaller firms: hedge funds');
content = content.replace(/simple, but it works/g, 'simple, but it works');
content = content.replace(/Don, our cofounder/g, 'Don, our cofounder');

// Re-write file
fs.writeFileSync(filePath, content);
console.log('Fixed em dashes.');
