import dotenv from "dotenv";
import db from "../db/index.js";
import bcrypt from "bcrypt";

dotenv.config();

class UsersController {

    //Get all the users
    static async apiGetUsers(req, res) {
        //req: {}
        try {
            const users = await db.helper.query("*", "users");
            if (!users) return res.status(204).send();
            return res.status(200).json(users);
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }

    //Create a user
    static async apiCreateUser(req, res) {
        //req.body: {*name, *password}
        const name = req.body.name;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // const result = await db.insertUser(name, hashedPassword);
            const result = await db.helper.insert("users", {name: name, password: hashedPassword})
            if (!result) return res.status(500).send();
            return res.status(200).json({
                statusType: "SUCC",
                statusDetails: ""
            });
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }

    //Delete a user
    static async apiDeleteUser(req, res) {
        //req.body: {*name, *password}
        const name = req.body.name;
        const password = req.body.password;

        try {
            const user = await db.helper.query("*", "users", `name='${name}'`, 1);

            //Check if the user exists
            if (!user) return res.status(404).json({
                statusType: "ERR",
                statusDetail: "User doesn't exist"
            });

            //Compare user password with given password
            if (!await bcrypt.compare(password, user.password)) return res.status(401).json({
                statusType: "ERR",
                statusDetail: "Cannot delete unverified user"
            })
            else {
                //Delete the user
                try {
                    const result = await db.helper.delete("users", `id='${user.id}'`);
                    if (!result) return res.status(500).send();
                    return res.status(200).send({
                        statusType: "SUCC",
                        statusDetails: ""
                    });
                } catch (e) {
                    return res.status(500).send({error: e});
                }
            }
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }
}

export default UsersController;