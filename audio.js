const base='audio/';
const names=['Clear_Start','Soft_Motion','Blue_Circuit','Flow_State','Night_Drive','Crystal_Pulse','Neon_Velocity','Deep_Focus','Beyond_Limits','Infinite_Horizon'];
const musicFiles=Object.fromEntries(names.map((n,i)=>[`4-${i}`,`BGM_${String(i).padStart(2,'0')}_${n}.wav`]));
let music=null,track=null,playlistIndex=0,activeState=null;
const sounds={};
export function playSfx(type,settings){if(!settings.sfxVolume)return;try{if(!sounds[type])sounds[type]=new Audio(base+'SFX_'+type+'.wav');const a=sounds[type].cloneNode();a.volume=Math.min(1,settings.sfxVolume/100);a.play().catch(()=>{});}catch{}}
export function playMusic(state){activeState=state;const options=(state.playlist||[]).filter(id=>state.owned.includes(id)&&musicFiles[id]);if(!options.length||!state.settings.musicVolume){stopMusic();return;}if(!options.includes(track)){const next=state.shuffle?options[Math.floor(Math.random()*options.length)]:options[playlistIndex%options.length];setTrack(next);}if(music){music.volume=state.settings.musicVolume/100;if(music.paused)music.play().catch(()=>{});}}
function setTrack(id){if(music)music.pause();track=id;music=new Audio(base+musicFiles[id]);music.preload='auto';music.addEventListener('ended',()=>{const s=activeState;if(!s)return;const opts=s.playlist.filter(x=>s.owned.includes(x)&&musicFiles[x]);if(!opts.length)return;playlistIndex++;setTrack(s.shuffle?opts[Math.floor(Math.random()*opts.length)]:opts[playlistIndex%opts.length]);music.volume=s.settings.musicVolume/100;music.play().catch(()=>{});});}
export function stopMusic(){if(music){music.pause();music.currentTime=0;}music=null;track=null;}
export function adjustMusic(state){if(!state.settings.musicVolume){if(music)music.pause();}else{if(music){music.volume=state.settings.musicVolume/100;music.play().catch(()=>{});}}}
export const hasPreview=id=>Boolean(musicFiles[id]);
