/* eslint-disable prettier/prettier */
//eslint-disable
import { MongoClient } from 'mongodb';
let dbConnect;

export const getDatabase = async () => {
  return (dbConnect =
    dbConnect == undefined ||
    dbConnect.serverConfig == undefined ||
    !dbConnect.serverConfig.isConnected()
      ? (
          await MongoClient.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
          })
        ).db('bardo')
      : dbConnect);
};

// export async function getUserByFacebookId(id) {
//   const db = await getDatabase();
//   return await db.collection('users').findOne({ id: id });
// }

export const getUserBySocialId = async (id) => {
  const db = await getDatabase();

  return await db.collection('users').findOne({ socialId: id });
};

export const insertUser = async (data) => {
  const db = await getDatabase();

  return await db.collection('users').insertOne(data);
};

export const addSummonerUserDB = async(id, data) => {
  const db = await getDatabase();

  return await db.collection('users').updateOne({ socialId: id}, { '$set': { lol: data} });
}

export const updateChampionsDB = async(data) => {
  const db = await getDatabase();

  return await db.collection('champions').insertOne(data);
}

export const getChampionsDB = async() => {
  const db = await getDatabase();

  return await db.collection('champions').findOne();
}