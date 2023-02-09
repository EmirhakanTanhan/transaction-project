import express from "express";
import AuthCtrl from "../controller/authController.js";
import UsersCtrl from "../controller/userController.js";
import BalancesCtrl from "../controller/balanceController";

const router = express.Router();

// ## Authorization Operations ##
router.route('/login').post(AuthCtrl.apiLoginUser); //Login user
router.route('/logout').post(AuthCtrl.apiLogoutUser); //Logout user
router.route('/token').post(AuthCtrl.apiRefreshAuth); //Get a new access token

// ## User Operations ##
router.route('/users')
    .get(UsersCtrl.apiGetUsers) //Get all users
    .post(UsersCtrl.apiCreateUser) //Create a user
    .delete(UsersCtrl.apiDeleteUser); //Delete a user

// ## Balance Operations ##
router.route('/balances/:user_id')
    .get(BalancesCtrl.apiGetBalancesOfUser) //Get balances of a user
    .post(BalancesCtrl.apiCreateBalance); //Create a balance
router.route('/balances/:id')
    .get(BalancesCtrl.apiGetBalance) //Get a balance
    .put(BalancesCtrl.apiUpdateBalance) //Update a balance
    .delete(BalancesCtrl.apiDeleteBalance); //Delete a balance

export default router;