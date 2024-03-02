const socket = io("/");

let myVideoStream;
const videoGrid = document.getElementById("video-grid");
//Referring video-grid from room.ejs

const myVideo = document.createElement("video");
//Created a Video Tag in Html DOM at Runtime
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: 3030,
});

/* 
- This line creates a new instance of the Peer object. The first argument, undefined, is used to let the library generate a unique ID for the peer. The second argument is an options object which configures the Peer object.

- { path: "/peerjs", host: "/", port: 3030 }: These are the options passed to configure the Peer object:

1) path: This specifies the path where the PeerServer is located. In this case, it's set to "/peerjs".
2) host: This specifies the host where the PeerServer is located. In this case, it's set to "/". This usually means that the host is the same as the current domain where the code is running.
3) port: This specifies the port number on which the PeerServer is running. In this case, it's set to 3030. */

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    //The new User is Answering the call at line(56) from the existing Users and supplies them his own stream.

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
      /*Calling the New User to Establish Send/Receive Channel: 
      1) Existing User calls the new user and sends him(New) his(Existing) stream 
      2) Sets up the Listner to Receive the new stream from the new user*/
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});
/* peer.on('open', ...) sets up an event listener for when the Peer object created at line 11 successfully connects to the PeerServer and obtains its own ID. */

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  //Existing User calls the new user and sends him(New) his(Existing) stream
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  //Existing User receives the new user's Stream and adds it to his own Video Grid
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  videoGrid.append(video);
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
};
/* Here's a breakdown of what the function does:

video.srcObject = stream;: This line sets the srcObject property of the video element to the provided stream. This associates the video element with a media stream, typically obtained from a user's camera or microphone using APIs like getUserMedia().

video.addEventListener('loadedmetadata', () => { video.play(); });: This line adds an event listener to the video element. The event being listened for is 'loadedmetadata', which fires when the browser has loaded metadata for the video (such as its dimensions and duration). When this event occurs, the provided callback function is executed. In this case, the callback simply calls video.play(), which starts playing the video.

So, essentially, this function sets up a video element to display a live video stream provided by the stream parameter. Once the metadata of the video is loaded, it automatically starts playing the video.
 */
