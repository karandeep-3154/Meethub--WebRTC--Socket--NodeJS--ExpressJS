- Socket.io
- Peerjs
- uuid
- webRTC

- Process of Establishing the Connection btw devices connected across the server:-

1. User requests for homepage but express server creates a uuid and redirects it to /uuid
2. Server sends back the uuid to user and user extracts it using ejs
3. Using the Obtained uuid, the user emits a join-room request for that particular room id to the socket.io server
4. When the socket.io server receives the join-room request, it first admits that user into that room and then it broadcasts the event "user-connected" to all connected users.
5. All the Connected users listen for the event "user-connected" and on obtaining so, add that particular user's stream to the existing stream of their own.
6. We add peer.js so that each user obtains a uniqiue Peer Id, called userId. Now, we modify step-4 in such a way that while broadcasting "user-connected" to all the Connected Users, we also sends the userId.
