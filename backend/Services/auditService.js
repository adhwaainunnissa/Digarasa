const db = require("../config/db");

exports.createLog = async ({
    userId,
    username,
    action,
    tableName = null,
    recordId = null,
    details = null,
}) => {
    await db.query(
        `
        INSERT INTO audit_logs
        (
            user_id,
            username,
            action,
            table_name,
            record_id,
            details
        )
        VALUES
        ($1, $2, $3, $4, $5, $6)
        `,
        [
            userId,
            username,
            action,
            tableName,
            recordId,
            details,
        ]
    );
};