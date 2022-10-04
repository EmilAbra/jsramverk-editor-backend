const express = require('express');
const router = express.Router();

const usersModel = require("../models/usersModel");

router.post(
    "/register",
    async (req, res) => {
        const body = req.body;

        await usersModel.register(res, body);
        // return res.json({ data: result });
    }
);

router.post(
    "/login",
    async (req, res) => {
        const body = req.body;

        await usersModel.login(res, body);

        // return result;        
    }
);

router.get(
    "/user/:user",
    async (req, res) => {
        const userName = req.params.user;

        await usersModel.getUser(res, userName);
    }
);

module.exports = router;