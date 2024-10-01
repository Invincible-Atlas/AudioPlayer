

let timeChangeValue = 0;
let seekAllowed = true;
let currentPlaylist = [];
let currentSongIndex = 0;
let changingSong = false;
let prevSongIndex = -1;
let isSliding = false;

let sliderA = document.getElementById("seekSlider");
function getSearchValue(search,value){
    return(new URLSearchParams(search).get(value))
}
if(sliderA){
sliderA.addEventListener('input', function () {
  isSliding = true;
//   output.innerHTML = isSliding;
});
sliderA.addEventListener('mouseup', function () {
    isSliding = false;
    // output.innerHTML = isSliding;
});
}
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
// async function pickDir(){
//     let data;
//     try {
//         await window.showDirectoryPicker().then((data)=>{
//             data=data;
//         },()=>{
//             alert("Error");

//         });

//     } catch (error) {
//         alert(`Error: ${error}`);
//         // throw(error);  
//     };
//     // alert(data.kind);
//     return(data);
// }

// async function getFiles(directoryHandle) {
//     let data = [];
//     let audioJSON = [];
//     for await (const handle of directoryHandle.values()) {
//         if(handle.kind == "file"){
//             data.push(handle);
//             let fileData = await handle.getFile();
//             alert(file.name);
            
//         }
//     }
    
    
// }
// async function getDir(){
    
//     let directoryHandle = await pickDir();
    
//     await getFiles(directoryHandle);
// }
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
    if(readPlaylist(name)!==null){
        currentPlaylist = readPlaylist(name).contents;
    }else{
        currentPlaylist=[];
    }
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
function prevTrack(){
    currentSongIndex--
}
function nextTrack(){
    currentSongIndex++
}
async function dynamicUpdates(){
    let player = document.getElementById("mainPlayer");
    const playButton = document.getElementById("playButton");
    const PBContent = document.getElementById("PBContent");
    const seekSlider = document.getElementById("seekSlider");
    const tMinusText = document.getElementById("tMinusText");
    const tPlusText = document.getElementById("tPlusText");
    const playlistText = document.getElementById("playlistText");
    let newSliderValue=scale(player.currentTime,0,player.duration,1,1000);
    if(isSliding==true&&timeChangeValue==0&&seekAllowed==true){
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

    
    // console.log(await getSongNames(currentPlaylist));
    
    timeElapsed = secondsToTime(player.currentTime);
    totalTime = secondsToTime(player.duration);
    timeLeft = secondsToTime(player.duration-player.currentTime);
    
    tPlusText.innerHTML=`${timeElapsed}/${totalTime}`;
    if(player.currentTime >= player.duration && isSliding == false){
        currentSongIndex++
    }
    if(prevSongIndex !== currentSongIndex && changingSong == false){
        seekAllowed = false;
        changingSong = true;
        
        
        // currentSongIndex++;
        document.getElementById("source").src = "/audio/"+currentPlaylist[currentSongIndex];
        // player = document.getElementById("mainPlayer");
        
        player.load();  
        player.play()
        player.currentTime = 0;
        seekSlider.value = 1;
        
        // player.play();      
        changingSong = false;
        seekAllowed = true;
    let songNames = await getSongNames(currentPlaylist);
    let containerEl = document.createElement("div");
    for(i in songNames){
        if(i==currentSongIndex){
            let appendEl = document.createElement("p");
            appendEl.innerHTML = songNames[i];
            appendEl.classList = "songName currentSong"
            // eval(`appendEl.addEventListener('click',(e)=>{currentSongIndex = ${i}   })`);
            let boldEl = document.createElement("b");
            boldEl.appendChild(appendEl);
            containerEl.appendChild(boldEl);
        }else{
            let appendEl = document.createElement("p");
            appendEl.innerHTML = songNames[i];
            appendEl.classList = "songName";
            appendEl.setAttribute("data-songIndex",i);
            appendEl.addEventListener('click',(e)=>{
                currentSongIndex =  Number(e.target.getAttribute("data-songIndex"));
            })
            // eval(`appendEl.addEventListener('click',(e)=>{currentSongIndex = ${i}   })`);
            containerEl.appendChild(appendEl);
        }
    }
    playlistText.innerHTML = "";

    playlistText.appendChild(containerEl);
    
    }
    prevSongIndex = currentSongIndex;
}
// alert(window.location.pathname)
if(window.location.pathname=="/index.html"||window.location.pathname=="/"){
    // getSongNames(["03. GSO (Combat Two).mp3"]);
    // localStorage.removeItem("playlists");
    writePlaylist({"name":"testPlaylist","contents":["36. Fractured Shrines.mp3","03. GSO (Combat Two).mp3"]});
    if(window.location.search==""){
        
    }else{
        loadPlaylist(getSearchValue(window.location.search,"playlist"));
        currentSongIndex = Number(getSearchValue(window.location.search,"song"));
    }
    // console.log(readPlaylist("testPlaylist").contents);
    // console.log(localStorage.playlists);
    // console.log(currentPlaylist);
    setInterval(dynamicUpdates,100);
}else if(window.location.pathname=="/playlists.html"){
    // alert(window.location.search);
    if(window.location.search==""){
        if(localStorage.playlists){
            let playlists = localStorage.playlists;
            playlists=JSON.parse(playlists);
            let containerEl = document.createElement("div");
            for(i in playlists){
                let appendEl = document.createElement("p");
                appendEl.innerHTML = playlists[i].name;
                appendEl.classList = "playlistName";
                appendEl.setAttribute("data-playlistName",playlists[i].name);
                appendEl.addEventListener('click',(e)=>{
                    window.location = window.location.protocol + "//" + window.location.hostname + `/playlists.html?playlist=${playlists[i].name}`;
                })
                // eval(`appendEl.addEventListener('click',(e)=>{currentSongIndex = ${i}   })`);
                containerEl.appendChild(appendEl);
            }
            
            document.body.appendChild(containerEl);
            let newPlaylistLink = document.createElement("a");
            newPlaylistLink.href="/newplaylist.html";
            newPlaylistLink.innerHTML="New Playlist";
            document.body.appendChild(newPlaylistLink);
        }
    }else if(getSearchValue(window.location.search,"playlist")=="new"){
        
    }else{
        loadPlaylist(getSearchValue(window.location.search,"playlist"));
        (async () => {
            let songNames = await getSongNames(currentPlaylist);
            let containerEl = document.createElement("div");
            for(i in songNames){

               
                let appendEl = document.createElement("p");
                appendEl.innerHTML = songNames[i];
                appendEl.classList = "songName";
                appendEl.setAttribute("data-songIndex",i);
                appendEl.addEventListener('click',(e)=>{
                    window.location = window.location.protocol + "//" + window.location.hostname + `?playlist=${getSearchValue(window.location.search,"playlist")}&song=${e.target.getAttribute("data-songIndex")}`;
                })
                // eval(`appendEl.addEventListener('click',(e)=>{currentSongIndex = ${i}   })`);
                containerEl.appendChild(appendEl);
                
            }
            document.body.append(containerEl);
        })();
    }
}

