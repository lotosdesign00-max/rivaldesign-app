# 📦 Backup System / Система бэкапов

## 📁 Backup Location / Расположение бэкапов

All backups are stored in:
```
backups/
├── backup_2026-03-21_10-24-22/
├── backup_2026-03-21_10-27-48/
└── ...
```

## 🚀 How to Create Backup / Как создать бэкап

### Method 1: npm (Recommended)
```bash
npm run backup
```

### Method 2: Run .bat file
```
scripts/backup.bat
```

### Method 3: PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/backup.ps1
```

## 📋 What's Included / Что сохраняется

Each backup contains:
- ✅ **/src** — all React source files
- ✅ **package.json** — project dependencies
- ✅ **index.html** — main HTML file
- ✅ **vite.config.js** — Vite configuration
- ✅ **CHANGELOG.txt** — backup info

## 📝 Backup Structure

```
backup_2026-03-21_10-27-48/
├── src/
│   ├── App.jsx              ← Main component with Profile tab
│   ├── main.jsx
│   ├── config.js
│   ├── styles.css
│   ├── components/          ← All React components
│   ├── config/
│   ├── data/
│   └── utils/
├── package.json
├── index.html
├── vite.config.js
└── CHANGELOG.txt
```

## 💡 Best Practices

- ✅ Create backup **before** making major changes
- ✅ Keep last 5-10 versions
- ✅ Delete old backups to save space
- ✅ Rename important backups (e.g., `backup_2026-03-21_PROFILE_FEATURE`)

## 🔄 Restore from Backup

1. Find needed version in `backups/` folder
2. Copy contents to project root
3. Restart server: `npm run dev`

---

**Backup System Version:** 1.0
**Last Updated:** 2026-03-21
