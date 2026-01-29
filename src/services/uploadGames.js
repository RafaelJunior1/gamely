import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: "AIzaSyAlwubcvsxYZ-ij_d9Q9g-K20bNU2-f_9w",
  authDomain: "gamely-5e977.firebaseapp.com",
  projectId: "gamely-5e977",
  storageBucket: "gamely-5e977.firebasestorage.app",
  messagingSenderId: "481658284788",
  appId: "1:481658284788:web:86b90561f1b3bcd8430ca1",
  measurementId: "G-T4VW5R8RCN" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gamesPath = path.resolve('../data/games.json');

let rawData;
try {
  rawData = fs.readFileSync(gamesPath, 'utf-8');
} catch (err) {
  console.error('Erro ao ler o games.json:', err.message);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(rawData);
} catch (err) {
  console.error('Erro ao parsear JSON:', err.message);
  process.exit(1);
}

const videogames = data.videogames;
if (!Array.isArray(videogames)) {
  console.error('O JSON deve conter um array chamado "videogames"');
  process.exit(1);
}

async function uploadGames() {
  const gamesCollection = collection(db, 'games');

  for (const game of videogames) {
    try {
      await setDoc(doc(gamesCollection, game.id), game);
      console.log(`Jogo enviado: ${game.title}`);
    } catch (err) {
      console.error(`Erro ao enviar ${game.title}:`, err.message);
    }
  }

  console.log('Upload finalizado!');
}

uploadGames();