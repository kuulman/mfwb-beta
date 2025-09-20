require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



// USER MANAGEMENT SECTION
let email;
let pass;
let number;
let dataResult = {};

function UserAccInput(userEmail, userPass, userNumber) {
    email = userEmail;
    pass = userPass;
    number = userNumber;
}

async function createNewUser() {
    try {
        let group_reg = null;
        let defaultTypeAcc = "starter";
        let active = true;
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('userdata');
        const result = await userdata.insertOne({ number: number, email: email, pass: pass, type_acc: defaultTypeAcc, group_reg: [ group_reg ], active: active });
        console.log(`New user created with the following id: ${result.insertedId}`);
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function checkUser() {
    try {
        let active = true;
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('userdata');
        const result = await userdata.find({ number: number, active: active }).toArray();
        console.log('[Database] Account Database Result:', result);
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = { 
    createNewUser, 
    UserAccInput,
    checkUser,
    resultData: () => dataResult
};