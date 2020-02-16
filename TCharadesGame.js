//TODO: make word pop out to a window and show button will fail the game
//TODO: make word bank with catagories in json format
//TODO: Make sure logining into the twtich api is good
//TODO: make timer feel better when it starts and ends
//TODO: make cheer ad little animation when someone guesses it
//TODO: make chat look nice and maybe cool animations
//BUGS---
//TODO: PONG/#tmi.twitch.tv <empty string> <empty string> // Clears my chat output >:(
//TODO: odd bug that word not guess func does not run sometimes
//TODO: fix that odd warning : Empty string passed to getElementById().

//https://twitch-js.netlify.com/index.html
const MAX_REPEAT_OF_WORDS = 2; // Depends on how long a single category list is

const token = "gwam71i51a99gtupxqssfrzlg4o0qd";
const username = "darkll";
var isConnected = false;
var connectedChannel = ""

var chosenWord = "";
var wordFound = false;
var intervalTimer = null;
var gameFailed;

var list_of_categories = [];

//Holder Object for repeats of words
//Returns: false when there is a word in the list in add() func, true otherwise
function WordRepeatHolder(p_maxHoldingWords) {
  this.usedWords = [];
  this.maxHoldingWords = p_maxHoldingWords;

  this.add = function(word) {

    if (this.usedWords.length == this.maxHoldingWords) {
      //Clear array
      this.usedWords.length = 0;
    }
    for (var key in this.usedWords) {
      if (word === this.usedWords[key]) {
        return false;
      }
    }
    this.usedWords.push(word);
    return true
  }
}
var WordListRepeatHolder = new WordRepeatHolder(MAX_REPEAT_OF_WORDS);

//Warpper Object for tracking categories
function Category(p_id, p_state, p_words) {
  this.id = p_id;
  this.state = p_state;
  this.words = p_words;
}

//Awake Function
$(".input").ready(function() {
  list_of_categories.push(new Category("Game_Switch", true, ["Overwatch", "Teamfortress 2", "League Of Lengends"]));
  list_of_categories.push(new Category("Twitch_Emotes_Switch", false, ["Kappa", "DatShiffy", "LUL"]));
  list_of_categories.push(new Category("Movies_Switch", true, ["Parasite", "2012", "Batman"]));
  list_of_categories.push(new Category("Actions_Switch", false, ["Run", "Kill", "Shoot"]));
  list_of_categories.push(new Category("Actors_Switch", false, ["Leo", "lep", "jar"]));
  list_of_categories.push(new Category("TV_Shows_Switch", false, ["Zoey101", "Lord Of The Rings", "WestWorld"]));
  list_of_categories.push(new Category("BTT_FFZ_Switch", false, ["Kap", "OMEGALUL", "KekW"]));

  for (var cate in list_of_categories) {
    list_of_categories[cate].state = document.getElementById(list_of_categories[cate].id).checked
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
  ConnectTwtichChat();
};

function NextWord() {
  gameFailed = false;
  PickWord();
  StopTimer();
  StartTimer(document.getElementById("timer_Spinner").value);
  document.getElementById("StartGame_btn").style.visibility = "hidden";
  document.getElementById("NextWord_btn").style.visibility = "visible";
}

function ConnectTwtichChat() {
  const channel = document.getElementById("channelName").value;

  if (isConnected) {
    chat.reconnect().then(() => {
      chat.part(connectedChannel);
      chat.join(channel);
      connectedChannel = channel;
    })
  } else {

    const handleMessage = message => {
      console.log(message)
      if (message.event === "PRIVMSG") {
        if (!wordFound && message.message != null && !gameFailed) {

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

function StartTimer(duration) {
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
      WordNotGuessed();
    }
  }, 1000);
}

function StopTimer() {
  if (intervalTimer != null) {
    clearInterval(intervalTimer);
  }
}

function PickWord() {
  wordFound = false;
  chosenWord = "See";

  var word_list = [];

  for (var key in list_of_categories) {
    if (list_of_categories[key].state == true) {
      word_list = word_list.concat(list_of_categories[key].words);
    }
  }

  pickedAWord = false;
  while (!pickedAWord) {
    chosenWord = word_list[Math.floor(Math.random() * word_list.length)];
    pickedAWord = WordListRepeatHolder.add(chosenWord);

  }
  document.getElementById("wb_theWord").innerHTML = chosenWord;

  chosenWord = chosenWord.toLowerCase();

}

function WordGuessed() {
  console.log("WORD GUEESED!")
  StopTimer();
  wordFound = true;
}

function WordNotGuessed() {
  console.log("WORD NOT GUESSED")
  StopTimer();
  gameFailed = true;
}

//Categories All Swtiches Off Prevention
var p = function() {
  var number_of_trues = 0;
  var this_Category_Key = -1;

  for (var key in list_of_categories) {
    if (list_of_categories[key].state == true) {
      number_of_trues++;
    }
    if (list_of_categories[key].id == this.id) {
      this_Category_Key = key;
    }
  }
  if (number_of_trues == 1 && list_of_categories[this_Category_Key].state == true) {
    document.getElementById(this.id).checked = true;
  } else {
    list_of_categories[this_Category_Key].state = !list_of_categories[this_Category_Key].state;
    document.getElementById(this.id).checked = list_of_categories[this_Category_Key].state;
  }
};


//Word Showing

function PopOutWord() {
  var pop_window = window.open('Word_PopOut.html', 'popUpWindow', 'height=500,width=400,left=100,top=100,menubar=no,location=no,directories=no, status=yes');

  pop_window.callback = function(doc) {
    pop_window.document.getElementById("wb_theword_ouput").innerHTML = "hi";
    console.log("looadded");
  }

  console.log(document.domain)

}