"use strict";

const $ = (x) => document.getElementById(x);

const backendurl = "";

let room;

// Simple js to control when forms appear
function gotopage(pagename) {
  if (pagename === "getusername") {
    $("getusername").style.display = "block";
    $("videoroom").style.display = "none";
    $("loading").style.display = "none";
  } else if (pagename === "videoroom") {
    $("getusername").style.display = "none";
    $("videoroom").style.display = "block";
    $("loading").style.display = "none";
  } else {
    $("getusername").style.display = "none";
    $("videoroom").style.display = "none";
    $("loading").style.display = "block";
  }
}

async function joinwithusername() {
  let username = $("usernameinput").value.trim();
  console.log("The user picked username", username);
  gotopage("loading");

  try {
    let token = await axios.post(backendurl + "/get_token", {
      user_name: username
    });
    token = token.data.token;

    try {
      console.log("Setting up RTC session");
      room = new SignalWire.Video.RoomSession({
        token,
        rootElement: document.getElementById("root"),
        audio:true
      });

      await room.join();
      
      room.on('member.updated',(e) => (
        logevent(e.member.video_muted)
        ));  

    }
     catch (error) {
      console.error("Something went wrong", error);
    }

    gotopage("videoroom");
  } catch (e) {
    console.log(e);
    alert("Error encountered. Please try again.");
    gotopage("getusername");
  }
}

async function hangup() {
  if (room) {
    await room.hangup();
    gotopage("getusername");
  }
}

function logevent(message) {
  $("events").innerHTML += "<br/>" + message;
}

function eventhandler(event){
for (const value of event){
  console.log(event)
}
}
//Start
gotopage("getusername");

let screenShareObj;
async function share_screen() {
    if (room === undefined) return;
    if (screenShareObj === undefined) {
      screenShareObj = await room.startScreenShare({
        audio: {echoCancellation: true},
        video: true
      }
      )
        $("share_screen_button").innerText = "Turn off Sharing";
    } else {
        screenShareObj.leave();
        screenShareObj = undefined;
        $("share_screen_button").innerText = "Share Screen";
    }
}
async function audio_mute(){
  await room.audioMute();
}

async function audio_unmute(){
  await room.audioUnmute();
}

async function video_unmute(){
  await room.videoUnmute();
}

async function video_mute(){
  await room.videoMute();
}

async function join_participant(){
}

