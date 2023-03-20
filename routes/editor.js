const express = require('express');
const router = express.Router();

const docsModel = require('../models/docsModel');
const usersModel = require('../models/usersModel');
const mailModel = require('../models/mailinviteModel');

router.get(
    "/:user",
    (req, res, next) => usersModel.checkToken(req, res, next),
    async (req, res) => {
        const user = req.params.user;
        const docs = await docsModel.getAllDocs(user);

        return res.json({
            data: docs
        });
    }
);

router.get("/doc/:name", async (req, res) => {
    const name = req.params.name
    const docs = await docsModel.getOneDoc(name);

    return res.json({
        data: docs
    });
});

router.post("/", async (req, res) => {
    const newDoc = req.body;
    if (newDoc.name && newDoc.content) {
        const result = await docsModel.insertDoc(newDoc);
        return res.status(201).json({ data: result });
    } else {
        return res.status(400).json({ errors: {
            message: "Name and Content in editor is needed."
        }});
    }
});

router.put("/", async (req, res) => {
    const newDoc = req.body;
    const result = await docsModel.updateDoc(newDoc);
    return res.status(204).json({ data: result });
});

router.post("/mail_invite", async (req, res) => {
    try {
        const result = res.json(await mailModel.sendMailInvitation(req.body));
        return res.json({ data: result });
        } catch (err) {
        console.log(err);
    }
});

module.exports = router;
