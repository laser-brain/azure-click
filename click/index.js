const MongoConnect = require('./az-fn-mongo');
const mongo = new MongoConnect(process.env.MONGO_URI);

module.exports = async function (context, req) {
    let clicks;
    if (req.method === 'POST') {
        clicks = await mongo.addClick(context, req.body.user);
    } else {
        clicks = await mongo.getClicks(context);
    }
    context.res = {
        body: clicks
    };
}