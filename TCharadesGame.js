//TODO: have system for word to not repeat
//TODO: add timer
//TODO: add a hide the word feature
//TODO: make word bank with catagories in json format
//TODO: fix that odd warning : Empty string passed to getElementById().
//https://twitch-js.netlify.com/index.html

const token = "gwam71i51a99gtupxqssfrzlg4o0qd";
const username = "darkll";
var isConnected = false;
var connectedChannel = ""
var chosenWord = "";
var wordFound = false;

const {
  chat,
  api
} = new TwitchJs({
  token,
  username,
  log: { enabled: true },
});

function NextWord() {
  PickWord();
}

function StartGame() {
  PickWord();
  connectTwtichChat();

};

function connectTwtichChat() {
  const channel = document.getElementById("channelName").value;

  if (isConnected) {
    chat.reconnect().then(() => {
      chat.part(connectedChannel);
      chat.join(channel);
      connectedChannel = channel;
    })
  } else {

    const handleMessage = message => {
      //console.log(message)
      if (!wordFound && message.message != null && message.event === "PRIVMSG") {
        document.getElementById("wb_output").innerHTML = ("<strong>" + message.username + ": </strong>" + message.message);
        if (message.message.toLowerCase().search("\\b" + chosenWord + "\\b") != -1) {
          WordGuessed();
        }
      }
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

function WordGuessed() {
  console.log("WORD GUEESED!")
  wordFound = true;
}

function PickWord() {
  wordFound = false;
  chosenWord = "See";
  document.getElementById("wb_theWord").innerHTML = chosenWord;
  chosenWord = chosenWord.toLowerCase();

}