import express from "express";
import AuthCtrl from "../controller/authController.js";
import UsersCtrl from "../controller/userController.js";

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

export default router;