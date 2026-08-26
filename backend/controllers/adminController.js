const adminService = require("../Services/adminService");

// ========================================
// GET USERS
// ========================================

exports.getUsers = async (req, res) => {
    try {

        const users =
            await adminService.getUsers();

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


// ========================================
// CREATE USER
// ========================================

exports.createUser = async (req, res) => {

    try {

        const {
            username,
            password,
            nama_lengkap,
            role,
        } = req.body;

        const user =
            await adminService.createUser({
                username,
                password,
                nama_lengkap,
                role,
            });

        res.status(201).json({
            message:
                "User berhasil ditambahkan.",
            data: user,
        });

    } catch (err) {

        console.error(
            "Gagal menambahkan user:",
            err
        );

        res.status(400).json({
            message: err.message,
        });
    }
};


// ========================================
// DELETE USER
// ========================================

exports.deleteUser = async (req, res) => {

    try {

        const id =
            req.params.id;

        const currentUserId =
            req.user?.id;

        const user =
            await adminService.deleteUser(
                id,
                currentUserId
            );

        res.json({
            message:
                "User berhasil dihapus.",
            data: user,
        });

    } catch (err) {

        console.error(
            "Gagal menghapus user:",
            err
        );

        res.status(400).json({
            message: err.message,
        });
    }
};