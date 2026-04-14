const fs = require('fs');
const path = 'c:/Users/igors/Desktop/rivaldesign-app-main/legacy/AppLegacy.jsx';
let content = fs.readFileSync(path, 'utf8');

const fixedFaqData = `const FAQ_DATA = {
  ru: [
    { q: 'Как работает процесс заказа?', a: '1. Написать в Telegram\\n2. Обсудить детали\\n3. ТЗ и сроки\\n4. Предоплата 50%\\n5. 1-3 дня работы\\n6. До 3 правок бесплатно\\n7. Итоговый расчёт' },
    { q: 'Что я получу в итоге?', a: 'PSD/AI/AEP исходники, PNG/JPG/SVG, 3 бесплатных правки, поддержка' },
    { q: 'Способы оплаты?', a: 'Банковская карта, CryptoBot (USDT/TON/BTC), схема 50%+50%' },
    { q: 'Срочный заказ?', a: 'От 3 часов с надбавкой +20-50%' },
    { q: 'Форматы файлов?', a: 'PNG, JPG, SVG, PSD, AI, GIF, MP4 — любой по запросу' },
    { q: 'Конфиденциальность?', a: 'Не публикую без разрешения. NDA по запросу' },
    { q: 'Иностранные клиенты?', a: 'Да, оплата в USDT/USD, русский и английский язык' },
    { q: 'Сколько правок?', a: '3 бесплатных, дополнительные по договорённости' },
  ],
  en: [
    { q: 'How does the order process work?', a: '1. Message on Telegram\\n2. Discuss brief & timeline\\n3. 50% upfront\\n4. 1-3 days production\\n5. 3 free revisions\\n6. Final payment' },
    { q: 'What will I receive?', a: 'PSD/AI/AEP source files, PNG/JPG/SVG exports, 3 free revisions, support' },
    { q: 'Payment methods?', a: 'Any bank card, CryptoBot (USDT/TON/BTC), 50%+50% scheme' },
    { q: 'Urgent orders?', a: 'Rush from 3 hours with +20-50% surcharge' },
    { q: 'File formats?', a: 'PNG, JPG, SVG, PSD, AI, GIF, MP4 — any on request' },
    { q: 'Confidentiality?', a: 'No publishing without permission. NDA available' },
    { q: 'International clients?', a: 'Yes, USDT/USD payment, English & Russian' },
    { q: 'How many revisions?', a: '3 free, extra by agreement' },
  ],
};
FAQ_DATA.ua = FAQ_DATA.ru; FAQ_DATA.kz = FAQ_DATA.ru; FAQ_DATA.by = FAQ_DATA.ru;`;

const startIdx = content.indexOf('const FAQ_DATA = {');
const endStr = 'FAQ_DATA.ua = FAQ_DATA.ru; FAQ_DATA.kz = FAQ_DATA.ru; FAQ_DATA.by = FAQ_DATA.ru;';
const endIdx = content.indexOf(endStr) + endStr.length;

if (startIdx !== -1 && endIdx > startIdx) {
  content = content.slice(0, startIdx) + fixedFaqData + content.slice(endIdx);
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: Fixed FAQ_DATA. Replaced chars:', endIdx - startIdx, '-> new:', fixedFaqData.length);
} else {
  console.log('ERROR: startIdx=', startIdx, 'endIdx=', endIdx);
}
