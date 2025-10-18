// DEVELOPMENT ONLY, NOT FOR PRODUCTION
// ANY DEBUGGING OR NEW FEATURES NEED TO BE TESTED HERE
// FOR DEBUGGING ONLY, CHANGES `package.json` type to module

import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })
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


async function getUserJoinLeaveData(id = '120363401271520921@g.us', type = 'join') {
    try {
        if (type === 'join') {
            await client.connect();
            const database = client.db('skmt');
            const event = database.collection('userdata');
            const result = await event.findOne({ "group_reg.id": id }, { projection: { "group_reg": 1, _id: 0 } })
            console.debug(result.group_reg.settings)
            const groupData = result.group_reg.find(
                (g) => g.id === id
            );

            const joinMessage = groupData?.settings?.join_leave?.join_message;
            console.debug(joinMessage)
            return joinMessage;
        }
        if (type === 'leave') {
            await client.connect();
            const database = client.db('skmt');
            const event = database.collection('userdata');
            const result = await event.findOne({ "group_reg.id": id }, { projection: { "group_reg": 1, _id: 0 } })
            console.debug(result.group_reg.settings)
            const groupData = result.group_reg.find(
                (g) => g.id === id
            );

            const joinMessage = groupData?.settings?.join_leave?.join_message;
            console.debug(joinMessage)
            return joinMessage;
        } else {
            console.error('Error: Type isnt defined')
        }
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}

await getUserJoinLeaveData()