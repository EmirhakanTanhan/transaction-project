import dotenv from "dotenv";
import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

class AuthController {

    //Generate access token
    static generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    }

    //Get a new access token with a refresh token
    static async apiRefreshAuth(req, res) {
        //req.body: {*token}
        const refreshToken = req.body.token;
        if (!refreshToken) return res.status(401).send();
        if (!await db.helper.query("refreshToken", "tokens", `refreshToken='${refreshToken}'`)) return res.status(403).send();

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send();
            const accessToken = AuthController.generateAccessToken({name: user.name});
            res.status(200).json({
                accessToken: accessToken
            })
        });
    }

    //Logout the user
    static async apiLogoutUser(req, res) {
        //req.body: {*token}
        const refreshToken = req.body.token;
        try {
            //Delete refresh token from database
            const result = await db.helper.delete("tokens", `refreshToken='${refreshToken}'`);
            if (!result) return res.status(500).send();
            return res.status(204).send();
        } catch (e) {
            return res.status(500).send({error: e})
        }
    }

    //Login the user
    static async apiLoginUser(req, res) {
        //req.body: {*name, *password}
        const name = req.body.name;
        const password = req.body.password;

        try {
            const user = await db.helper.query("*", "users", `name='${name}'`, 1);
            const jwtUser = {
                name: user.name
            }

            //Check if the user exists
            if (!user) res.json({
                statusType: "ERR",
                statusDetail: "User doesn't exist"
            });

            //Compare user password with given password
            if (await bcrypt.compare(password, user.password)) {
                const accessToken = AuthController.generateAccessToken(jwtUser)
                const refreshToken = jwt.sign(jwtUser, process.env.REFRESH_TOKEN_SECRET);

                //Store refresh token in database
                try {
                    const result = await db.helper.insert("tokens", {refreshToken})
                    if (!result) return res.status(500).send();

                    return res.status(200).json({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                } catch (e) {
                    return res.status(500).send({error: e})
                }

            }
            else return res.status(401).json({
                statusType: "ERR",
                statusDetail: "Incorrect password"
            })
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }
}

export default AuthController;