const db = require('./config/db');

async function inspectData() {
  try {
    // Check distinct GI values in DEVICE_PROSIS
    const gi = await db.query('SELECT DISTINCT gi FROM "DEVICE_PROSIS" WHERE gi IS NOT NULL ORDER BY gi LIMIT 30');
    console.log('=== DISTINCT GI (DEVICE_PROSIS):');
    gi.rows.forEach(r => console.log(' -', r.gi));

    // Check distinct jenis values
    const jenis = await db.query('SELECT DISTINCT jenis FROM "DEVICE_PROSIS" WHERE jenis IS NOT NULL ORDER BY jenis LIMIT 30');
    console.log('\n=== DISTINCT JENIS (DEVICE_PROSIS):');
    jenis.rows.forEach(r => console.log(' -', r.jenis));

    // Check distinct subsistem values
    const ss = await db.query('SELECT id_ss, subsistem FROM "subsistem" ORDER BY id_ss LIMIT 30');
    console.log('\n=== SUBSISTEM:');
    ss.rows.forEach(r => console.log(' -', r.id_ss, '|', r.subsistem));

    // Check sample SKEMA data
    const sk = await db.query('SELECT id_skema, skema, id_ss, aktif FROM "SKEMA" ORDER BY id_skema LIMIT 10');
    console.log('\n=== SAMPLE SKEMA:');
    sk.rows.forEach(r => console.log(' -', JSON.stringify(r)));

    // Check for backup tables
    const bt = await db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name ILIKE '%backup%' OR table_name ILIKE '%archive%' OR table_name ILIKE '%log%' ORDER BY table_name`);
    console.log('\n=== EXISTING BACKUP/LOG TABLES:');
    bt.rows.forEach(r => console.log(' -', r.table_name));

  } catch(e) { console.error(e.message); }
  process.exit(0);
}

inspectData();
