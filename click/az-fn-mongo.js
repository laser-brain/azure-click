const {
  MongoClient
} = require("mongodb");

class MongoConnect {

  uri = '';

  constructor(uri){
    this.uri = uri;
  };

  getClient = () => {
    return new MongoClient(this.uri, {
      userNewUrlParser: true,
      useUnifiedTopology: true,
    });
  };

  loadData = async function (collection) {
    const query = {
      _id: 'clicks'
    };
    const data = await collection.findOne(query);
    return data || {
      _id: 'clicks',
      clicks: 0,
      users: {}
    };
  };

  updateData = async function (data, user, collection) {
    if (!data.users[user]) {
      data.users[user] = {
        clicks: 0,
      };
    }

    data.clicks += 1;
    data.users[user].clicks += 1;
    
    const update = {
      $set: data
    };

    await collection.updateOne({
      _id: "clicks"
    }, update, {
      upsert: true
    });

    return data;
  };

  getClicks = async function (context) {
    const client = this.getClient();
    try {
      await client.connect();
      const database = client.db('clicker-db');
      const collection = database.collection('clicker-collection');
      const data = await this.loadData(collection)
      return data;
    } catch (err) {
      context.log(JSON.stringify(err));
    } finally {
      await client.close();
    }
  };

  addClick = async function (context, user) {
    const client = this.getClient();
    try {
      await client.connect();
      const database = client.db('clicker-db');
      const collection = database.collection('clicker-collection');
      const data = await this.loadData(collection);
      return await this.updateData(data, user, collection);
    } catch(err) {
      context.log(JSON.stringify(err));
    } finally {
      await client.close();
    }
  };
}

module.exports = MongoConnect;