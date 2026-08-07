const login = (req, res) => {

    const { email, password } = req.body;

    if(email === "admin@pln.co.id" && password === "123456"){

        return res.json({
            success:true,
            message:"Login Berhasil",
            user:{
                nama:"Admin PLN",
                email
            }
        });

    }

    return res.status(401).json({
        success:false,
        message:"Email atau Password Salah"
    });

}

module.exports = {
    login
}