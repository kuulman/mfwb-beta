require('dotenv').config();
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        tls: true,
    }
});



// EVENT MANAGEMENT SECTION
async function DailyEvent(timestamp) {
    try {
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('event');
        const result = await userdata.find({ time: timestamp }).toArray();
        console.log('[Database] Event Database Result:', result);
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function editTimestamp(id, timestamp) {
    try {
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('event');
        const result = await userdata.updateMany({ _id: id }, { $set: { time: timestamp } })
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// USER MANAGEMENT SECTION
let email;
let pass;
let number;

function UserAccInput(userEmail, userPass, userNumber) {
    email = userEmail;
    pass = userPass;
    number = userNumber;
}

async function createNewUser() {
    try {
        let group_reg = null;
        let defaultTypeAcc = "Starter";
        let active = true;
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('userdata');
        pass = await bcrypt.hash(pass, 8);
        const result = await userdata.insertOne({ number: number, email: email, pass: pass, type_acc: defaultTypeAcc, group_reg: [group_reg], active: active });
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

async function loginUser() {
    try {
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('userdata');
        const Findresult = await userdata.findOne({ email: email }).toArray();
        const hashedpass = Findresult[0]['pass'];
        const match = await bcrypt.compare(pass, hashedpass);
        if (match) {
            return console.log('[Database] Login Success:', Findresult);
        } else {
            return console.log('[Database] Login Failed: Incorrect password');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function findEventForHW(group_reg) {
    try {
        await client.connect();
        const database = client.db('skmt');
        const userdata = database.collection('event');
        const Findresult = await userdata.find({ group_reg: group_reg }).toArray();
        console.log(Findresult)
        return Findresult
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}
module.exports = {
    createNewUser,
    UserAccInput,
    checkUser,
    loginUser,
    DailyEvent,
    editTimestamp,
    findEventForHW,
};