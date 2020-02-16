//TODO: have system for word to not repeat
//TODO: add a hide the word feature
//TODO: make word bank with catagories in json format
//TODO: fix that odd warning : Empty string passed to getElementById().
//TODO: Make sure logining into the twtich api is good
//TODO: make sure the word checker can detect multi-word answers
//https://twitch-js.netlify.com/index.html

const token = "gwam71i51a99gtupxqssfrzlg4o0qd";
const username = "darkll";
var isConnected = false;
var connectedChannel = ""

var chosenWord = "";
var wordFound = false;
var intervalTimer = null;
var gameFailed;

var categories_ids = {
  "Game_Switch": true,
  "Twitch_Emotes_Switch": false,
  "Movies_Switch": true,
  "Actions_Switch": false,
  "Actors_Switch": false,
  "TV_Shows_Switch": false,
  "BTT_FFZ_Switch": false
};

$(".input").ready(function() {
  for (var key in categories_ids) {
    categories_ids[key] = document.getElementById(key).checked
  };
})


const {
  chat,
  api
} = new TwitchJs({
  token,
  username,
  log: { enabled: true },
});

function StartGame() {
  connectTwtichChat();
};

function NextWord() {
  gameFailed = false;
  PickWord();
  stopTimer();
  startTimer(document.getElementById("timer_Spinner").value);
  document.getElementById("StartGame_btn").style.visibility = "hidden";
  document.getElementById("NextWord_btn").style.visibility = "visible";
}

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
      if (!wordFound && message.message != null && message.event === "PRIVMSG" && !gameFailed) {

        document.getElementById("wb_output").innerHTML = ("<strong>" + message.username + ": </strong>" + message.message);

        if (message.message.toLowerCase().search("\\b" + chosenWord + "\\b") != -1) {
          WordGuessed();
        }

      } else {
        document.getElementById("wb_output").innerHTML = "";
      }
    };
    // Listen for all events.
    chat.on(TwitchJs.Chat.Events.ALL, handleMessage);
  }

  // Connect ...
  chat.connect().then(() => {
    chat.join(channel).then(() => {
      isConnected = true;
      connectedChannel = channel;
      NextWord();
    });
  });
};

function startTimer(duration) {
  var timer = duration,
    minutes, seconds;
  intervalTimer = setInterval(function() {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer_ouput").innerHTML = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = 0;
      wordNotGuessed();
    }
  }, 1000);
}

function stopTimer() {
  if (intervalTimer != null) {
    clearInterval(intervalTimer);
  }
}

function PickWord() {
  wordFound = false;
  chosenWord = "See";
  document.getElementById("wb_theWord").innerHTML = chosenWord;
  chosenWord = chosenWord.toLowerCase();

}

function WordGuessed() {
  console.log("WORD GUEESED!")
  stopTimer();
  wordFound = true;
}

function wordNotGuessed() {
  gameFailed = true;
}

//Categories All Swtiches off Prevention
var p = function() {
  var number_of_trues = 0;
  for (var key in categories_ids) {
    if (categories_ids[key] == true) {
      number_of_trues++;
    }
  }
  if (number_of_trues == 1 && categories_ids[this.id] == true) {
    document.getElementById(this.id).checked = true;
  } else {
    categories_ids[this.id] = !categories_ids[this.id];
    document.getElementById(this.id).checked = categories_ids[this.id];
  }
};