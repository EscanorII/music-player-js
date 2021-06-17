const MUSIC_PLAYER = document.querySelector('.music-player')
const COVER = MUSIC_PLAYER.querySelector('.music_player__cover')
const COVER_IMG = COVER.querySelector("img")
const BTN_PLAY = MUSIC_PLAYER.querySelector('#btn_play')
const AUDIO = MUSIC_PLAYER.querySelector('.music-player__audio')
const AUDIO_NAME = MUSIC_PLAYER.querySelector('.audio-info__songtitle')
const AUDIO_ARTIST = MUSIC_PLAYER.querySelector('.audio-info__artist')
const BTN_BACKWARD = MUSIC_PLAYER.querySelector('#btn_backward')
const BTN_FORWARD = MUSIC_PLAYER.querySelector('#btn_forward')
const PROGRESS = MUSIC_PLAYER.querySelector('.audio-progress__track')
const PROGRESS_SPAN = MUSIC_PLAYER.querySelector('span')
const BTN_TRACK_LIST = MUSIC_PLAYER.querySelector('.button_playlist')
const TRACK_LIST = MUSIC_PLAYER.querySelector('#list_id')
const PROGRESS_TIMER = MUSIC_PLAYER.querySelector('.audio-progress__duration')
let audioIndex = 0;
const REQUEST_URL = 'data.json';

async function getData(url){
    const RESPONSE = await fetch(url)
    const AUDIO_DATA = await RESPONSE.json()
    return AUDIO_DATA;
}

var IS_PLAYING

getData(REQUEST_URL).then(data =>{
    renderData(data);
})

const renderData = data => {
    getAudio(data.audio[audioIndex]);
    add_songs_into_list(data)

    BTN_PLAY.addEventListener('click',()=>{
        IS_PLAYING = MUSIC_PLAYER.classList.contains('music_player--play');
        if(IS_PLAYING){
            pauseAudio()
        }
        else{
            playAudio()
        }
    })

    BTN_BACKWARD.addEventListener('click', ()=>{
        audioIndex = audioIndex<=0 ? data.audio.length-1 : audioIndex-1;
        getAudio(data.audio[audioIndex])
        if(IS_PLAYING){
            PROGRESS_SPAN.style.width = "0";
            pauseAudio()
        }
        else{
            playAudio()
        }
    })

    BTN_FORWARD.addEventListener('click', ()=>{
        audioIndex = audioIndex>=data.audio.length-1 ? 0 : audioIndex+1;
        getAudio(data.audio[audioIndex])
        if(IS_PLAYING){
            PROGRESS_SPAN.style.width = "0";
            pauseAudio()
        }
        else{
            playAudio()
        }
    })
    AUDIO.addEventListener('timeupdate',(e)=>{
        const CURRENT_TIME = e.target.currentTime
        const DURATION = e.target.duration
        PROGRESS_SPAN.style.width = `${(100/DURATION)*CURRENT_TIME}%`

        PROGRESS_TIMER.textContent = `${format_time(CURRENT_TIME)}/${format_time(DURATION)}`


        if(e.target.ended){
            audioIndex = audioIndex>=data.audio.length-1 ? 0 : audioIndex+1;
            getAudio(data.audio[audioIndex])
            playAudio()

        }
    })


    PROGRESS.addEventListener('click',(e)=>{
        const AUDIO_TRACK_WIDTH = e.target.clientWidth;
        const CLICK_X = e.offsetX;
        const AUDIO_DURATION = AUDIO.duration;
        AUDIO.currentTime = (CLICK_X/AUDIO_TRACK_WIDTH) * AUDIO_DURATION;
    })

    BTN_TRACK_LIST.addEventListener('click',()=>{
        const LIST_STATUS = TRACK_LIST.classList.contains('list_closed')
        if(LIST_STATUS){
            TRACK_LIST.classList.remove('list_closed');
            TRACK_LIST.classList.add('list_opened')
        }
        else {
            TRACK_LIST.classList.remove('list_opened');
            TRACK_LIST.classList.add('list_closed')
        }
    })

    TRACK_LIST.addEventListener('click',(e)=>{
        if(e.target.className == 'songs'){
            audioIndex = +e.target.id
            getAudio(data.audio[audioIndex])
            playAudio()
        }
    })
}

function getAudio(data){
    AUDIO_NAME.textContent = data.song;
    AUDIO_ARTIST.textContent = data.artist;
    AUDIO.src = data.audioFile;
    COVER_IMG.src = data.audioCover;

}


function playAudio() {
    MUSIC_PLAYER.classList.add('music_player--play')
    BTN_PLAY.querySelector('i').setAttribute('class', 'fas fa-pause')
    COVER_IMG.setAttribute('class','img_playing')
    AUDIO.play()
}

function pauseAudio() {
    MUSIC_PLAYER.classList.remove('music_player--play')
    BTN_PLAY.querySelector('i').setAttribute('class', 'fas fa-play')
    COVER_IMG.setAttribute('class','img_pause')
    AUDIO.pause()
}

const VOLUME_BTN = MUSIC_PLAYER.querySelector('.button_mute')

VOLUME_BTN.addEventListener('click',()=>{
    const volumeStatus = VOLUME_BTN.querySelector('i.fas').classList.contains('fa-volume-up')
    if(volumeStatus){
        AUDIO.volume = 0;
        VOLUME_BTN.querySelector('i.fas').classList.remove('fa-volume-up');
        VOLUME_BTN.querySelector('i.fas').classList.add('fa-volume-mute');

    }
    else{
        AUDIO.volume = 1;
        VOLUME_BTN.querySelector('i.fas').classList.remove('fa-volume-mute');
        VOLUME_BTN.querySelector('i.fas').classList.add('fa-volume-up');

    }
})

function add_songs_into_list(data) {
    for (let i = 0; i < data.audio.length; i++) {
        const element = document.createElement('div')
        element.id = `${i}`;
        element.classList.add('songs')
        element.textContent = `${data.audio[i].artist} - ${data.audio[i].song}`
        TRACK_LIST.appendChild(element)
    }
}

function show_track() {
    const obj = document.getElementById(`${String(audioIndex)}`)
    obj.classList.add('playing')
}

function format_time(time) {
    let min = 0 | (time/60);
    let sec = 0 | (time%60);
    min = min<10 ? "0"+min : min;
    sec = sec<10 ? "0"+sec : sec;
    return `${min}:${sec}`
}