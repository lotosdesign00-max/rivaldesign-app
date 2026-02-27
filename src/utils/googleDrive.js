// Google Drive API утилиты

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

/**
 * Получить список файлов из папки Google Drive
 * @param {string} folderId - ID папки на Google Drive
 * @returns {Promise<Array>} - Массив файлов
 */
export async function getFilesFromFolder(folderId) {
  try {
    const url = `https://www.googleapis.com/drive/v3/files?` + new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      key: GOOGLE_API_KEY,
      fields: 'files(id,name,mimeType,size,thumbnailLink,webContentLink)',
      orderBy: 'name'
    });

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Google Drive API error:', data.error);
      return [];
    }

    return data.files || [];
  } catch (error) {
    console.error('Error fetching files from Google Drive:', error);
    return [];
  }
}

/**
 * Получить список файлов из нескольких папок по категориям
 * @param {Object} folderIds - Объект с ID папок по категориям
 * @returns {Promise<Array>} - Массив материалов
 */
export async function getMaterialsFromDrive(folderIds) {
  const materials = [];
  let id = 1;

  for (const [category, folderId] of Object.entries(folderIds)) {
    const files = await getFilesFromFolder(folderId);
    
    files.forEach(file => {
      materials.push({
        id: id++,
        name: file.name,
        category: category,
        size: formatFileSize(file.size),
        fileId: file.id,
        preview: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
        mimeType: file.mimeType
      });
    });
  }

  return materials;
}

/**
 * Форматировать размер файла
 */
function formatFileSize(bytes) {
  if (!bytes) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Получить прямую ссылку на скачивание
 */
export function getDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Получить ссылку на превью
 */
export function getThumbnailUrl(fileId, size = 400) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}
