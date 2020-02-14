const token = "gwam71i51a99gtupxqssfrzlg4o0qd";
const username = "darkll";
var isConnected = false;
var connectedChannel = ""
const {
  chat,
  api
} = new TwitchJs({
  token,
  username
});

function startGame() {
  const channel = document.getElementById("Editbox1").value;

  if (isConnected) {
    chat.reconnect().then(() => {
      chat.part(connectedChannel);
      chat.join(channel);
      connectedChannel = channel;
    })
  } else {

    const handleMessage = message => {
      //console.log(message);
      document.getElementById("output").innerHTML = message.message;
    };

    // Listen for all events.
    chat.on(TwitchJs.Chat.Events.ALL, handleMessage);

    // Connect ...
    chat.connect().then(() => {
      chat.join(channel);
      isConnected = true;
      connectedChannel = channel;
    });

  }


};