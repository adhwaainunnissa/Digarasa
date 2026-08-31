const allowedTables = [
    "DEVICE_PROSIS",
    "SKEMA",
    "SKEMA_MT",
    "SKEMA_RELE",
    "Skema_RTAC",
];

const isAllowedTable = (tableName) => {
    return allowedTables.includes(tableName);
};

module.exports = {
    allowedTables,
    isAllowedTable,
};