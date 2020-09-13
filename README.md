# lex-nodejs-challenge
Nodejs challenge submission as per https://github.com/LexApp/nodejs-challenge

## Heroku Deployment
API is deployed on Heroku at https://lex-nodejs-challenge.herokuapp.com/

## API Document on Postman
API document is deployed on postman at https://documenter.getpostman.com/view/1595983/TVK5e2SY

## Run locally
1. Clone this repo.
2. Run `npm i`
3. Set env var `DB_URI` and `TEST_DB_URI` (these should be connection URI to a mongodb version 4+ cluster)
4. Run `npm test` (to run all tests, Note any data in TEST_DB_URI will be erased on running tests)
5. Run `npm start` (to run the server)
