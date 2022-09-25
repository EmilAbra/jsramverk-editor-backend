process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const docsModel = require('../models/docs');

chai.should();

chai.use(chaiHttp);

const database = require("../db/database.js");
const collectionName = "docs";

describe('Editor', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('GET /editor', () => {
        it('200 The database is empty', (done) => {
            chai.request(server)
                .get("/editor")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('POST /editor', () => {
        it('201 Creating new doc', (done) => {
            let doc = {
                name: "test-doc",
                content: "Lorem ipsum dolor sit amet"
            };

            chai.request(server)
                .post("/editor")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("name");
                    res.body.data.name.should.equal("test-doc");

                    done();
                });
        });

        it('200 Check new dock is added', (done) => {
            chai.request(server)
                .get("/editor")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });

        it('201 Creating new doc with no content', (done) => {
            let doc = {
                name: "test-doc2",
                content: ""
            };

            chai.request(server)
                .post("/editor")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("message");
                    res.body.errors.message.should.equal("Name and Content in editor is needed.");

                    done();
                });
        });

        it("200 Check if latest doc wasn't added", (done) => {
            chai.request(server)
                .get("/editor")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });

    describe('PUT /editor', () => {
        it('201 Creating new doc', (done) => {
            let doc = {
                name: "test-doc2",
                content: "Lorem ipsum dolor sit amet"
            };

            chai.request(server)
                .post("/editor")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("name");
                    res.body.data.name.should.equal("test-doc2");

                    done();
                });
        });

        it('204 update existing doc', async () => {
            const doc = await docsModel.getOneDoc("test-doc2");
            
            doc.content = "Lorem ipsum";

            chai.request(server)
                .put("/editor")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.an("object");
                });
        });

        it('200 Check if the updated doc is correct', (done) => {
            chai.request(server)
                .get("/editor/test-doc2")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.have.property('name').eql('test-doc2');
                    res.body.data.should.have.property('content').eql('Lorem ipsum');

                    done();
                });
        });
    });
});
