const MAX_WORD_CHAR_COUNT = 45;
var isConnected = false;
var connectedChannelName = ""
var connectedChannel_ID;

var time_Slider_Value = 1;
var display_ChosenWord = "--Game Has Not Started--";
var chosenWord = "";
var image_src_link = "";
var wordFound = false;
var intervalTimer = null;
var gameFailed;
var random_word_list_keys = [];
var word_obj_concat = {};
var word_cur_index = 0;
var canDoLocalStorage = true;
var hasSeenWord = false;

var clickSound;
var winSound;
var img_height = 140;
var img_word = new Image();
var pop_window = null;

//Awake Function
$(document).ready(function() {
  //Set tooltip on
  $('[data-toggle="tooltip"]').tooltip();
  //Sync categoires swtiches state
  for (var cate in list_of_categories) {
    list_of_categories[cate].state = document.getElementById(list_of_categories[cate].id).checked
  };

  //Time Slider Init
  document.getElementById("timer_Spinner").addEventListener('input', timer_slider_num_show, false);
  time_Slider_Value = document.getElementById("timer_Spinner").value * 4;

  //Sounds Init
  clickSound = document.getElementById("btn_click_s");
  clickSound.volume = 0.2;
  winSound = document.getElementById("lose_s");
  winSound.volume = 0.9;

  //Main Button add onclick event
  document.getElementById("main_btn").addEventListener("click", StartGame)

  //Word image setup
  img_word.onload = function() {
    var aspectRatio = (this.width / this.height)
    var new_width = (img_height * aspectRatio);
    var p_img = document.getElementById("image_place");
    p_img.innerHTML = "<img id=\"word_image_main\" class=\"margin_center\" src=\"" + img_word.src + "\" height=\"" + img_height + "\" width=\"" + new_width + "\" style=\"visibility: hidden;\">";
  }
  img_word.onerror = function() {
    this.src = 'images/blank.png';
  };

  //Turn Off Web Request Categories Switches 
  document.getElementById("Dynamic_Categories_Switches").classList.add("opacity-40");
  list_of_web_categories.forEach((cat) => {  $('#' + cat.id).bootstrapToggle('disable') })

  Setup_Shuffle_Words();
})

const {
  chat,
  api
} = new TwitchJs({
  log: { enabled: false, clientId: "gcxxg3g0lghqxl0d4zhttv11sobtf8" },
});

function StartGame() {
  ConnectTwtichChat();
};

function Game_Started() {
  //Change main button to next word btn
  document.getElementById("main_btn").value = "Next Word";
  document.getElementById("main_btn").removeEventListener("click", StartGame);
  document.getElementById("main_btn").addEventListener("click", NextRound);
  //Turn on Dynamic Categories
  document.getElementById("Dynamic_Categories_Switches").classList.remove("opacity-40");
  list_of_web_categories.forEach((cat) => {  $('#' + cat.id).bootstrapToggle('enable') })

  NextRound();
}

function NextRound() {
  gameFailed = false;
  PickWord();
  StopTimer();
  PopOutWord();
  StartTimer(time_Slider_Value);
  document.getElementById("timer_ouput").style.color = "#4682B4";
  document.getElementById("word_image_main").style.visibility = "hidden";
  Error_Notify("", "", true)
  clickSound.play();
}

// Connect To Twtich Channel
function ConnectTwtichChat() {
  const channel = document.getElementById("channelName").value;
  
  chat.connect().then(() => {
    chat.join(channel).then(({ roomState }) => {
      isConnected = true;
      connectedChannel_ID = roomState.roomId;
      connectedChannelName = channel;
      Game_Started();
    }).catch(function(err) {
      Error_Notify("Make Sure Channel Name Is Filled Correctly.", err, false);
    })
  }).catch(function(err) {
    Error_Notify("Could Not Connect To Twtich API.", err, false);
  });

  //Assign Chat Message Handler
  const handleMessage = message => {
    if (message.event === "PRIVMSG") {
      if (!wordFound && message.message != null) {
        if (!gameFailed) {
          var clean_message = DOMPurify.sanitize(message.message, { ALLOWED_TAGS: ['b'] })
          document.getElementById("wb_output").innerHTML = ("<strong class=\"font_pop\" style=\"color:" + message.tags["color"] + "; \">" + message.username + "</strong>: " + clean_message);
          //console.log( message.username + ": " + clean_message)
          if (clean_message.toLowerCase().search("^\\b" + chosenWord + "(\\s|$)") != -1) {
            WordGuessed();
          }

        }
      }
    };

  }
  chat.on(TwitchJs.Chat.Events.ALL, handleMessage);
}

