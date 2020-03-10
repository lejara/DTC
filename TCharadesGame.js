var isConnected = false;
var connectedChannel = ""

var display_ChosenWord = "--Game Has Not Started--";
var chosenWord = "";
var image_ChosenWord = "";
var wordFound = false;
var intervalTimer = null;
var gameFailed;
var random_word_list_keys = [];
var word_obj_concat = {};
var word_cur_index = 0;
var canDoLocalStorage = true;
var hasSeenWord = false;

var pop_window = null;

//Awake Function
$(".input").ready(function() {
  for (var cate in list_of_categories) {
    list_of_categories[cate].state = document.getElementById(list_of_categories[cate].id).checked
  };

  document.getElementById("timer_Spinner").addEventListener('input', timer_slider_num_show, false);

  Setup_Shuffle_Words();
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
  document.getElementById("word_image_placeholder").innerHTML = "";
  var clickSound = document.getElementById("btn_click");
  clickSound.volume = 0.2;
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
            if (!gameFailed) {
              var clean_message = DOMPurify.sanitize(message.message, { ALLOWED_TAGS: ['b'] })
              document.getElementById("wb_output").innerHTML = ("<strong style=\"color:" + message.tags["color"] + "; \">" + message.username + "</strong>: " + clean_message);
              if (clean_message.toLowerCase().search("^" + chosenWord) != -1) {
                WordGuessed();
              }

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
        HideAllTabs();
        document.getElementById("hide_all_tabs_btn").style.visibility = "visible";
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

function Setup_Shuffle_Words() {
  word_cur_index = 0;
  random_word_list_keys = [];
  word_obj_concat = {};
  for (var key in list_of_categories) {
    if (list_of_categories[key].state == true) {
      word_obj_concat = Object.assign(word_obj_concat, list_of_categories[key].words);
    }
  }
  random_word_list_keys = shuffleWords(Object.keys(word_obj_concat));
}

function PickWord() {
  wordFound = false;

  chosenWord = random_word_list_keys[word_cur_index];
  image_ChosenWord = word_obj_concat[chosenWord];
  word_cur_index++;
  if (word_cur_index == random_word_list_keys.length) {
    Setup_Shuffle_Words();
  }

  document.getElementById("theWord").innerHTML = "???";
  display_ChosenWord = chosenWord;
  Check_Seen_Word(chosenWord);
  updatePopoutWord();
  chosenWord = chosenWord.toLowerCase();
}

function shuffleWords(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
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
  if (isConnected && !gameFailed && !wordFound) {
    console.log("WORD NOT GUESSED");
    gameFailed = true;
    document.getElementById("timer_ouput").style.color = "red";
    document.getElementById("wb_output").innerHTML = "...";
    var winSound = document.getElementById("lose_s");
    winSound.volume = 0.9;
    winSound.play();

    GameEnd();
  }
}

function GameEnd() {
  StopTimer();
  document.getElementById("theWord").innerHTML = display_ChosenWord;
  document.getElementById("word_image_placeholder").innerHTML = "<img style=\"display: block;max-width:150px;max-height:150px;width: auto;height: auto; top:0;left:0; right:0; bottom:0; position:absolute; margin:auto\" src=\"" + image_ChosenWord + "\"></img>"

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
    $('#' + this.id).bootstrapToggle('on', true);
  } else {
    list_of_categories[this_Category_Key].state = !list_of_categories[this_Category_Key].state;
    Setup_Shuffle_Words();

  }
};


//Popout window for word
function PopOutWord() {
  if (pop_window == null || pop_window.closed) {
    pop_window = window.open('Word_PopOut.html', 'PopUpWindow_TCharadesGame', 'height=340,width=550,left=100,top=100,menubar=no,location=no,directories=no, status=yes');
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
  SetPopOutValues();

}

function updatePopoutWord() {
  if (pop_window != null) {
    SetPopOutValues();
    pop_window.focus();
  }
}

function SetPopOutValues() {
  pop_window.document.getElementById("word_image_placeholder_pop").innerHTML = "<img style=\"display: block;max-width:150px;max-height:150px;width: auto;height: auto; top:0;left:0; right:0; bottom:0; position:absolute; margin:auto\" src=\"" + image_ChosenWord + "\"></img>"
  pop_window.document.getElementById("theword_ouput").innerHTML = display_ChosenWord;
  Set_Seen_Word_Popout_Indicator();

}

function Set_Seen_Word_Popout_Indicator() {
  if (canDoLocalStorage) {
    if (hasSeenWord) {
      pop_window.document.getElementById("seen_eye").style.visibility = "visible";
      pop_window.document.getElementById("not_seen_eye").style.visibility = "hidden";
    } else {
      pop_window.document.getElementById("seen_eye").style.visibility = "hidden";
      pop_window.document.getElementById("not_seen_eye").style.visibility = "visible";
    }

  } else {
    pop_window.document.getElementById("seen_eye").style.visibility = "hidden";
    pop_window.document.getElementById("not_seen_eye").style.visibility = "hidden";
  }

}

function Check_Seen_Word(word) {
  if (canDoLocalStorage) {
    try {
      var seenWord = localStorage.getItem(word);

      if (seenWord != null) {
        hasSeenWord = true;
      } else {
        localStorage.setItem(word, "");
        hasSeenWord = false;
      }
    } catch (err) {
      console.log(err);
      canDoLocalStorage = false;
    }
  }
}

function Clear_Seen_all() {
  // Clear all items
  localStorage.clear();
}

//Tabs hide
var tabs_hide = false;

function HideAllTabs() {
  if (!tabs_hide) {
    var elements = document.getElementsByClassName("visible_tab")
    while (elements.length > 0) {
      elements[0].classList.remove("visible_tab");
    }
    document.getElementById("donatros_acc").classList.add("hidden_tab");
    document.getElementById("wb_instruct").classList.add("hidden_tab");
    document.getElementById("Patch_Notes_DropDown").classList.add("hidden_tab");
    document.getElementById("hide_all_tabs_btn").value = "Show All";;
    document.getElementById("settings_layer").classList.add("hidden_tab");

  } else {
    var elements = document.getElementsByClassName("hidden_tab")
    while (elements.length > 0) {
      elements[0].classList.remove("hidden_tab");
    }
    document.getElementById("donatros_acc").classList.add("visible_tab");
    document.getElementById("wb_instruct").classList.add("visible_tab");
    document.getElementById("Patch_Notes_DropDown").classList.add("visible_tab");
    document.getElementById("hide_all_tabs_btn").value = "Hide All";
    document.getElementById("settings_layer").classList.add("visible_tab");
  }
  tabs_hide = !tabs_hide;

}

function timer_slider_num_show() {
  time = document.getElementById("timer_Spinner").value * 4
  minutes = parseInt(time / 60, 10)
  seconds = parseInt(time % 60, 10);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("time_slide_display").innerHTML = minutes + ":" + seconds;
}