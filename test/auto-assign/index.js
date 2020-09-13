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

    it('PASS, create multiple moderator then create multiple report, check assignment', async () => {
        
        let moderator1 = await request(app).post('/moderator').send({ "name": "1" });
        let moderator2 = await request(app).post('/moderator').send({ "name": "2" });
        let report1 = await request(app).post('/user/report').send({ "message": "1" });
        let moderator3 = await request(app).post('/moderator').send({ "name": "3" });
        let moderator4 = await request(app).post('/moderator').send({ "name": "4" });
        let report2 = await request(app).post('/user/report').send({ "message": "2" });
        let report3 = await request(app).post('/user/report').send({ "message": "3" });
        let report4 = await request(app).post('/user/report').send({ "message": "4" });

        expect(moderator1.body).to.not.contain.property('reportAssigned');
        expect(moderator2.body).to.not.contain.property('reportAssigned');
        expect(report1.body).to.contain.property('moderatorAssigned');
        expect(moderator3.body).to.not.contain.property('reportAssigned');
        expect(moderator4.body).to.not.contain.property('reportAssigned');
        expect(report2.body).to.contain.property('moderatorAssigned');
        expect(report3.body).to.contain.property('moderatorAssigned');
        expect(report4.body).to.contain.property('moderatorAssigned');
    });

    it('PASS, create multiple report then create multiple moderator, check assignment', async () => {

        let report1 = await request(app).post('/user/report').send({ "message": "1" });
        let report2 = await request(app).post('/user/report').send({ "message": "2" });        
        let moderator1 = await request(app).post('/moderator').send({ "name": "1" });
        let report3 = await request(app).post('/user/report').send({ "message": "3" });
        let report4 = await request(app).post('/user/report').send({ "message": "4" });
        let moderator2 = await request(app).post('/moderator').send({ "name": "2" });
        let moderator3 = await request(app).post('/moderator').send({ "name": "3" });
        let moderator4 = await request(app).post('/moderator').send({ "name": "4" });

        expect(report1.body).to.not.contain.property('moderatorAssigned');
        expect(report2.body).to.not.contain.property('moderatorAssigned');
        expect(moderator1.body).to.contain.property('reportAssigned');
        expect(report3.body).to.not.contain.property('moderatorAssigned');
        expect(report4.body).to.not.contain.property('moderatorAssigned');
        expect(moderator2.body).to.contain.property('reportAssigned');
        expect(moderator3.body).to.contain.property('reportAssigned');
        expect(moderator4.body).to.contain.property('reportAssigned');
    });

});