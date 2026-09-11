const allowedTables = [
    "DEVICE_PROSIS",
    "SKEMA",
    "SKEMA_MT",
    "SKEMA_RELE",
    "Skema_RTAC",
    "subsistem",
    "OLS_STATIK",
    "LIST_SW_OLS",
    "His_HB_DS",
    "His_Sw_OLS",
    "RT_HB_DS",
    "RT_Sw_OLS",
    "RTAC_IOTEK",
    "UFR_1",
    "UFR_4",
    "UFR_5",
    "UFR_6",
    "UFR_7",
    "UP2D_UFR1",
    "UP2D_UFR2",
    "UP2D_UFR3",
];

const isAllowedTable = (tableName) => {
    return allowedTables.includes(tableName);
};

module.exports = {
    allowedTables,
    isAllowedTable,
};