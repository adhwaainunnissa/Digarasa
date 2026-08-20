const authService = require("../services/authService");

exports.login = async (req, res) => {
    try {
        
        const { username, password } = req.body || {};
        // Validasi input
        if (!username || !password) {
            return res.status(400).json({
                message: "Username dan password wajib diisi",
            });
        }

        const result = await authService.login(
            username,
            password
        );

        res.status(200).json({
            message: "Login berhasil",
            ...result,
        });

    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: err.message,
        });
    }
};
exports.me = async (req, res) => {
    res.json({
        user: req.user,
    });
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } =
            req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Password lama dan password baru wajib diisi",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message:
                    "Password baru minimal 8 karakter",
            });
        }

        const userId = req.user.id;

        await authService.changePassword(
            userId,
            currentPassword,
            newPassword
        );

        res.json({
            message:
                "Password berhasil diubah",
        });

    } catch (err) {
        console.error(err);

        res.status(400).json({
            message: err.message,
        });
    }
};