// Google Apps Script для обработки RSVP гостей

/**
 * Функция для обработки POST запроса из Flask приложения
 */
function doPost(e) {
  try {
    // Получаем данные из параметров формы (form-data)
    const data = {
      timestamp: e.parameter.timestamp,
      firstName: e.parameter.firstName,
      lastName: e.parameter.lastName,
      attendance: e.parameter.attendance,
      guestCount: parseInt(e.parameter.guestCount) || 1,
      message: e.parameter.message || ''
    };
    
    // Открываем активный лист Google Таблицы
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Проверяем, есть ли заголовки
    if (sheet.getLastRow() === 0) {
      initializeHeaders(sheet);
    }
    
    // Добавляем новую строку с данными гостя
    sheet.appendRow([
      data.timestamp,           // Время регистрации
      data.firstName,           // Имя
      data.lastName,            // Фамилия
      data.attendance,          // Присутствует (Да/Нет)
      data.guestCount,          // Количество гостей
      data.message              // Пожелание
    ]);
    
    // Форматируем новую строку
    formatLastRow(sheet);
    
    // Обновляем статистику
    updateStatistics(sheet);
    
    // Возвращаем успешный ответ
    return ContentService.createTextOutput('OK - Гость добавлен успешно')
      .setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    Logger.log('Ошибка при добавлении гостя: ' + error);
    return ContentService.createTextOutput('Ошибка: ' + error)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}


/**
 * Инициализировать заголовки в таблице
 */
function initializeHeaders(sheet) {
  const headers = [
    'Время регистрации',
    'Имя',
    'Фамилия',
    'Присутствует',
    'Кол-во гостей',
    'Пожелание'
  ];
  
  sheet.appendRow(headers);
  
  // Форматируем заголовок
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#d4af37')  // Золотой цвет
    .setFontColor('#ffffff')             // Белый текст
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center');
}


/**
 * Форматирование последней добавленной строки
 */
function formatLastRow(sheet) {
  const lastRow = sheet.getLastRow();
  const lastRange = sheet.getRange(lastRow, 1, 1, 6);
  
  // Чередуемые цвета строк для лучшей читаемости
  if (lastRow % 2 === 0) {
    lastRange.setBackground('#f5f5f5');  // Светло-серый
  } else {
    lastRange.setBackground('#ffffff');  // Белый
  }
  
  lastRange.setFontSize(11)
    .setVerticalAlignment('middle')
    .setBorder(null, null, null, null, true, true);
  
  // Центрируем ячейки для присутствия и кол-ва гостей
  sheet.getRange(lastRow, 4, 1, 1).setHorizontalAlignment('center');
  sheet.getRange(lastRow, 5, 1, 1).setHorizontalAlignment('center');
}


/**
 * Обновляем статистику (лист "Статистика")
 */
function updateStatistics(sheet) {
  let statsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Статистика');
  
  // Если листа со статистикой нет, создаём его
  if (!statsSheet) {
    statsSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Статистика');
    initializeStats(statsSheet);
  }
  
  // Подсчитываем статистику с основного листа
  const data = sheet.getDataRange().getValues();
  let attending = 0;
  let notAttending = 0;
  let totalGuests = 0;
  
  // Пропускаем заголовок (первая строка)
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === 'Да') {
      attending++;
      totalGuests += parseInt(data[i][4]) || 1;
    } else if (data[i][3] === 'Нет') {
      notAttending++;
    }
  }
  
  // Обновляем значения в статистике
  statsSheet.getRange('B2').setValue(attending);
  statsSheet.getRange('B3').setValue(notAttending);
  statsSheet.getRange('B4').setValue(totalGuests);
  statsSheet.getRange('B5').setValue(data.length - 1);  // Всего ответов
}


/**
 * Инициализировать лист со статистикой
 */
function initializeStats(sheet) {
  const labels = [
    ['Статистика гостей', ''],
    ['Согласных приехать', 0],
    ['Не согласных', 0],
    ['Всего гостей (с +1)', 0],
    ['Всего ответов', 0]
  ];
  
  for (let i = 0; i < labels.length; i++) {
    sheet.appendRow(labels[i]);
  }
  
  // Форматируем статистику
  const titleRange = sheet.getRange('A1:B1');
  titleRange.setBackground('#d4af37')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');
  
  const labelRange = sheet.getRange('A2:A5');
  labelRange.setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#efefef');
  
  const valueRange = sheet.getRange('B2:B5');
  valueRange.setFontSize(12)
    .setHorizontalAlignment('center')
    .setNumberFormat('0');
  
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 150);
}


/**
 * Тестирование webhook (вызови эту функцию, чтобы проверить доступность)
 */
function test() {
  const testData = {
    timestamp: new Date().toLocaleString('ru-RU'),
    firstName: 'Иван',
    lastName: 'Петров',
    attendance: 'Да',
    guestCount: 2,
    message: 'Очень рады на свадьбу!'
  };
  
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Проверяем и инициализируем
  if (sheet.getLastRow() === 0) {
    initializeHeaders(sheet);
  }
  
  // Добавляем тестовые данные
  sheet.appendRow([
    testData.timestamp,
    testData.firstName,
    testData.lastName,
    testData.attendance,
    testData.guestCount,
    testData.message
  ]);
  
  formatLastRow(sheet);
  updateStatistics(sheet);
  
  Logger.log('Тест завершён успешно!');
}

/**
 * Функция для GET запроса (для проверки доступности webhook)
 */
function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script webhook готов к работе ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
