const adminService = require("../services/adminService");

// ========================================
// GET USERS
// ========================================

exports.getUsers = async (req, res) => {
    try {
        const users = await adminService.getUsers();

        res.json(users);

    } catch (err) {
        console.error(
            "Gagal mengambil data admin:",
            err
        );

        res.status(500).json({
            message: "Gagal mengambil data user",
            error: err.message,
        });
    }
};