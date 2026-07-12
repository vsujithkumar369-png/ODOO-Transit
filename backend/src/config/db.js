const { DatabaseSync } = require('node:sqlite');
const env = require('./env');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../', env.databasePath);

// Ensure the target database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open the SQLite database connection
const db = new DatabaseSync(dbPath);

// Auto-run schema initialization
const schemaPath = path.resolve(__dirname, '../database/schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

// Export query helper mimicking pg format to maximize compatibility
const query = async (text, params = []) => {
  const sqliteText = text.replace(/\$\d+/g, '?');
  const stmt = db.prepare(sqliteText);
  const isSelect = sqliteText.trim().toLowerCase().startsWith('select') || 
                   sqliteText.trim().toLowerCase().startsWith('with');

  if (isSelect) {
    const rows = stmt.all(params);
    return { rows };
  } else {
    const info = stmt.run(params);
    return { 
      rows: [], 
      rowCount: info.changes, 
      lastInsertRowid: info.lastInsertRowid 
    };
  }
};

module.exports = {
  db,
  query
};
