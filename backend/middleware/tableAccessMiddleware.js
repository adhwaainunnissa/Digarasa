const {
    isAllowedTable,
} = require("../config/tableConfig");

const tableAccessMiddleware = (
    req,
    res,
    next
) => {

    const table =
        req.params.table;

    if (!isAllowedTable(table)) {
        return res.status(403).json({
            message:
                `Tabel "${table}" tidak termasuk dalam tabel yang digunakan aplikasi.`,
        });
    }

    next();
};

module.exports =
    tableAccessMiddleware;