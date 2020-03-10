var wordShown = false;
var word_holder = "--Game Not Started Yet--";
var image_seen_src = "images/img0004.png"
var image_not_seen_src = "images/img0005.png"

function Set_Word(word, img, has_seen) {
  word_holder = word;
  document.getElementById("word_image_placeholder_pop").src = img;


  if (has_seen != null) {
    document.getElementById("image_seen_not").style.visibility = "visible";
    if (has_seen) {
      document.getElementById("image_seen_not").src = image_seen_src;
      document.getElementById("image_seen_not").title = "You have Seen this word.";
    } else {
      document.getElementById("image_seen_not").src = image_not_seen_src;
      document.getElementById("image_seen_not").title = "You have not seen this word.";
    }
  } else {
    document.getElementById("image_seen_not").src = "";
    document.getElementById("image_seen_not").title = "";
    document.getElementById("image_seen_not").style.visibility = "hidden";
  }

}

function word_module_show_btn() {

  if (!wordShown) {
    document.getElementById("show_hide_theword_btn").value = "Hide";
    document.getElementById("theword_ouput").innerHTML = word_holder;
    document.getElementById("word_image_placeholder_pop").style.visibility = "visible";

  } else {
    document.getElementById("show_hide_theword_btn").value = "Show";
    document.getElementById("theword_ouput").innerHTML = "???";
    document.getElementById("word_image_placeholder_pop").style.visibility = "hidden";

  }
  wordShown = !wordShown;
}