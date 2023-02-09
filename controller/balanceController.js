import dotenv from "dotenv";
import db from "../db/index.js";

dotenv.config();

class balanceController {
    //Get balance information of a user
    static async apiGetBalancesOfUser(req, res) {
        //req.params: {*user_id}
        const user_id = req.params.user_id;

        try {
            const balanceOfUser = await db.helper.query("*", "balances", `user_id='${user_id}'`);
            if (!balanceOfUser) return res.status(204).send();
            return res.status(200).json(balanceOfUser);
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }

    //create a balance
    static async apiCreateBalance(req, res) {
        //req.params: {*user_id}
        //req.body:: {*name, credit}
        const user_id = req.params.user_id;
        const {name, credit} = req.body;

        const data = {
            name: name,
            credit: credit,
            user_id: user_id
        };

        try {
            const result = await db.helper.insert("balances", data)
            if (!result) return res.status(500).send();
            return res.status(200).json({
                statusType: "SUCC",
                statusDetails: ""
            });
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }

    //Get balance
    static async apiGetBalance(req, res) {
        //req.params: {*id}
        const id = req.params.id

        try {
            const balance = await db.helper.query("*", "balances", `id='${id}'`, 1)
            if (!balance) return res.status(204).send();
            return res.status(200).json(balance)
        }catch (e) {
            return res.status(500).send({error: e});
        }
    }

    //Update balance
    static async apiUpdateBalance(req, res) {
        //req.params: {*id}
        //req.body:: {name, credit}
        const id = req.params.id;
        const {name, credit} = req.body;

        const data = {
            name: name,
            credit: credit
        };

        try {
            const result = await db.helper.update("balances", data, `id='${id}'`);
            if (!result) return res.status(204).send();
            return res.status(200).json({
                statusType: "SUCC",
                statusDetails: ""
            });
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }

    //Delete balance
    static async apiDeleteBalance(req, res) {
        //req.params: {*id}
        const id = req.params.id;

        try {
            const result = await db.helper.delete("balances", `id='${id}'`);
            if (!result) return res.status(500).send();
            return res.status(204).send();
        } catch (e) {
            return res.status(500).send({error: e});
        }
    }
}

export default balanceController;