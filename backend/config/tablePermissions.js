// ========================================
// TABEL YANG BOLEH DIUBAH DARI WEB
// ========================================
//
// Isi daftar ini berdasarkan persetujuan
// kebutuhan sistem / mentor.
//
// Contoh:
//
// DEVICE_PROSIS
// SKEMA
// SKEMA_MT
//
// Jangan masukkan tabel history/monitoring
// sebelum dipastikan aman.
//

const editableTables = [
    "DEVICE_PROSIS",
    // "SKEMA",
    // "SKEMA_MT",
];


// ========================================
// TABEL READ-ONLY
// ========================================
//
// Tidak perlu ditulis semua di sini.
// Semua tabel yang TIDAK ada di editableTables
// otomatis dianggap read-only.
//

const isEditableTable = (tableName) => {
    return editableTables.includes(tableName);
};

module.exports = {
    editableTables,
    isEditableTable,
};