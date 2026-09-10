const deviceService =
    require("../services/deviceService");


// ========================================
// GET DEVICES
// ========================================

exports.getDevices = async (req, res) => {
    try {

        const result =
            await deviceService.getDevices({
                page:
                    req.query.page || 1,

                limit:
                    req.query.limit || 20,

                search:
                    req.query.search || "",
            });

        res.json(result);

    } catch (err) {

        console.error(
            "Gagal mengambil DEVICE_PROSIS:",
            err
        );

        res.status(500).json({
            message:
                "Gagal mengambil data device.",
            error: err.message,
        });
    }
};


// ========================================
// GET DEVICE BY NO
// ========================================

exports.getDeviceByNo = async (req, res) => {
    try {

        const result =
            await deviceService.getDeviceByNo(
                req.params.no
            );

        res.json(result);

    } catch (err) {

        console.error(
            "Gagal mengambil detail device:",
            err
        );

        res.status(404).json({
            message: err.message,
        });
    }
};


// ========================================
// GET DEVICE USAGE
// ========================================

exports.getDeviceUsage = async (
    req,
    res
) => {

    try {

        const result =
            await deviceService.getDeviceUsage(
                req.params.no
            );

        res.json(result);

    } catch (err) {

        console.error(
            "Gagal mengambil penggunaan device:",
            err
        );

        res.status(500).json({
            message:
                "Gagal mengambil penggunaan device.",
            error: err.message,
        });
    }
};