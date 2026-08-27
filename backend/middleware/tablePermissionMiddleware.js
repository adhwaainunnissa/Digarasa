const {
    isEditableTable,
} = require("../config/tablePermissions");

const tablePermissionMiddleware = (
    req,
    res,
    next
) => {

    const table = req.params.table;

    if (!isEditableTable(table)) {

        return res.status(403).json({
            message:
                `Tabel "${table}" bersifat read-only melalui aplikasi web.`,
        });
    }

    next();
};

module.exports =
    tablePermissionMiddleware;