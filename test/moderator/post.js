process.env.NODE_ENV = 'test';  

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const conn = require('../../db/index');

describe('POST /moderator', function() {
    this.timeout(1000000000);

    before(async () => {
        await conn.connect();
    });

    beforeEach(async () => {
        await conn.cleardb();
    });

    after(async () => {
        await conn.close();
    });

    it('PASS, submitting a moderator', async () => {
        let res = await request(app).post('/moderator').send({ "name": "1" });
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('name');
        expect(body.name).to.equal("1");
        expect(body).to.contain.property('isAvailable');
    });

    it('FAIL, moderator requires name', async () => {        
        let res = await request(app).post('/moderator').send({ });
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('name is required.');
    });

    it('FAIL, moderator name should be a string', async () => {        
        let res = await request(app).post('/moderator').send({ "name": 1 });
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('name should be a string.');
    });

    it('FAIL, create 1 moderator and 0 report, moderator should be available', async () => {

        let res = await request(app).post('/moderator').send({ "name": "1" });
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('name');
        expect(body.name).to.equal("1");
        expect(body).to.contain.property('isAvailable');
        expect(body.isAvailable).to.equal(true);
    });

});