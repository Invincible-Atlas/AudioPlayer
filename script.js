let timeChangeValue = 0;
let seekAllowed = true;
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
function dynamicUpdates(){
    const player = document.getElementById("mainPlayer");
    const playButton = document.getElementById("playButton");
    const PBContent = document.getElementById("PBContent");
    const seekSlider = document.getElementById("seekSlider");
    const tMinusText = document.getElementById("tMinusText");
    const tPlusText = document.getElementById("tPlusText");
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
    timeElapsed = secondsToTime(player.currentTime);
    totalTime = secondsToTime(player.duration);
    timeLeft = secondsToTime(player.duration-player.currentTime)
    tPlusText.innerHTML=`${timeElapsed}/${totalTime}`;
    
}
function readPlaylist(name){
    let playlists;
    if(localStorage.playlists){
        playlists = JSON.parse(localStorage.playlists);
        for(let i = 0;i<playlists.length;i++){
            if(playlists[i].name==name){
                // playlists[i].contents=data.contents;
                exists = true;
                
            }
        }
    }else{
        return(null);
    }
}
/**
 * 
 * @param {JSON} data 
 */
function writePlaylist(data){
    let playlists = "";
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
        localStorage.playlists = playlists;
    }else{
        localStorage.playlists = `[${JSON.stringify(data)}]`

    }
}
// document.onload=(ev)=>{
setInterval(dynamicUpdates,100);

// };