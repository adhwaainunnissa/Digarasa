const db = require('./config/db');

async function getSchemas() {
  const tables = [
    'OLS_STATIK', 'LIST_SW_OLS', 'His_Sw_OLS', 'RT_Sw_OLS',
    'UFR_1', 'UFR_4', 'UFR_5', 'UFR_6', 'UFR_7',
    'UP2D_UFR1', 'UP2D_UFR2', 'UP2D_UFR3',
    'His_HB_DS', 'RT_HB_DS', 'RTAC_IOTEK'
  ];

  for (const table of tables) {
    try {
      const res = await db.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      console.log(`\n=== TABLE: ${table} ===`);
      if (res.rows.length === 0) {
        console.log('No columns found (table might not exist).');
      } else {
        res.rows.forEach(r => {
          console.log(`- ${r.column_name} (${r.data_type}) [nullable: ${r.is_nullable}, default: ${r.column_default}]`);
        });
      }
    } catch (err) {
      console.error(`Error querying ${table}: ${err.message}`);
    }
  }

  process.exit(0);
}

getSchemas();
