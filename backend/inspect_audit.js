const db = require('./config/db');

async function inspectAudit() {
  try {
    const r = await db.query('SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = \'public\' AND table_name = \'audit_logs\' ORDER BY ordinal_position');
    console.log('=== audit_logs columns:');
    r.rows.forEach(c => console.log(' -', c.column_name, '|', c.data_type, '| default:', c.column_default));

    const s = await db.query('SELECT * FROM "audit_logs" LIMIT 3');
    console.log('\n=== Sample audit_logs:');
    s.rows.forEach(r => console.log(' -', JSON.stringify(r)));
  } catch(e) { console.error(e.message); }
  process.exit(0);
}

inspectAudit();
