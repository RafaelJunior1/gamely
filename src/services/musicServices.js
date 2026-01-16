// src/services/musicService.js
export async function fetchDistroKidMusic(query) {
  try {
    const response = await fetch(`https://api.distrokid.com/v1/music/search?query=${query}`);
    const data = await response.json();

    return data.tracks.map(track => ({
      id: track.id,
      name: track.title,
      artist: track.artist_name,
      preview: track.preview_url,
    }));
  } catch (error) {
    console.error('Erro ao buscar músicas DistroKid:', error);
    return [];
  }
}
