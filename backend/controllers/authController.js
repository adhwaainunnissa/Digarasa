const authService = require("../services/authService");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

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