process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const docsModel = require('../models/docsModel');

chai.should();

chai.use(chaiHttp);

const database = require("../db/database.js");
const collectionName = "docs";

describe('Editor', function() {
    before(function() {
        return new Promise(async (resolve) => {
            const db = await database.getDb();
            // console.log(db);
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
    /*
    * Test the /GET route
    */
    describe('GET /editor', () => {
        it('200 When not finding a document', (done) => {
            chai.request(server)
                .get("/editor/doc/test")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });
    /*
    * Test the /POST route
    */
    describe('POST /editor', () => {
        it('201 Should create new doc', (done) => {
            let doc = {
                name: "test_doc",
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
                    res.body.data.name.should.equal("test_doc");

                    done();
                });
        });

        it('200 Should be added to database', (done) => {
            chai.request(server)
                .get("/editor/doc/test_doc")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("object");

                    done();
                });
        });

        it('400 Should return errors creating new doc with no content', (done) => {
            let doc = {
                name: "test_doc2",
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

        it("200 Should not be added to database", (done) => {
            chai.request(server)
                .get("/editor/doc/test_doc2")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(res.body).to.be.empty;

                    done();
                });
        });
    });
    /*
    * Test the /PUT route
    */
    describe('PUT /editor', () => {
        it('204 should update existing doc', async () => {
            const doc = await docsModel.getOneDoc("test_doc");

            doc.content = "Lorem ipsum";

            chai.request(server)
                .put("/editor")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.an("object");
                });
        });

        it('200 Should get the updated doc and has correct updated content', (done) => {
            chai.request(server)
                .get("/editor/doc/test_doc")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.have.property('name').eql('test_doc');
                    res.body.data.should.have.property('content').eql('Lorem ipsum');

                    done();
                });
        });
    });
});
