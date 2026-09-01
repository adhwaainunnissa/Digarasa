const skemaService =
    require("../services/skemaService");

exports.getSubsistem = async (req, res) => {
    try {

        const result =
            await skemaService.getSubsistem(
                req.query.search || ""
            );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                "Gagal mengambil subsistem",
            error: err.message,
        });
    }
};


exports.getSkema = async (req, res) => {
    try {

        const result =
            await skemaService.getSkema({
                page:
                    req.query.page || 1,

                limit:
                    req.query.limit || 20,

                search:
                    req.query.search || "",
            });

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                "Gagal mengambil SKEMA",
            error: err.message,
        });
    }
};


exports.getSkemaById = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.getSkemaById(
                req.params.id
            );

        res.json(result);

    } catch (err) {

        res.status(404).json({
            message: err.message,
        });
    }
};


exports.getSkemaMT = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.getSkemaMT(
                req.params.id
            );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                "Gagal mengambil detail MT",
            error: err.message,
        });
    }
};


exports.getSkemaRele = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.getSkemaRele(
                req.params.id
            );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                "Gagal mengambil detail RELE",
            error: err.message,
        });
    }
};


exports.getSkemaRTAC = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.getSkemaRTAC(
                req.params.skemaName
            );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                "Gagal mengambil detail RTAC",
            error: err.message,
        });
    }
};


exports.createSkema = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.createSkema(
                req.body
            );

        res.status(201).json({
            message:
                "Skema berhasil ditambahkan.",
            data: result,
        });

    } catch (err) {

        console.error(err);

        res.status(400).json({
            message: err.message,
        });
    }
};


exports.updateSkema = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.updateSkema(
                req.params.id,
                req.body
            );

        res.json({
            message:
                "Skema berhasil diperbarui.",
            data: result,
        });

    } catch (err) {

        console.error(err);

        res.status(400).json({
            message: err.message,
        });
    }
};


exports.deleteSkema = async (
    req,
    res
) => {

    try {

        const result =
            await skemaService.deleteSkema(
                req.params.id
            );

        res.json({
            message:
                "Skema berhasil dihapus.",
            data: result,
        });

    } catch (err) {

        console.error(err);

        res.status(400).json({
            message: err.message,
        });
    }
};