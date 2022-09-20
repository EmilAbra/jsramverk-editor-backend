const express = require('express');
const router = express.Router();

const docsModel = require('../models/docs')

router.get(
    "/",
    async (req, res) => {
        const docs = await docsModel.getAllDocs();
        return res.json({
            data: docs
        });
    }
);

router.get("/:name", async (req, res) => {
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
            message: "Content in editor is needed."
        }});
    }
});

router.put("/", async (req, res) => {
    const newDoc = req.body;
    const result = await docsModel.updateDoc(newDoc);
    return res.status(204).json({ data: result });
});

module.exports = router;
