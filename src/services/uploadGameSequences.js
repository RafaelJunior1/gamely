import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getFirestore,
    setDoc,
} from 'firebase/firestore';
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

const filePath = path.resolve(
  process.cwd(),
  'src/data/games.json'
);

const rawData = fs.readFileSync(filePath, 'utf-8');
const jsonData = JSON.parse(rawData);

async function uploadSequences() {
  try {
    const sequencesRef = collection(db, 'game_sequences');

    for (const franchise of jsonData.videogames) {
      if (!franchise.sequence || franchise.sequence.length === 0) continue;

      for (const game of franchise.sequence) {
        await setDoc(
          doc(sequencesRef, game.id),
          {
            id: game.id,
            franchiseId: franchise.id,
            title: game.title,
            releaseYear: game.releaseYear,
            image: game.image,
            description: game.description,
          }
        );

        console.log(`Sequência enviada: ${game.title}`);
      }
    }

    console.log('Todas as sequências foram enviadas com sucesso');
  } catch (error) {
    console.error('Erro ao enviar sequências:', error);
  }
}

uploadSequences();
