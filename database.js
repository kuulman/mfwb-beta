const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://skmt_dbadmin:skmt_dbadmin@skmtdb.wmmy5xj.mongodb.net/?retryWrites=true&w=majority&appName=skmtdb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

(async () => {
    try {
        await client.connect();
        const database = client.db('skmt');
        const names = database.listCollections({}, { nameOnly: true });
        let found = false;
        for await (const doc of names) {
            console.log(doc.name)
        }
    } catch (error) {
        console.error("Error connecting to the database:", error);
    } finally {
        await client.close();
    }
})();