function Error_Notify(err_msg, err, do_clear = false) {
  if (!do_clear) {
    document.getElementById("wb_error_msg_box").style.visibility = "visible";
    document.getElementById("error_msg").innerHTML = err_msg;
    console.log(err);
  } else {
    document.getElementById("wb_error_msg_box").style.visibility = "hidden";
  }
}

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
      //Dynamic Category Addtion
      if (list_of_categories[key] instanceof Dynamic_Category) {
        var gotWords = list_of_categories[key].getWords();
        if (gotWords != -1) {
          word_obj_concat = Object.assign(word_obj_concat, gotWords);
        }
      } else {
        //Normal Category Addtion
        word_obj_concat = Object.assign(word_obj_concat, list_of_categories[key].words);
      }

    }
  }
  random_word_list_keys = shuffleWords(Object.keys(word_obj_concat));
}

function PickWord() {
  wordFound = false;

  chosenWord = random_word_list_keys[word_cur_index];
  image_src_link = word_obj_concat[chosenWord];
  word_cur_index++;
  if (word_cur_index == random_word_list_keys.length) {
    Setup_Shuffle_Words();
  }
  if (image_src_link == "") {
    image_src_link = "images/blank.png"
  }
  img_word.src = image_src_link;
  document.getElementById("the_word").innerHTML = "???";
  display_ChosenWord = chosenWord;
  Check_Seen_Word(chosenWord);
  updatePopoutWord();
  chosenWord = RegExp.escape(chosenWord);
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

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

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
    winSound.play();

    GameEnd();
  }
}

function GameEnd() {
  StopTimer();
  document.getElementById("the_word").innerHTML = display_ChosenWord;
  document.getElementById("word_image_main").style.visibility = "visible";
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

    if (list_of_categories[this_Category_Key].state == true && list_of_categories[this_Category_Key] instanceof Dynamic_Category) {
      $('#' + this.id).bootstrapToggle('off', true);
      list_of_categories[this_Category_Key].state = false
      list_of_categories[this_Category_Key].show_modal();

    } else {
      Setup_Shuffle_Words();
    }
  }
};


//Popout window for word
function PopOutWord() {
  if (pop_window == null || pop_window.closed) {
    pop_window = window.open('popout_word.html', 'PopUpWindow_TCharadesGame', 'height=380,width=680,left=100,top=100,menubar=no,location=no,directories=no, status=yes');
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
  pop_window.Set_Word(display_ChosenWord, image_src_link, canDoLocalStorage ? hasSeenWord : null)
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
    document.getElementById("right_side").classList.add("hidden_tab");
    document.getElementById("note_notes_in").classList.add("hidden_tab");
    document.getElementById("categories_settings").classList.add("hidden_tab");
    document.getElementById("hide_all_tabs_btn").value = "Show All";;


  } else {
    var elements = document.getElementsByClassName("hidden_tab")
    while (elements.length > 0) {
      elements[0].classList.remove("hidden_tab");
    }

    document.getElementById("right_side").classList.add("visible_tab");
    document.getElementById("note_notes_in").classList.add("visible_tab");
    document.getElementById("categories_settings").classList.add("visible_tab");
    document.getElementById("hide_all_tabs_btn").value = "Hide All";

  }
  tabs_hide = !tabs_hide;

}


function timer_slider_num_show() {
  time_Slider_Value = document.getElementById("timer_Spinner").value * 4;
  minutes = parseInt(time_Slider_Value / 60, 10)
  seconds = parseInt(time_Slider_Value % 60, 10);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  $("#div_spinner_time").tooltip('show');
  $("#div_spinner_time").tooltip().attr('data-original-title', (minutes + ":" + seconds));
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
