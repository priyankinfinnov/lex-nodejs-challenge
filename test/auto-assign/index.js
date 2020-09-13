process.env.NODE_ENV = 'test';  

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const conn = require('../../db/index');

describe('Auto Assign', function() {
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

    it('PASS, create 1 report then create 1 moderator, moderator should be assigned', async () => {

        let report = await request(app).post('/user/report').send({ "message": "1" });
        let res = await request(app).post('/moderator').send({ "name": "1" });

        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('name');
        expect(body.name).to.equal("1");
        expect(body).to.contain.property('isAvailable');
        expect(body.isAvailable).to.equal(false);
        expect(body).to.contain.property('reportAssigned');
        expect(body.reportAssigned).to.equal(report.body._id);        
    });

    it('PASS, create 1 moderator then create 1 report, report should be assigned', async () => {
        
        let moderator = await request(app).post('/moderator').send({ "name": "1" });
        let res = await request(app).post('/user/report').send({ "message": "1" });

        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('message');
        expect(body.message).to.equal("1");
        expect(body).to.contain.property('isResolved');
        expect(body.isResolved).to.equal(false);
        expect(body).to.contain.property('isAssigned');
        expect(body.isAssigned).to.equal(true);
        expect(body).to.contain.property('moderatorAssigned');
        expect(body.moderatorAssigned).to.equal(moderator.body._id);        
    });

});