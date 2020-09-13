process.env.NODE_ENV = 'test';  

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const conn = require('../../db/index');

describe('POST /user/report', function() {
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

    it('PASS, submitting a report', async () => {        
        let res = await request(app).post('/user/report').send({ "message": "1" });
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('message');
        expect(body.message).to.equal("1");
        expect(body).to.contain.property('isResolved');
        expect(body.isResolved).to.equal(false);
        expect(body).to.contain.property('isAssigned');
    });

    it('FAIL, report requires message', async () => {        
        let res = await request(app).post('/user/report').send({ });
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('message is required.');
    });

    it('FAIL, report message should be a string', async () => {        
        let res = await request(app).post('/user/report').send({ "message": 1 });
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('message should be a string.');
    });

    it('FAIL, create 1 report and 0 moderator, report should not be assigned', async () => {

        let res = await request(app).post('/user/report').send({ "message": "1" });
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('message');
        expect(body.message).to.equal("1");
        expect(body).to.contain.property('isResolved');
        expect(body.isResolved).to.equal(false);
        expect(body).to.contain.property('isAssigned');
        expect(body.isAssigned).to.equal(false);
    });

});