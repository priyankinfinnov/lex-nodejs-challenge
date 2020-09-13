process.env.NODE_ENV = 'test';  

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const conn = require('../../db/index');

describe('PATCH /moderator/review/:reportId', function() {
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

    it('PASS, submitting a review', async () => {

        let report = await request(app).post('/user/report').send({ "message": "1" });
        let moderator = await request(app).post('/moderator').send({ "name": "1" });

        let res = await request(app).patch(`/moderator/review/${report.body._id}`)
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('message');
        expect(body.message).to.equal("1");
        expect(body).to.contain.property('isResolved');
        expect(body.isResolved).to.equal(true);
        expect(body).to.contain.property('isAssigned');
        expect(body.isAssigned).to.equal(true);
        expect(body).to.contain.property('moderatorAssigned');
        expect(body.moderatorAssigned).to.equal(moderator.body._id);
        
    });

    it('FAIL, reportId should be a valid id', async () => {

        let res = await request(app).patch(`/moderator/review/1`)
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('reportId should be a valid id.');
    });

    it('FAIL, report not found.', async () => {

        let res = await request(app).patch(`/moderator/review/111111111111111111111111`)
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('report not found.');
    });

    it('FAIL, report was not assigned.', async () => {

        let report = await request(app).post('/user/report').send({ "message": "1" });
        
        let res = await request(app).patch(`/moderator/review/${report.body._id}`)
        const body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('report was not assigned.');
    });

    it('FAIL, report already resolved.', async () => {

        let report = await request(app).post('/user/report').send({ "message": "1" });
        let moderator = await request(app).post('/moderator').send({ "name": "1" });

        let res = await request(app).patch(`/moderator/review/${report.body._id}`)
        let body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('message');
        expect(body.message).to.equal("1");
        expect(body).to.contain.property('isResolved');
        expect(body.isResolved).to.equal(true);
        expect(body).to.contain.property('isAssigned');
        expect(body.isAssigned).to.equal(true);
        expect(body).to.contain.property('moderatorAssigned');
        expect(body.moderatorAssigned).to.equal(moderator.body._id);
        
        res = await request(app).patch(`/moderator/review/${report.body._id}`)
        body = res.body;
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('report already resolved.');
    });

});