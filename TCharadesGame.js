//TODO: make word bank with catagories in json format
//TODO; add in how to play
//TODO: Make sure logining into the twtich api is good
//TODO: make sure to tell to allow pop-out windows
//BUGS---
//TODO: popout will unsync the  word display when you hit F5 on the popout window

//https://twitch-js.netlify.com/index.html
//https://www.cssscript.com/confetti-falling-animation/

const MAX_REPEAT_OF_WORDS = 2; // Depends on how long a single category list is

var isConnected = false;
var connectedChannel = ""

var display_ChosenWord = "--Game Has Not Started--";
var chosenWord = "";
var wordFound = false;
var intervalTimer = null;
var gameFailed;
var list_of_categories = [];

var pop_window = null;

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
  log: { enabled: false },
});

function StartGame() {
  ConnectTwtichChat();
};

function NextRound() {
  gameFailed = false;
  PickWord();
  StopTimer();
  PopOutWord();
  StartTimer(document.getElementById("timer_Spinner").value);
  document.getElementById("NextWord_btn").style.visibility = "visible";
  document.getElementById("StartGame_btn").style.visibility = "hidden";
  document.getElementById("wb_error_msg_box").innerHTML = "";
  document.getElementById("timer_ouput").style.color = "#4682B4";
  var clickSound = document.getElementById("btn_click");
  clickSound.volume = 0.5;
  clickSound.play();
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
        if (message.event === "PRIVMSG") {
          if (!wordFound && message.message != null) {

            document.getElementById("wb_output").innerHTML = ("<strong style=\"color:" + message.tags["color"] + "; \">" + message.username + "</strong>: " + message.message);

            if (message.message.toLowerCase().search("\\b" + chosenWord + "\\b") != -1) {
              WordGuessed();
            }

          }
        };

      }
      // Listen for all events.
    chat.on(TwitchJs.Chat.Events.ALL, handleMessage);

    // Connect ...
    chat.connect().then(() => {
      chat.join(channel).then(() => {
        isConnected = true;
        connectedChannel = channel;
        NextRound();
      }).catch(function(err) {
        console.log(err);
        document.getElementById("wb_error_msg_box").innerHTML = "Error: Make Sure Channel Name Is Filled Correctly.";
      })
    }).catch(function(err) {
      console.log(err);
      document.getElementById("wb_error_msg_box").innerHTML = "Error: Could Not Connect To Twtich API.";
    });

  }
};

function StartTimer(duration) {
  var timer = duration,
    minutes, seconds;

  var runner = function() {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);
    // console.log(pop_window);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer_ouput").innerHTML = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = 0;
      WordNotGuessed();
    }
  };
  runner();
  intervalTimer = setInterval(runner, 1000);
}

function StopTimer() {
  if (intervalTimer != null) {
    clearInterval(intervalTimer);
  }
}

function PickWord() {
  wordFound = false;
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
  document.getElementById("theWord").innerHTML = "???";
  display_ChosenWord = chosenWord;
  updatePopoutWord();
  chosenWord = chosenWord.toLowerCase();
}

function WordGuessed() {
  console.log("WORD GUEESED!");
  wordFound = true;
  document.getElementById("timer_ouput").style.color = "green";
  var winSound = document.getElementById("kids_hooray");
  winSound.volume = 0.5;
  RunConfetti();
  winSound.play();
  GameEnd();
}

async function RunConfetti() {
  confetti.maxCount = 300;
  confetti.particleSpeed = 3;
  confetti.start();
  await new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
  confetti.stop();
}

function WordNotGuessed() {
  if (isConnected && !gameFailed) {
    console.log("WORD NOT GUESSED");
    gameFailed = true;
    document.getElementById("timer_ouput").style.color = "red";
    var winSound = document.getElementById("lose_s");
    winSound.volume = 0.6;
    winSound.play();

    GameEnd();
  }
}

function GameEnd() {
  StopTimer();
  document.getElementById("theWord").innerHTML = display_ChosenWord;

}

//Categories All Swtiches Off Prevention, and Selection
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


//Popout window for word
function PopOutWord() {
  if (pop_window == null || pop_window.closed) {
    pop_window = window.open('Word_PopOut.html', 'PopUpWindow_TCharadesGame', 'height=250,width=600,left=100,top=100,menubar=no,location=no,directories=no, status=yes');
  } else {
    pop_window.focus();
  }
}

window.onbeforeunload = function() {
  if (pop_window != null) {
    pop_window.close();
  }
}

function SetPopOut(ref) {
  pop_window = ref
  pop_window.document.getElementById("theword_ouput").innerHTML = display_ChosenWord;

}

function updatePopoutWord() {
  if (pop_window != null) {
    pop_window.document.getElementById("theword_ouput").innerHTML = display_ChosenWord;
    pop_window.focus();
  }
}