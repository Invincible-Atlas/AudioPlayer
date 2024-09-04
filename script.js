let timeChangeValue = 0;
let seekAllowed = true;
let currentPlaylist = [];
let currentSongIndex = 0;
/**
 * 
 * @param {number} seconds 
 * @returns {string}
 */
function secondsToTime(seconds){
    let minutes = Math.floor(seconds / 60);
    let seconds2 = Math.floor(seconds - minutes * 60);
    if(seconds2.toString().length<2){
        seconds2 = `0${seconds2}`;
    }
    return(`${minutes}:${seconds2}`);
}
function playToggle(){
    const player = document.getElementById("mainPlayer");
    const playButton = document.getElementById("playButton");
    const PBContent = document.getElementById("PBContent");
    
    if(player.paused){
        player.play()
        playButton.style.backgroundColor = "green";
        PBContent.innerHTML="▌▐";
    }else{
        player.pause()
        playButton.style.backgroundColor = "red";
        PBContent.innerHTML = "▶"
    }
}
function audioBack(){
    const player = document.getElementById("mainPlayer");
    timeChangeValue = timeChangeValue - 5;
}
function audioForward(){
    const player = document.getElementById("mainPlayer");
    timeChangeValue = timeChangeValue + 5;
}
function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Reads the data of a playlist
 * @param {string} name
 * @returns {JSON} The data of the playlist with the name value equivalent to the name param, or null if no playlist with the right name exists
 */
function readPlaylist(name){
    let playlists;
    let data;
    if(localStorage.playlists){
        playlists = JSON.parse(localStorage.playlists);
        for(let i = 0;i<playlists.length;i++){
            if(playlists[i].name==name){
                // playlists[i].contents=data.contents;
                exists = true;
                data = playlists[i];
            }
        }
        if(exists==true){
            return(data);
        }else{
            return(null);
        }
    }else{
        return(null);
    }
}
/**
 * Writes to playlist with the name data.name
 * @param {JSON} data 
 */
function writePlaylist(data){
    // console.log(data);
    // console.log(JSON.stringify(data));
    // console.log(JSON.parse(JSON.stringify(data)));
    let playlists = [];
    if(localStorage.playlists){
        playlists = localStorage.playlists;
        playlists=JSON.parse(playlists);
        let exists = false;
        for(let i = 0;i<playlists.length;i++){
            if(playlists[i].name==data.name){
                playlists[i].contents=data.contents;
                exists = true;
                
            }
        }
        if(exists==false){
            playlists.push(data)
        }
        // console.log(playlists);
        localStorage.playlists = JSON.stringify(playlists);
    }else{
        
        localStorage.playlists = `[${JSON.stringify(data)}]`

    }
}
/**
 * Loads a playlist to the currentPlaylist variable
 * @param {string} name the playlist to load
 */
function loadPlaylist(name){
    currentPlaylist = readPlaylist(name).contents;
}
async function getSongNames(data){
    let returnData = [];
    await fetch("./audio/audio.json")
    .then(res => 
        res.json()
    ).then(JSONdata =>{
        // console.log(JSONdata);
        for(let i = 0;i<data.length;i++){
            // console.log(i)
            if(JSONdata.find((obj)=>{return(obj.path==data[i])})){
                let index = JSONdata.findIndex((obj)=>{return(obj.path==data[i])});
                returnData.push(JSONdata[index].name);
                // console.log(`The path of ${data[i]} is ${JSONdata[index].path}`)
            }
        }
    })
    return(returnData);
}
async function dynamicUpdates(){
    const player = document.getElementById("mainPlayer");
    const playButton = document.getElementById("playButton");
    const PBContent = document.getElementById("PBContent");
    const seekSlider = document.getElementById("seekSlider");
    const tMinusText = document.getElementById("tMinusText");
    const tPlusText = document.getElementById("tPlusText");
    const playlistText = document.getElementById("playlistText");
    let newSliderValue=scale(player.currentTime,0,player.duration,1,1000);
    if(Math.abs(newSliderValue-seekSlider.value)>2&&timeChangeValue==0&&seekAllowed==true){
        player.currentTime=scale(seekSlider.value,1,1000,0,player.duration);
    }else{
        if(timeChangeValue!==0){
            player.currentTime=player.currentTime+timeChangeValue;
            timeChangeValue=0
            newSliderValue=scale(player.currentTime,0,player.duration,1,1000);
        }
        
        seekSlider.value=newSliderValue;
    }
    if(!player.paused){
        // player.play()
        playButton.style.backgroundColor = "green";
        PBContent.innerHTML="▌▐";
    }else{
        // player.pause()
        playButton.style.backgroundColor = "red";
        PBContent.innerHTML = "▶"
    }
    playlistText.innerText= (await getSongNames(currentPlaylist)).join("\n");
    // console.log(await getSongNames(currentPlaylist));
    timeElapsed = secondsToTime(player.currentTime);
    totalTime = secondsToTime(player.duration);
    timeLeft = secondsToTime(player.duration-player.currentTime);
    
    tPlusText.innerHTML=`${timeElapsed}/${totalTime}`;
    
}

// getSongNames(["03. GSO (Combat Two).mp3"]);
// localStorage.removeItem("playlists");
writePlaylist({"name":"testPlaylist","contents":["36. Fractured Shrines.mp3","03. GSO (Combat Two).mp3"]});
loadPlaylist("testPlaylist");
// console.log(readPlaylist("testPlaylist").contents);
console.log(localStorage.playlists);
console.log(currentPlaylist);
setInterval(dynamicUpdates,100);

