# Интеграция Google Drive API для пака материалов

## Шаг 1: Создание проекта в Google Cloud Console

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Google Drive API**:
   - Перейдите в "APIs & Services" → "Library"
   - Найдите "Google Drive API"
   - Нажмите "Enable"

## Шаг 2: Создание API ключа

### Вариант A: API ключ (для публичных файлов)

1. Перейдите в "APIs & Services" → "Credentials"
2. Нажмите "Create Credentials" → "API Key"
3. Скопируйте ключ
4. Ограничьте ключ (рекомендуется):
   - "Application restrictions" → "HTTP referrers"
   - Добавьте ваш домен
   - "API restrictions" → "Restrict key" → выберите "Google Drive API"

### Вариант B: OAuth 2.0 (для приватных файлов)

1. Создайте "OAuth 2.0 Client ID"
2. Выберите "Web application"
3. Добавьте авторизованные домены
4. Скопируйте Client ID

## Шаг 3: Подготовка файлов на Google Drive

### 3.1. Структура папок

Создайте на Google Drive структуру:

```
📁 Design Pack/
  ├── 📁 Fonts/
  │   ├── neon-font.ttf
  │   ├── retro-font.ttf
  │   └── grunge-font.ttf
  ├── 📁 Textures/
  │   ├── concrete.jpg
  │   ├── marble.jpg
  │   └── wood.jpg
  ├── 📁 Brushes/
  │   ├── gradient-brushes.abr
  │   ├── watercolor.abr
  │   └── neon-brushes.abr
  └── 📁 Icons/
      ├── cyberpunk-icons.zip
      ├── minimal-icons.zip
      └── 3d-icons.zip
```

### 3.2. Сделайте файлы публичными

**Для каждой папки и файла:**
1. Правый клик → "Share"
2. "General access" → "Anyone with the link"
3. Role: "Viewer"
4. Скопируйте ссылку

### 3.3. Получите ID файлов и папок

Из ссылки типа:
```
https://drive.google.com/file/d/1ABC123xyz.../view?usp=sharing
```

ID файла: `1ABC123xyz...`

Из ссылки папки:
```
https://drive.google.com/drive/folders/1FOLDER_ID_HERE
```

ID папки: `1FOLDER_ID_HERE`

## Шаг 4: Настройка в приложении

### 4.1. Создайте .env файл

```env
VITE_GOOGLE_API_KEY=ваш_api_ключ_здесь
VITE_GOOGLE_DRIVE_FOLDER_ID=id_главной_папки
```

### 4.2. Установите зависимости

```bash
npm install gapi-script
```

## Шаг 5: Структура данных

Создайте JSON файл с метаданными ваших файлов:

```json
{
  "materials": [
    {
      "id": 1,
      "name": "Неоновые шрифты",
      "category": "Шрифты",
      "size": "2.5 MB",
      "fileId": "1ABC123...",
      "preview": "https://drive.google.com/thumbnail?id=1PREVIEW_ID"
    },
    {
      "id": 2,
      "name": "Текстуры бетона",
      "category": "Текстуры",
      "size": "15 MB",
      "fileId": "1XYZ789...",
      "preview": "https://drive.google.com/thumbnail?id=2PREVIEW_ID"
    }
  ]
}
```

## Шаг 6: Пример кода

### Инициализация Google API

```javascript
import { gapi } from 'gapi-script';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

function initGoogleDrive() {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    });
  });
}
```

### Получение списка файлов из папки

```javascript
async function listFilesFromFolder(folderId) {
  const response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, size, thumbnailLink)',
  });
  return response.result.files;
}
```

### Скачивание файла

```javascript
function downloadFile(fileId, fileName) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}
```

## Альтернативный метод (БЕЗ библиотек)

### Прямые ссылки на скачивание

Для публичных файлов можно использовать прямые ссылки:

```javascript
// Для маленьких файлов (< 100MB)
const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

// Для больших файлов
const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
```

### Получение превью

```javascript
const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
```

## Готовый шаблон данных

```javascript
const MATERIALS = [
  {
    id: 1,
    name: "Неоновые шрифты",
    category: "Шрифты",
    size: "2.5 MB",
    fileId: "ЗАМЕНИТЕ_НА_ВАШ_FILE_ID",
    downloadUrl: "https://drive.google.com/uc?export=download&id=ЗАМЕНИТЕ_НА_ВАШ_FILE_ID",
    preview: "https://drive.google.com/thumbnail?id=ЗАМЕНИТЕ_НА_ВАШ_FILE_ID&sz=w400"
  },
  // ... остальные файлы
];
```

## Быстрый старт (самый простой способ)

1. Загрузите все файлы на Google Drive
2. Сделайте их публичными (Anyone with the link)
3. Получите ID каждого файла из ссылки
4. Замените `fileId` в массиве `DESIGN_PACK_MATERIALS` в `App.jsx`
5. Готово! 🎉

## Безопасность

⚠️ **Важно:**
- Не храните приватные ключи в клиентском коде
- Используйте ограничения API ключа по доменам
- Для приватных файлов используйте OAuth 2.0
- Рассмотрите использование серверного API для большей безопасности

## Лимиты Google Drive API

- **API ключ**: 1000 запросов в день (бесплатно)
- **Квота**: 20,000 запросов на 100 секунд
- **Хранилище**: 15 GB бесплатно

Для большего количества запросов потребуется платный аккаунт.
