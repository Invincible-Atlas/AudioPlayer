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
    player.currentTime = player.currentTime - 5;
}
function audioForward(){
    const player = document.getElementById("mainPlayer");
    player.currentTime = player.currentTime + 5;
}