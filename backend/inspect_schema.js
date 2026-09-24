const db = require('./config/db');

async function inspect() {
  const tables = ['SKEMA', 'SKEMA_MT', 'SKEMA_RELE', 'Skema_RTAC', 'subsistem', 'DEVICE_PROSIS'];
  for (const t of tables) {
    try {
      const q = 'SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position';
      const r = await db.query(q, ['public', t]);
      console.log('=== TABLE:', t);
      if (r.rows.length === 0) {
        console.log('  (no columns / table not found)');
      } else {
        r.rows.forEach(c => console.log(' -', c.column_name, '|', c.data_type, '| nullable:', c.is_nullable, '| default:', c.column_default));
      }
    } catch(e) { console.error(t, e.message); }
  }
  process.exit(0);
}

inspect();
