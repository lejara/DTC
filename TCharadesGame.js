const MAX_REPEAT_OF_WORDS = 20;

var isConnected = false;
var connectedChannel = ""

var display_ChosenWord = "--Game Has Not Started--";
var chosenWord = "";
var image_ChosenWord = "";
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
  list_of_categories.push(new Category("Game_Switch", true, { "Pong": "", "Space Invaders": "", "Pac Man": "", "Donkey Kong": "", "Tetris": "", "Super Mario Bros": "", "Contra": "", "Double Dragon": "", "Punch Out": "", "Mega Man": "", "Prince of Persia": "", "SimCity": "", "Monkey Island": "", "Another World": "", "Civilization": "", "Lemmings": "", "Sonic": "", "Street Fighter": "", "Mortal Kombat": "", "Wolfenstein": "", "Doom": "", "NBA Jam": "", "Secret of Mana": "", "Star Fox": "", "Syndicate": "", "EarthBound": "", "Super Metroid": "", "Chrono Trigger": "", "Duke Nukem 3D": "", "Final Fantasy": "", "Pokémon": "", "Quake": "", "Resident Evil": "", "Tomb Raider": "", "Castlevania": "", "GoldenEye 007": "", "Gran Turismo": "", "Tekken": "", "Fallout": "", "Grim Fandango": "", "Half Life": "", "Metal Gear": "", "SoulCalibur": "", "StarCraft": "", "Age of Empires": "", "Homeworld": "", "Unreal Tournament": "", "Counter Strike": "", "Deus Ex": "", "Diablo": "", "Jet Set Radio": "", "The Sims": "", "Advance Wars": "", "Animal Crossing": "", "Grand Theft Auto": "", "Max Payne": "", "Silent Hill 2": "", "Super Smash Bros": "", "Kingdom Hearts": "", "Metroid Prime": "", "Half-Life 2": "", "World of Warcraft": "", "Devil May Cry": "", "God of War": "", "Guitar Hero": "", "Psychonauts": "", "Shadow of the Colossus": "", "The Elder Scrolls": "", "Gears of War": "", "Hitman": "", "Wii Sports": "", "BioShock": "", "Call of Duty": "", "Halo": "", "Portal": "", "Super Mario Galaxy": "", "Team Fortress 2": "", "Dead Space": "", "Left 4 Dead": "", "Persona 4": "", "Spelunky": "", "Assassin's Creed": "", "Left 4 Dead 2": "", "Uncharted": "", "Limbo": "", "Mass Effect 2": "", "Red Dead Redemption": "", "Rock Band": "", "StarCraft II": "", "Super Meat Boy": "", "Dark Souls": "", "Minecraft": "", "Portal 2": "", "Dishonored": "", "Journey": "", "The Walking Dead": "", "Dota 2": "", "The Last of Us": "", "Bloodborne": "", "The Witcher 3": "", "Inside": "", "Overwatch": "", "The Legend of Zelda": "", "League Of Legends": "" }));
  list_of_categories.push(new Category("Twitch_Emotes_Switch", false, { "4Head": "https://static-cdn.jtvnw.net/emoticons/v1/354/3.0", "ANELE": "https://static-cdn.jtvnw.net/emoticons/v1/3792/3.0", "BabyRage": "https://static-cdn.jtvnw.net/emoticons/v1/22639/3.0", "BibleThump": "https://static-cdn.jtvnw.net/emoticons/v1/86/3.0", "BlessRNG": "https://static-cdn.jtvnw.net/emoticons/v1/153556/3.0", "BloodTrail": "https://static-cdn.jtvnw.net/emoticons/v1/69/3.0", "BOP": "https://static-cdn.jtvnw.net/emoticons/v1/301428702/3.0", "BrokeBack": "https://static-cdn.jtvnw.net/emoticons/v1/4057/3.0", "cmonBruh": "https://static-cdn.jtvnw.net/emoticons/v1/84608/3.0", "CoolCat": "https://static-cdn.jtvnw.net/emoticons/v1/58127/3.0", "CoolStoryBob": "https://static-cdn.jtvnw.net/emoticons/v1/123171/3.0", "CurseLit": "https://static-cdn.jtvnw.net/emoticons/v1/116625/3.0", "DansGame": "https://static-cdn.jtvnw.net/emoticons/v1/33/3.0", "DarkMode": "https://static-cdn.jtvnw.net/emoticons/v1/461298/3.0", "DatSheffy": "https://static-cdn.jtvnw.net/emoticons/v1/111700/3.0", "DoritosChip": "https://static-cdn.jtvnw.net/emoticons/v1/102242/3.0", "duDudu": "https://static-cdn.jtvnw.net/emoticons/v1/62834/3.0", "EleGiggle": "https://static-cdn.jtvnw.net/emoticons/v1/4339/3.0", "FailFish": "https://static-cdn.jtvnw.net/emoticons/v1/360/3.0", "FBCatch": "https://static-cdn.jtvnw.net/emoticons/v1/1441281/3.0", "FBPass": "https://static-cdn.jtvnw.net/emoticons/v1/1441271/3.0", "FBRun": "https://static-cdn.jtvnw.net/emoticons/v1/1441261/3.0", "FBSpiral": "https://static-cdn.jtvnw.net/emoticons/v1/1441273/3.0", "FBtouchdown": "https://static-cdn.jtvnw.net/emoticons/v1/626795/3.0", "FrankerZ": "https://static-cdn.jtvnw.net/emoticons/v1/65/3.0", "FutureMan": "https://static-cdn.jtvnw.net/emoticons/v1/98562/3.0", "GivePLZ": "https://static-cdn.jtvnw.net/emoticons/v1/112291/3.0", "GunRun": "https://static-cdn.jtvnw.net/emoticons/v1/1584743/3.0", "HeyGuys": "https://static-cdn.jtvnw.net/emoticons/v1/30259/3.0", "HolidaySanta": "https://static-cdn.jtvnw.net/emoticons/v1/1713822/3.0", "HolidayTree": "https://static-cdn.jtvnw.net/emoticons/v1/1713825/3.0", "HotPokket": "https://static-cdn.jtvnw.net/emoticons/v1/357/3.0", "imGlitch": "https://static-cdn.jtvnw.net/emoticons/v1/112290/3.0", "ItsBoshyTime": "https://static-cdn.jtvnw.net/emoticons/v1/133468/3.0", "Jebaited": "https://static-cdn.jtvnw.net/emoticons/v1/114836/3.0", "KAPOW": "https://static-cdn.jtvnw.net/emoticons/v1/133537/3.0", "Kappa": "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0", "KappaClaus": "https://static-cdn.jtvnw.net/emoticons/v1/74510/3.0", "KappaPride": "https://static-cdn.jtvnw.net/emoticons/v1/55338/3.0", "KappaRoss": "https://static-cdn.jtvnw.net/emoticons/v1/70433/3.0", "KappaWealth": "https://static-cdn.jtvnw.net/emoticons/v1/81997/3.0", "Kappu": "https://static-cdn.jtvnw.net/emoticons/v1/160397/3.0", "Keepo": "https://static-cdn.jtvnw.net/emoticons/v1/1902/3.0", "KonCha": "https://static-cdn.jtvnw.net/emoticons/v1/160400/3.0", "Kreygasm": "https://static-cdn.jtvnw.net/emoticons/v1/41/3.0", "LUL": "https://static-cdn.jtvnw.net/emoticons/v1/425618/3.0", "Mau5": "https://static-cdn.jtvnw.net/emoticons/v1/30134/3.0", "mcaT": "https://static-cdn.jtvnw.net/emoticons/v1/35063/3.0", "MercyWing1": "https://static-cdn.jtvnw.net/emoticons/v1/1003187/3.0", "MercyWing2": "https://static-cdn.jtvnw.net/emoticons/v1/1003189/3.0", "MingLee": "https://static-cdn.jtvnw.net/emoticons/v1/68856/3.0", "MorphinTime": "https://static-cdn.jtvnw.net/emoticons/v1/156787/3.0", "MrDestructoid": "https://static-cdn.jtvnw.net/emoticons/v1/28/3.0", "NinjaGrumpy": "https://static-cdn.jtvnw.net/emoticons/v1/138325/3.0", "NotLikeThis": "https://static-cdn.jtvnw.net/emoticons/v1/58765/3.0", "OpieOP": "https://static-cdn.jtvnw.net/emoticons/v1/100590/3.0", "PartyHat": " https://static-cdn.jtvnw.net/emoticons/v1/965738/3.0", "PartyTime": "https://static-cdn.jtvnw.net/emoticons/v1/135393/3.0", "PinkMercy": "https://static-cdn.jtvnw.net/emoticons/v1/1003190/3.0", "PipeHype": "https://static-cdn.jtvnw.net/emoticons/v1/4240/3.0", "PixelBob": "https://static-cdn.jtvnw.net/emoticons/v1/1547903/3.0", "PJSalt": "https://static-cdn.jtvnw.net/emoticons/v1/36/3.0", "PJSugar": "https://static-cdn.jtvnw.net/emoticons/v1/102556/3.0", "PogChamp": "https://static-cdn.jtvnw.net/emoticons/v1/88/3.0", "PopCorn": "https://static-cdn.jtvnw.net/emoticons/v1/724216/3.0", "PowerUpL": "https://static-cdn.jtvnw.net/emoticons/v1/425688/3.0", "PrimeMe": "https://static-cdn.jtvnw.net/emoticons/v1/115075/3.0", "PunchTrees": "https://static-cdn.jtvnw.net/emoticons/v1/47/3.0", "PunOko": "https://static-cdn.jtvnw.net/emoticons/v1/160401/3.0", "ResidentSleeper": "https://static-cdn.jtvnw.net/emoticons/v1/245/3.0", "riPepperonis": "https://static-cdn.jtvnw.net/emoticons/v1/62833/3.0", "SeemsGood": "https://static-cdn.jtvnw.net/emoticons/v1/64138/3.0", "SingsMic": "https://static-cdn.jtvnw.net/emoticons/v1/300116349/3.0", "SingsNote": "https://static-cdn.jtvnw.net/emoticons/v1/300116350/3.0", "SMOrc": "https://static-cdn.jtvnw.net/emoticons/v1/52/3.0", "Squid2": "https://static-cdn.jtvnw.net/emoticons/v1/191763/3.0", "Squid3": "https://static-cdn.jtvnw.net/emoticons/v1/191764/3.0", "Squid4": "https://static-cdn.jtvnw.net/emoticons/v1/191767/3.0", "SSSsss": "https://static-cdn.jtvnw.net/emoticons/v1/46/3.0", "StinkyCheese": "https://static-cdn.jtvnw.net/emoticons/v1/90076/3.0", "SwiftRage": "https://static-cdn.jtvnw.net/emoticons/v1/34/3.0", "TakeNRG": "https://static-cdn.jtvnw.net/emoticons/v1/112292/3.0", "TearGlove": "https://static-cdn.jtvnw.net/emoticons/v1/160403/3.0", "TheIlluminati": "https://static-cdn.jtvnw.net/emoticons/v1/145315/3.0", "TombRaid": "https://static-cdn.jtvnw.net/emoticons/v1/864205/3.0", "TriHard": "https://static-cdn.jtvnw.net/emoticons/v1/120232/3.0", "TwitchLit": "https://static-cdn.jtvnw.net/emoticons/v1/166263/3.0", "twitchRaid": "https://static-cdn.jtvnw.net/emoticons/v1/62836/3.0", "TwitchRPG": "https://static-cdn.jtvnw.net/emoticons/v1/1220086/3.0", "TwitchSings": "https://static-cdn.jtvnw.net/emoticons/v1/300116344/3.0", "TwitchVotes": "https://static-cdn.jtvnw.net/emoticons/v1/479745/3.0", "VoHiYo": "https://static-cdn.jtvnw.net/emoticons/v1/81274/3.0", "VoteNay": "https://static-cdn.jtvnw.net/emoticons/v1/106294/3.0", "VoteYea": "https://static-cdn.jtvnw.net/emoticons/v1/106293/3.0", "WutFace": "https://static-cdn.jtvnw.net/emoticons/v1/28087/3.0" }));
  list_of_categories.push(new Category("Movies_Switch", true, { "Parasite": "", "The Godfather": "", "The Dark Knight": "", "Schindler's List": "", "The Lord of the Rings": "", "Fight Club": "", "Forrest Gump": "", "Inception": "", "The Matrix": "", "Goodfellas": "", "Interstellar": "", "Saving Private Ryan": "", "Spirited Away": "", "Raiders of the Lost Ark": "", "Terminator": "", "Back to the Future": "", "Star Wars": "", "The Shining": "", "The Dark Knight Rises": "", "Princess Mononoke": "", "Vertigo": "", "Toy Story": "", "Monty Python": "", "Inside Out": "", "Inglourious Basterds": "", "Indiana Jones": "", "Batman Begins": "", "Up": "", "Die Hard": "", "My Neighbor Totoro": "", "Blade Runner": "", "Howl's Moving Castle": "", "The Wolf of Wall Street": "", "The Big Lebowski": "", "How to Train Your Dragon": "", "Finding Nemo": "", "Kill Bill": "", "Platoon": "", "The Martian": "", "Persona": "", "The Princess Bride": "", "The Grand Budapest Hotel": "", "In the Name of the Father": "", "Jurassic Park": "", "The Wizard of Oz": "", "Before Sunrise": "", "Strangers on a Train": "", "The Truman Show": "", "Groundhog Day": "", "Monsters Inc": "", "Jaws": "", "Rocky": "", "Harry Potter": "", "The Avengers": "", "Guardians of the Galaxy": "", "Pirates of the Caribbean": "", "Beauty and the Beast": "", "Dumbo": "", "Mulan": "", "Pocahontas": "", "Princess and the Frog": "", "Robin Hood": "", "Snow White": "", "Peter Pan": "", "Lady and the Tramp": "", "Aladdin": "", "Hercules": "", "The Jungle Book": "", "Spiderman": "", "Valentine's Day": "", "Grease": "", "The Hunger Games": "", "Castaway": "", "The Grinch": "", "Mean Girls": "", "Skyfall": "", "Life of Pi": "", "The Breakfast Club": "", "Titanic": "", "Madagascar": "", "Avatar": "", "Star Trek": "", "Scary Movie": "", "Saw": "", "Shrek": "", "The Hangover": "", "Elf": "", "Frankenstein": "", "A Space Odyssey": "", "Mary Poppins": "", "Braveheart": "", "Slumdog Millionaire": "", "Wall-E": "", "Ghostbusters": "", "Brokeback Mountain": "", "The Lion King": "", "Black Panther": "", "Lincoln": "", "Dunkirk": "", "The Irishman": "", "Mad Max": "", "The Social Network": "", "Moonlight": "", "Twilight": "", "The Notebook": "", "The Fast and the Furious": "", "Mamma Mia": "", "Zoolander": "", "Transformers": "", "Legally Blonde": "", "Spy Kids": "", "X-Men": "", "Wedding Crashers": "", "Happy Feet": "", "School of Rock": "", "Thor": "", "Iron Man": "", "The Incredibles": "", "E.T": "", "Dirty Dancing": "", "Top Gun": "", "Beetlejuice": "", "Home Alone": "", "The Karate Kid": "", "Winnie the Pooh": "", "Tangled": "", "Wreck-It Ralph": "", "Alice in Wonderland": "", "Big Hero 6": "", "Tarzan": "", "Zootopia": "", "Frozen": "", "The Little Mermaid": "", "101 Dalmatians": "" }));
  list_of_categories.push(new Category("Actions_Switch", false, { "Accept": "", "Accuse": "", "Achieve": "", "Acknowledge": "", "Acquire": "", "Adapt": "", "Add": "", "Adjust": "", "Admire": "", "Admit": "", "Adopt": "", "Adore": "", "Advise": "", "Afford": "", "Agree": "", "Aim": "", "Allow": "", "Announce": "", "Anticipate": "", "Apologize": "", "Appear": "", "Apply": "", "Appreciate": "", "Approach": "", "Approve": "", "Argue": "", "Arise": "", "Arrange": "", "Arrive": "", "Ask": "", "Assume": "", "Assure": "", "Astonish": "", "Attach": "", "Attempt": "", "Attend": "", "Attract": "", "Avoid": "", "Awake": "", "Beat": "", "Become": "", "Beg": "", "Begin": "", "Behave": "", "Believe": "", "Belong": "", "Bend": "", "Bet": "", "Bind": "", "Bite": "", "Blow": "", "Boil": "", "Borrow": "", "Bounce": "", "Bow": "", "Break": "", "Breed": "", "Bring": "", "Broadcast": "", "Build": "", "Burn": "", "Catch": "", "Celebrate": "", "Change": "", "Choose": "", "Chop": "", "Claim": "", "Climb": "", "Cling": "", "Come": "", "Commit": "", "Communicate": "", "Compare": "", "Compete": "", "Complain": "", "Complete": "", "Concern": "", "Confirm": "", "Consent": "", "Consider": "", "Consist": "", "Consult": "", "Contain": "", "Continue": "", "Convince": "", "Cook": "", "Cost": "", "Count": "", "Crawl": "", "Create": "", "Demand": "", "Deny": "", "Depend": "", "Describe": "", "Deserve": "", "Desire": "", "Destroy": "", "Determine": "", "Develop": "", "Differ": "", "Disagree": "", "Discover": "", "Discuss": "", "Dislike": "", "Distribute": "", "Dive": "", "Do": "", "Doubt": "", "Drag": "", "Dream": "", "Be": "", "Call": "", "Feel": "", "Find": "", "Get": "", "Give": "", "Go": "", "Have": "", "Hear": "", "Help": "", "Keep": "", "Know": "", "Leave": "", "Let": "", "Like": "", "Live": "", "Look": "", "Make": "", "May": "", "Mean": "", "Might": "", "Move": "", "Need": "", "Play": "", "Put": "", "Run": "", "Say": "", "See": "", "Seem": "", "Should": "", "Show": "", "Start": "", "Take": "", "Talk": "", "Tell": "", "Think": "", "Try": "", "Turn": "", "Use": "", "Want": "", "Work": "", "Shoot": "", "Kill": "" }));
  list_of_categories.push(new Category("Actors_Sing_Switch", false, { "Johnny Depp": "https://m.media-amazon.com/images/M/MV5BMTM0ODU5Nzk2OV5BMl5BanBnXkFtZTcwMzI2ODgyNQ@@._V1_UY209_CR3,0,140,209_AL_.jpg", "Leonardo DiCaprio": "https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_UY209_CR7,0,140,209_AL_.jpg", "Tom Hanks": "https://m.media-amazon.com/images/M/MV5BMTQ2MjMwNDA3Nl5BMl5BanBnXkFtZTcwMTA2NDY3NQ@@._V1_UY317_CR2,0,214,317_AL_.jpg", "Tom Cruise": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Tom_Cruise_by_Gage_Skidmore.jpg/220px-Tom_Cruise_by_Gage_Skidmore.jpg", "Robert Downey Jr": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/220px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg", "Brad Pitt": "https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_UX140_CR0,0,140,209_AL_.jpg", "Harrison Ford": "https://m.media-amazon.com/images/M/MV5BMTY4Mjg0NjIxOV5BMl5BanBnXkFtZTcwMTM2NTI3MQ@@._V1_UY209_CR0,0,140,209_AL_.jpg", "Matt Damon": "https://m.media-amazon.com/images/M/MV5BMTM0NzYzNDgxMl5BMl5BanBnXkFtZTcwMDg2MTMyMw@@._V1_UY209_CR8,0,140,209_AL_.jpg", "Clint Eastwood": "https://m.media-amazon.com/images/M/MV5BMTg3MDc0MjY0OV5BMl5BanBnXkFtZTcwNzU1MDAxOA@@._V1_UY317_CR10,0,214,317_AL_.jpg", "Will Smith": "https://imgix.ranker.com/user_node_img/120/2399718/original/will-smith-photo-u116?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Robert De Niro": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Robert_De_Niro_3_by_David_Shankbone.jpg/1200px-Robert_De_Niro_3_by_David_Shankbone.jpg", "Chris Hemsworth": "https://www.gstatic.com/tv/thumb/persons/528854/528854_v9_bb.jpg", "Samuel Jackson": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Samuel_L._Jackson_2019_by_Glenn_Francis.jpg/220px-Samuel_L._Jackson_2019_by_Glenn_Francis.jpg", "Zac Efron": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zac_Efron_at_the_Baywatch_Red_Carpet_Premiere_Sydney_Australia.jpg", "George Clooney": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/George_Clooney_2016.jpg/220px-George_Clooney_2016.jpg", "Kevin Spacey": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kevin_Spacey%2C_May_2013.jpg/220px-Kevin_Spacey%2C_May_2013.jpg", "Ben Affleck": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/220px-Ben_Affleck_by_Gage_Skidmore_3.jpg", "Adam Sandler": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Adam_Sandler_2011_%28Cropped%29.jpg/220px-Adam_Sandler_2011_%28Cropped%29.jpg", "Bruce Willis": "https://m.media-amazon.com/images/M/MV5BMjA0MjMzMTE5OF5BMl5BanBnXkFtZTcwMzQ2ODE3Mw@@._V1_UY209_CR19,0,140,209_AL_.jpg", "Robert Pattinson": "https://resizing.flixster.com/7iMvhZK5oAOUpPUrve1Qb0H7WZI=/540x720/v1.bjs3NTcwNDE7ajsxODM2ODsxMjAwOzU0MDs3MjA", "Jennifer Lawrence": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/220px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg", "Natalie Portman": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Natalie_Portman_%2848470988352%29_%28cropped%29.jpg/220px-Natalie_Portman_%2848470988352%29_%28cropped%29.jpg", "Diane Keaton": "https://cdn.britannica.com/90/205790-050-2C5E5478/Diane-Keaton-2007.jpg", "Anne Hathaway": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Anne_Hathaway_in_2017.png", "Halle Berry": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Halle_Berry_by_Gage_Skidmore_2.jpg/220px-Halle_Berry_by_Gage_Skidmore_2.jpg", "Angelina Jolie": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Angelina_Jolie_2_June_2014_%28cropped%29.jpg", "Sandra Bullock": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Sandra_Bullock_%289192365016%29_%28cropped%29.jpg", "Julia Roberts": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Julia_Roberts_2011_Shankbone_3.JPG/1200px-Julia_Roberts_2011_Shankbone_3.JPG", "Jennifer Aniston": "https://www.cheatsheet.com/wp-content/uploads/2020/02/Jennifer-Aniston-4-1024x718.jpg", "Don Cheadle": "https://m.media-amazon.com/images/M/MV5BNDMxNDM3MzY5N15BMl5BanBnXkFtZTcwMjkzOTY4MQ@@._V1_UY209_CR12,0,140,209_AL_.jpg", "Jim Carrey": "https://m.media-amazon.com/images/M/MV5BMTQwMjAwNzI0M15BMl5BanBnXkFtZTcwOTY1MTMyOQ@@._V1_UY209_CR15,0,140,209_AL_.jpg", "Bill Murray": "https://m.media-amazon.com/images/M/MV5BMTQ1OTM0MjEwOF5BMl5BanBnXkFtZTYwNTQwNzI1._V1_UY209_CR1,0,140,209_AL_.jpg", "Emma Watson": "https://m.media-amazon.com/images/M/MV5BMTQ3ODE2NTMxMV5BMl5BanBnXkFtZTgwOTIzOTQzMjE@._V1_.jpg", "Robin Williams": "https://m.media-amazon.com/images/M/MV5BNTYzMjc2Mjg4MF5BMl5BanBnXkFtZTcwODc1OTQwNw@@._V1_UX140_CR0,0,140,209_AL_.jpg", "Cameron Diaz": "https://peopledotcom.files.wordpress.com/2019/08/cameron-1-e1565720754770.jpg?w=2820&h=2002", "Eva Longoria": "https://upload.wikimedia.org/wikipedia/commons/1/16/Eva_Longoria_Cannes_2015.jpg", "Emma Stone": "https://media.glamour.com/photos/5801188e88c72cba40ad33ad/master/pass/Glamour-Emma-Stone-Hair.jpg", "Drake": "https://imgix.ranker.com/user_node_img/26/510514/original/aubrey-graham-photo-u164?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Tupac": "https://imgix.ranker.com/user_node_img/115/2286941/original/tupac-shakur-u95?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Eminem": "https://imgix.ranker.com/user_node_img/47/937841/original/eminem-photo-u124?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Kendrick Lamar": "https://imgix.ranker.com/user_node_img/3107/62130966/original/kendrick-lamar-recording-artists-and-groups-photo-u2?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Charles Chaplin": "https://m.media-amazon.com/images/M/MV5BNDcwMDc0ODAzOF5BMl5BanBnXkFtZTgwNTY2OTI1MDE@._V1_UX140_CR0,0,140,209_AL_.jpg", "Dr Dre": "https://imgix.ranker.com/user_node_img/45/891691/original/dr-dre-recording-artists-and-groups-photo-u6?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Snoop Dogg": "https://imgix.ranker.com/node_img/103/2051727/original/snoop-dogg-writers-photo-4?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Ice Cube": "https://imgix.ranker.com/user_node_img/61/1206369/original/ice-cube-recording-artists-and-groups-photo-u3?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "50 Cent": "https://imgix.ranker.com/user_node_img/19/366178/original/50-cent-recording-artists-and-groups-photo-u64?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Kanye West": "https://imgix.ranker.com/user_node_img/68/1347110/original/kanye-west-recording-artists-and-groups-photo-u68?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Lil Wayne": "https://imgix.ranker.com/user_node_img/46/900679/original/lil-wayne-photo-u92?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Logic": "https://imgix.ranker.com/user_node_img/3830/76581019/original/logic-photo-u6?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Travis Scott": "https://imgix.ranker.com/user_node_img/3732/74635386/original/travis-scott-u8?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Big L": "https://imgix.ranker.com/node_img/30/581531/original/big-l-recording-artists-and-groups-photo-1?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Tech N9ne": "https://imgix.ranker.com/user_node_img/108/2156023/original/tech-n9ne-u12?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "XXXTentacion": "https://imgix.ranker.com/user_node_img/4269/85371778/original/xxxtentacion-photo-u10?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "2 Chainz": "https://imgix.ranker.com/user_node_img/3379/67578782/original/2-chainz-photo-u27?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Ice T": "https://imgix.ranker.com/user_node_img/61/1206533/original/ice-t-recording-artists-and-groups-photo-u3?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Juice Wrld": "https://imgix.ranker.com/user_node_img/4269/85375015/original/juice-wrld-photo-u8?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Q Tip": "https://imgix.ranker.com/user_node_img/483/9650505/original/q-tip-recording-artists-and-groups-photo-u1?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Future": "https://imgix.ranker.com/user_node_img/3177/63525027/original/future-recording-artists-and-groups-photo-u1?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Lil Uzi": "https://imgix.ranker.com/user_node_img/4269/85371802/original/lil-uzi-vert-photo-u10?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "21 Savage": "https://imgix.ranker.com/user_node_img/4269/85371779/original/21-savage-photo-u10?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "Nicki Minaj": "https://imgix.ranker.com/user_node_img/569/11363664/original/nicki-minaj-photo-u237?w=125&h=125&fit=crop&crop=faces&q=60&fm=pjpg", "The Black Eyed Peas": "https://charts-static.billboard.com/img/1840/12/the-black-eyed-peas-99h.jpg", "T.I": "https://charts-static.billboard.com/img/2017/07/ti.jpg", "Fall Out Boy": "https://charts-static.billboard.com/img/2017/07/fall-out-boy.jpg", "Taylor Swift": "https://charts-static.billboard.com/img/2016/12/taylor-swift.jpg", "Usher": "https://charts-static.billboard.com/img/1993/08/usher-oqp.jpg", "Katy Perry": "https://www.billboard.com/files/styles/article_main_image/public/media/katy-perry-oct-2019-billboard-1548.jpg", "Lady Gaga": "https://www.cheatsheet.com/wp-content/uploads/2019/10/lady-gaga-1024x683.jpg", "Justin Bieber": "https://charts-static.billboard.com/img/2009/07/justin-bieber-4oh.jpg", "Bruno Mars": "https://charts-static.billboard.com/img/2010/01/bruno-mars-va7.jpg", "Michael Jackson": "http://charts-static.billboard.com/img/1840/12/michael-jackson-9to.jpg", "Selena Gomez": "https://charts-static.billboard.com/img/2008/06/selena-gomez-nxt.jpg", "Pink": "https://charts-static.billboard.com/img/2017/04/pnk.jpg", "Shakira": "https://charts-static.billboard.com/img/2017/06/shakira.jpg", "will.i.am": "https://charts-static.billboard.com/img/2005/12/william-md4.jpg", "Britney Spears": "https://charts-static.billboard.com/img/2017/02/britney-spears.jpg", "Flo Rida": "https://charts-static.billboard.com/img/2017/05/flo-rida.jpg", "Joe Pesci": "https://m.media-amazon.com/images/M/MV5BMzc3MTcxNDYxNV5BMl5BanBnXkFtZTcwOTI3NjE1Mw@@._V1_UX140_CR0,0,140,209_AL_.jpg" }));
  list_of_categories.push(new Category("TV_Shows_Switch", false, { "Friends": "", "Lost": "", "Desperate Housewives": "", "Haven": "", "House": "", "Doctor Who": "", "Californication": "", "Game of Thrones": "", "Merlin": "", "Big Bang Theory": "", "The Walking Dead": "", "Torchwood": "", "Under the Dome": "", "Breaking Bad": "", "How I Met Your Mother": "", "Sherlock": "", "Scandal": "", "The Following": "", "Buffy the Vampire Slayer": "", "Colombo": "", "Dallas": "", "Dawson's Creek": "", "Atlantis": "", "Twin Peaks (2016)": "", "House of Cards (US Version)": "", "Elementary": "", "Dexter": "", "True Detective": "", "Penny Dreadful": "", "American Horror Story": "", "Bates Motel": "", "Mistresses": "", "Orange Is the New Black": "", "Fear the Walking Dead": "", "Criminal Minds": "", "Extant": "", "Arrow": "", "Outlander": "", "Downton Abbey": "", "Vikings": "", "Parks and Recreation": "", "Defiance": "", "Black Sails": "", "Castle": "", "Two and a Half Men": "", "Suits": "", "Sons of Anarchy": "", "Prison Break": "", "Ripper Street": "", "Mad Men": "", "Heroes": "", "Nashville": "", "30 Rock": "", "The Killing": "", "The Tudors": "", "The Borgias": "", "Wentworth": "", "Chicago P.D": "", "Peaky Blinders": "", "Zoey101": "" }));
  list_of_categories.push(new Category("BTT_FFZ_Switch", false, { "PedoBear": "https://cdn.betterttv.net/emote/54fa928f01e468494b85b54f/3x", "RebeccaBlack": "https://cdn.betterttv.net/emote/54fa92ee01e468494b85b553/3x", "GabeN": "https://cdn.betterttv.net/emote/54fa90ba01e468494b85b543/3x", "AngelThump": "https://cdn.betterttv.net/emote/566ca1a365dbbdab32ec055b/3x", "D:": "https://cdn.betterttv.net/emote/55028cd2135896936880fdd7/3x", "FishMoley": "https://cdn.betterttv.net/emote/566ca00f65dbbdab32ec0544/3x", "KKona": "https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/3x", "haHAA": "https://cdn.betterttv.net/emote/555981336ba1901877765555/3x", "FeelsBirthdayMan": "https://cdn.betterttv.net/emote/55b6524154eefd53777b2580/3x", "FeelsBadMan": "https://cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/3x", "FeelsGoodMan": "https://cdn.betterttv.net/emote/566c9fde65dbbdab32ec053e/3x", "NaM": "https://cdn.betterttv.net/emote/566ca06065dbbdab32ec054e/3x", "SourPls": "https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/3x", "LuL": "https://cdn.betterttv.net/emote/567b00c61ddbe1786688a633/3x", "monkaS": "https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/3x", "FeelsAmazingMan": "https://cdn.betterttv.net/emote/5733ff12e72c3c0814233e20/3x", "DuckerZ": "https://cdn.betterttv.net/emote/573d38b50ffbf6cc5cc38dc9/3x", "Wowee": "https://cdn.betterttv.net/emote/58d2e73058d8950a875ad027/3x", "Clap": "https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x", "OMEGALUL": "https://cdn.betterttv.net/emote/583089f4737a8e61abb0186b/3x", "PepeHands": "https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x", "pepeJAM": "https://cdn.betterttv.net/emote/5b77ac3af7bddc567b1d5fb2/3x", "Pepega": "https://cdn.betterttv.net/emote/5aca62163e290877a25481ad/3x", "pepeD": "https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x", "EZ": "https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x", "POGGERS": "https://cdn.betterttv.net/emote/58ae8407ff7b7276f8e594f2/3x", "PepePls": "https://cdn.betterttv.net/emote/55898e122612142e6aaa935b/3x", "gachiBASS": "https://cdn.betterttv.net/emote/57719a9a6bdecd592c3ad59b/3x", "AYAYA": "https://cdn.betterttv.net/emote/58493695987aab42df852e0f/3x", "5Head": "https://cdn.betterttv.net/emote/5d6096974932b21d9c332904/3x", "gachiHYPER": "https://cdn.betterttv.net/emote/59143b496996b360ff9b807c/3x", "weirdChamp": "https://cdn.betterttv.net/emote/5d20a55de1cfde376e532972/3x", "ricardoFlick": "https://cdn.betterttv.net/emote/5bc2143ea5351f40921080ee/3x", "monkaW": "https://cdn.betterttv.net/emote/59ca6551b27c823d5b1fd872/3x", "PepeLaugh": "https://cdn.betterttv.net/emote/5c548025009a2e73916b3a37/3x", "blobDance": "https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/3x", "KEKW": "https://cdn.betterttv.net/emote/5e35dbb35e6f5751e76cc934/3x", "PepoDance": "https://cdn.betterttv.net/emote/5a6edb51f730010d194bdd46/3x", "TriDance": "https://cdn.betterttv.net/emote/5d1e70f498539c4801cc3811/3x", "HYPERS": "https://cdn.betterttv.net/emote/5980af4e3a1ac5330e89dc76/3x", "sumSmash": "https://cdn.betterttv.net/emote/5af84b9e766af63db43bf6b9/3x", "PepegaAim": "https://cdn.betterttv.net/emote/5d0d7140ca4f4b50240ff6b4/3x", "monkaHmm": "https://cdn.betterttv.net/emote/5aa16eb65d4a424654d7e3e5/3x", "peepoClap": "https://cdn.betterttv.net/emote/5d38aaa592fc550c2d5996b8/3x", "RainbowPls": "https://cdn.betterttv.net/emote/5b35cae2f3a33e2b6f0058ef/3x", "TriKool": "https://cdn.betterttv.net/emote/59a6d3dedccaf930aa8f3de1/3x", "pepeJAMJAM": "https://cdn.betterttv.net/emote/5c36fba2c6888455faa2e29f/3x", "peepoHappy": "https://cdn.betterttv.net/emote/5a16ee718c22a247ead62d4a/3x", "monkaTOS": "https://cdn.betterttv.net/emote/5a7fd054b694db72eac253f4/3x", "ppOverheat": "https://cdn.betterttv.net/emote/5b3e953a2c8a38720760c7f7/3x", "peepoLeave": "https://cdn.betterttv.net/emote/5d324913ff6ed36801311fd2/3x", "HYPERCLAP": "https://cdn.betterttv.net/emote/5b35ca08392c604c5fd81874/3x", "pepeDS": "https://cdn.betterttv.net/emote/5b444de56b9160327d12534a/3x", "peepoArrive": "https://cdn.betterttv.net/emote/5d922afbc0652668c9e52ead/3x", "gachiGASM": "https://cdn.betterttv.net/emote/55999813f0db38ef6c7c663e/3x", "monkaX": "https://cdn.betterttv.net/emote/58e5abdaf3ef4c75c9c6f0f9/3x", "weSmart": "https://cdn.betterttv.net/emote/589771dc10c0975495c578d1/3x", "PogU": "https://cdn.betterttv.net/emote/5cf6a8322316b42d72be7c36/3x", "peepoPooPoo": "https://cdn.betterttv.net/emote/5c3427a55752683d16e409d1/3x", "ppHop": "https://cdn.betterttv.net/emote/5a9578d6dcf3205f57ba294f/3x", "peepoRun": "https://cdn.betterttv.net/emote/5bc7ff14664a3b079648dd66/3x", "FeelsRainMan": "https://cdn.betterttv.net/emote/57850b9df1bf2c1003a88644/3x", "PepoCheer": "https://cdn.betterttv.net/emote/5abd36396723dc149c678e90/3x", "monkaSHAKE": "https://cdn.betterttv.net/emote/58d867c84c25f4458349ecc7/3x", "TeaTime": "https://cdn.betterttv.net/emote/56f6eb647ee3e8fc6e4fe48e/3x", "LULW": "https://cdn.betterttv.net/emote/587d26d976a3c4756d667153/3x", "COGGERS": "https://cdn.betterttv.net/emote/5ab6f0ece1d6391b63498774/3x", "KKool": "https://cdn.betterttv.net/emote/56c2cff2d9ec6bf744247bf1/3x", "nymnCorn": "https://cdn.betterttv.net/emote/56cb56f5500cb4cf51e25b90/3x", "POGSLIDE": "https://cdn.betterttv.net/emote/5aea37908f767c42ce1e0293/3x", "bongoTap": "https://cdn.betterttv.net/emote/5ba6d5ba6ee0c23989d52b10/3x", "pepeMeltdown": "https://cdn.betterttv.net/emote/5ba84271c9f0f66a9efc1c86/3x", "ddHuh": "https://cdn.betterttv.net/emote/58b20d74d07b273e0dcfd57c/3x", "WaitWhat": "https://cdn.betterttv.net/emote/55cbeb8f8b9c49ef325bf738/3x", "ppJedi": "https://cdn.betterttv.net/emote/5b52e96eb4276d0be256f809/3x", "peepoSad": "https://cdn.betterttv.net/emote/5a16ddca8c22a247ead62ceb/3x", "HACKERMANS": "https://cdn.betterttv.net/emote/5b490e73cf46791f8491f6f4/3x", "RareParrot": "https://cdn.betterttv.net/emote/55a24e1294dd94001ee86b39/3x", "WAYTOODANK": "https://cdn.betterttv.net/emote/5ad22a7096065b6c6bddf7f3/3x", "pressF": "https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/3x", "WeirdChamp": "https://cdn.betterttv.net/emote/5d9198fbd2458468c1f4adb7/3x", "monkaGun": "https://cdn.betterttv.net/emote/58f6e05e58f5dd226a16166e/3x", "peepoSmash": "https://cdn.betterttv.net/emote/5c72084d41600b0832ab0931/3x", "PeepoClap": "https://cdn.betterttv.net/emote/5de48e64515a2a77bc9e7339/3x", "pikaOMG": "https://cdn.betterttv.net/emote/5bec16e1c3cac7088d09bdd7/3x", "HAhaa": "https://cdn.betterttv.net/emote/55f47f507f08be9f0a63ce37/3x", "PepegaPls": "https://cdn.betterttv.net/emote/5c04b07db4297124fa9d165e/3x", "MYAAA": "https://cdn.betterttv.net/emote/5de20a2c2dea2902de074598/3x", "peepoHey": "https://cdn.betterttv.net/emote/5c0e1a3c6c146e7be4ff5c0c/3x", "AlienPls": "https://cdn.betterttv.net/emote/5805580c3d506fea7ee357d6/3x", "forsenPls": "https://cdn.betterttv.net/emote/55e2096ea6fa8b261f81b12a/3x", "peepoArrive": "https://cdn.betterttv.net/emote/5e1c16778af14b5f1b43a246/3x", "Thonk": "https://cdn.betterttv.net/emote/585231dd58af204561cd6036/3x", "pepeJAMMER": "https://cdn.betterttv.net/emote/5baa5b59f17b9f6ab0f3e84f/3x", "pepeSmoke": "https://cdn.betterttv.net/emote/5b15162147c7bf3bfc0b9c76/3x", "CrabPls": "https://cdn.betterttv.net/emote/5c2a4ddda402f16774559abe/3x", "SALAMI": "https://cdn.betterttv.net/emote/5de45e0d515a2a77bc9e723d/3x", "headBang": "https://cdn.betterttv.net/emote/57320689d69badf9131b82c4/3x", "peepoLove": "https://cdn.betterttv.net/emote/5a5e0e8d80f53146a54a516b/3x", "TriFi": "https://cdn.betterttv.net/emote/5df0742ee7df1277b6070125/3x", "widepeepoHappy": "https://cdn.betterttv.net/emote/5e1a76dd8af14b5f1b438c04/3x", "forsenCD": "https://cdn.betterttv.net/emote/5d3e250a6d68672adc3fbff7/3x", "PauseChamp": "https://cdn.betterttv.net/emote/5cd6b08cf1dac14a18c4b61f/3x", "KKomrade": "https://cdn.betterttv.net/emote/56be9fd6d9ec6bf74424760d/3x", "PepeS": "https://cdn.betterttv.net/emote/59420c88023a013b50774872/3x", "billyReady": "https://cdn.betterttv.net/emote/58763fcecb2b7248f8b9b0cf/3x", "GachiPls": "https://cdn.betterttv.net/emote/58868aa5afc2ff756c3f495e/3x", "AAUGH": "https://cdn.betterttv.net/emote/5ddb7c12e579cd5efad78b28/3x" }));
  list_of_categories.push(new Category("Live_Streamers_Switch", false, { "Summit": "https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2018/12/26150907/summit1g.png", "Tyler1": "https://pbs.twimg.com/media/CvS_r8KWEAEYSzo.jpg", "xQc": "https://i.redd.it/gblcuyoe2co21.png", "sodapoppin": "https://i.ytimg.com/vi/rBg_1G0Uvu8/maxresdefault.jpg", "Gaules": "https://www.esportspedia.com/streamers/thumb.php?f=Gaules.jpg&width=300", "LIRIK": "https://www.esportspedia.com/streamers/thumb.php?f=Lirik.jpg&width=300", "auronplay": "https://www.famousbirthdays.com/faces/auronplay-image.jpg", "Tfue": "https://pmcvariety.files.wordpress.com/2019/05/tfue.jpg?w=1000&h=563&crop=1", "DrLupo": "https://image.cnbcfm.com/api/v1/image/106091661-1566476702259drlupo-rogue-2.jpg?v=1566476731&w=678&h=381", "Gorgc": "https://liquipedia.net/commons/images/thumb/0/0f/Gorgc_WESG_2016.jpg/600px-Gorgc_WESG_2016.jpg", "NICKMERCS": "https://www.esportspedia.com/streamers/images/d/d4/Nickmercs.png", "Nightblue": "https://wpq0221c4a-flywheel.netdna-ssl.com/wp-content/uploads/2018/10/Nightblue3_2-300x300.png", "MOONMOON": "https://www.esportspedia.com/streamers/thumb.php?f=MOONMOON_OW.png&width=300", "CohhCarnage": "https://pbs.twimg.com/profile_images/1184107992268136449/ggHYKTbY_400x400.jpg", "TheRealKnossi": "https://static-cdn.jtvnw.net/jtv_user_pictures/631714f9-ff41-4643-99af-b4e00303fefb-profile_image-300x300.png", "forsen": "https://i.kym-cdn.com/entries/icons/mobile/000/025/133/Screen_Shot_2018-01-09_at_2.37.34_PM.jpg", "DrDisrespect": "https://www.ccn.com/wp-content/uploads/2019/12/Dr-Disrespect-768x383.jpg", "TFBlade": "https://gamepedia.cursecdn.com/lolesports_gamepedia_en/thumb/0/0e/MLGB_Blade_2017.png/220px-MLGB_Blade_2017.png?version=8bb874aea7b79570114196b7ed785bc4", "TimTheTatman": "https://pbs.twimg.com/media/D84b5M8UYAAuog3.jpg", "Trainwrecks": "https://i.redd.it/cxm6gnbqu3z11.png", "AdmiralBahroo": "https://pbs.twimg.com/profile_images/1212347044733558784/b6ES0EeL_400x400.png", "Woops": "https://pbs.twimg.com/media/DaCzERyU0AEl3IG.jpg", "AdmiralBulldog": "https://upload.wikimedia.org/wikipedia/commons/9/91/Henrik_Ahnberg.jpg", "Greekgodx": "https://pbs.twimg.com/media/EOZuxKCWsAINEwP.jpg", "Quin": "https://toptwitchstreamers.com/wp-content/uploads/2018/11/Quin69.png", "Myth": "https://img.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcL3RodW1ibmFpbHNcXFwvX3RodW1ibmFpbExhcmdlXFxcL3RzbS1teXRocy1jaGF0LXB1bGxzLXBlcmZlY3QtcHJhbmsuanBnXCIsXCJ3aWR0aFwiOjYyMCxcImhlaWdodFwiOjM0NyxcImRlZmF1bHRcIjpcImh0dHBzOlxcXC9cXFwvczMtZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cXFwvcHBsdXMuaW1hZ2VzLmRleGVydG8uY29tXFxcL3VwbG9hZHNcXFwvMjAxOVxcXC8xMVxcXC8xMTIxNDk0M1xcXC9wbGFjZWhvbGRlci5qcGdcIn0iLCJoYXNoIjoiMzY3ODMxZDNjNjZlOWFkN2I5ZDA5NmRlOWRhZjlkN2Q1NzhhYjgzNiJ9/tsm-myth-baited-into-classic-prank-by-twitch-chat.jpg", "Hasan": "https://pbs.twimg.com/media/DiBlUlYV4AA6aNf.jpg", "Destiny": "https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/05/12133058/destiny.png", "Elraenn": "https://static-cdn.jtvnw.net/jtv_user_pictures/3b0005424a7244e6-profile_image-300x300.jpeg", "icebergdoto": "https://static-cdn.jtvnw.net/jtv_user_pictures/ea30c00f-3247-4045-bcc7-c941a7ea1ac7-profile_image-300x300.jpg", "Yassuo": "https://gamepedia.cursecdn.com/lolesports_gamepedia_en/thumb/d/d9/Moe.jpeg/220px-Moe.jpeg?version=097ae2a46fa00619c395f2c511e3f5c8", "Kitboga": "https://pbs.twimg.com/profile_images/1031787904283156480/WTCcqpiD_400x400.jpg", "Jukes": "https://static-cdn.jtvnw.net/jtv_user_pictures/044e146b-09ff-449d-b2a1-95a2358ac3a8-profile_image-300x300.png", "Sypher": "https://vignette.wikia.nocookie.net/youtube/images/0/05/SypherPK.png/revision/latest?cb=20190916015039", "Zizaran": "https://toptwitchstreamers.com/wp-content/uploads/2019/01/Zizaran-compressor.png", "pokimane": "https://yt3.ggpht.com/a/AGF-l79JA0Qj2u2TTEHz3xjCtCMVAmcVeMt_Gfuc7A=s900-c-k-c0xffffffff-no-rj-mo", "Emongg": "https://toptwitchstreamers.com/wp-content/uploads/2019/02/emongg-compressor.jpg", "Moxy": "https://static-cdn.jtvnw.net/jtv_user_pictures/c901b680-9876-4e67-826a-e141381628e5-profile_image-300x300.jpg", "Scarra": "https://www.esportspedia.com/streamers/images/6/6f/ScarraNew.png", "imls": "https://toptwitchstreamers.com/wp-content/uploads/2019/07/imls-compressor.jpg", "RajjPatel": "https://i.kinja-img.com/gawker-media/image/upload/s--KThCMDNX--/c_scale,f_auto,fl_progressive,q_80,w_800/xecgglpmenet4pczbftt.png", "NickEh": "https://cust-images.grenadine.co/grenadine/image/upload/c_fill,f_jpg,g_face,h_600,w_600/v1/VidCon/3Xwr_9985.png", "Amouranth": "https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/09/10125931/amouranth.png", "Mizkif": "https://pbs.twimg.com/media/Djd1B6mXcAMLaG1.jpg", "UberHaxorNova": "https://naibuzz.com/wp-content/uploads/2017/02/Uber.jpg", "ZanoXVII": "https://i0.wp.com/www.webboh.it/wp-content/uploads/2019/12/ZanoXVII.jpg?fit=758%2C537&ssl=1", "BarbarousKing": "https://pbs.twimg.com/profile_images/1197676925629673472/9JAevA4Z_400x400.jpg", "Pokelawls": "https://external-preview.redd.it/0bZOIXTO-gdPkWbP9ptZgJwtqTu0ogvLjPX-PWRBBRQ.jpg?auto=webp&s=86c300a7c0dcf821af0194223067006bd8c7bbbe", "LilyPichu": "https://www.esportspedia.com/streamers/images/5/54/Lilypichu.jpg", "DansGaming": "https://img.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL3MzLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXFxcL3BwbHVzLmltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcL2FydGljbGVzXFxcL0RhbnNHYW1pbmctSU5zdGFncmFtLXBob3RvLkpQR1wiLFwid2lkdGhcIjpcIlwiLFwiaGVpZ2h0XCI6XCJcIixcImRlZmF1bHRcIjpcImh0dHBzOlxcXC9cXFwvczMtZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cXFwvcHBsdXMuaW1hZ2VzLmRleGVydG8uY29tXFxcL3VwbG9hZHNcXFwvMjAxOVxcXC8xMVxcXC8xMTIxNDk0M1xcXC9wbGFjZWhvbGRlci5qcGdcIn0iLCJoYXNoIjoiNDIxNzQzODRkYmU1MTU3OTg0ZGRjYzg2Y2Q4MjdlZmYzNmMxZjU2ZSJ9/dansgaming-instagram-photo.JPG", "Esfand": "https://toptwitchstreamers.com/wp-content/uploads/2019/05/esfand-compressor.jpg", "Nmp": "https://toptwitchstreamers.com/wp-content/uploads/2019/02/Nmplol-compressor.jpg", "Ninja": "https://api.time.com/wp-content/uploads/2019/04/tyler-blevins-ninja-time-100-2019-002-1.jpg?quality=85&zoom=2", "Asmongold": "https://static-cdn.jtvnw.net/jtv_user_pictures/asmongold-profile_image-f7ddcbd0332f5d28-300x300.png", "Shroud": "https://cdn.vox-cdn.com/thumbor/2aBBUfl11j5KGBw_Ke6Ubip_HlA=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19316022/1054359868.jpg.jpg", "Mayahiga": "https://pbs.twimg.com/profile_images/1100829912573763584/8U_lkUMC.jpg", "Swifte": "https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2018/08/11233137/5f1b5126-388f-4e4e-9936-27efa191a1b9.jpg", "Nymn": "https://pbs.twimg.com/profile_images/1152626151505977344/UJDj5jI2_400x400.jpg", "Fed": "https://vignette.wikia.nocookie.net/offlinetvandfriends/images/8/82/FEDD.jpg/revision/latest?cb=20190829114236", "Vansama": "https://pbs.twimg.com/profile_images/1225856942792376323/GLM6RPRy_400x400.jpg", "IWillDominate": "https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/02/08121626/iwilldominate.png", "Minx": "https://pbs.twimg.com/media/EDn5jQ_WwAApznY.jpg", "HAchubby": "https://img.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcL3RodW1ibmFpbHNcXFwvX3RodW1ibmFpbExhcmdlXFxcL1N0cmVhbWVyLUhhQ2h1YmJ5LWhvcnJpZmllcy1Ud2l0Y2gtYnktc2hvd2luZy1oZXItZml2ZS1zdGFyLWhvdGVsLmpwZ1wiLFwid2lkdGhcIjo2MjAsXCJoZWlnaHRcIjozNDcsXCJkZWZhdWx0XCI6XCJodHRwczpcXFwvXFxcL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tXFxcL3BwbHVzLmltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMTlcXFwvMTFcXFwvMTEyMTQ5NDNcXFwvcGxhY2Vob2xkZXIuanBnXCJ9IiwiaGFzaCI6ImEwNTk4YWQ1ZjIwOWMyNmIzMjI3YmYwMzVkNzFmODUwYTY3ZjgzM2UifQ==/streamer-hachubby-horrifies-twitch-by-showing-her-five-star-hotel.jpg", "Mendo": "https://www.apexskins.net/wp-content/uploads/2019/02/5bd4ecd54fb09.jpg", "Dyrus": "https://res.cloudinary.com/lmn/image/upload/c_limit,h_360,w_640/e_sharpen:100/f_auto,fl_lossy,q_auto/v1/gameskinny/abea7d5a7a053d8ec9a7e09062fbed5f.jpg", "Jakenbake": "https://www.famousbirthdays.com/faces/jakenbakelive-image.jpg", "Sips": "https://toptwitchstreamers.com/wp-content/uploads/2019/02/Sips_-compressor.jpg", "Strippin": "https://pbs.twimg.com/media/C7Ets8AU0AA01bq.jpg", "Octopimp": "https://vignette.wikia.nocookie.net/sao-abridged/images/9/94/Octopimp.jpg/revision/latest?cb=20190818164246", "AndyMilonakis": "https://img.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMjBcXFwvMDFcXFwvMDMyMjQ0NTdcXFwvYW5keS1taWxvbmthaXMtY2FsbHMtb3V0LXBhdGhldGljLXR3aXRjaC1mb3Itbm90LXBhcnRuZXJpbmctc2xpa2VyLWxvZ28ucG5nXCIsXCJ3aWR0aFwiOlwiXCIsXCJoZWlnaHRcIjpcIlwiLFwiZGVmYXVsdFwiOlwiaHR0cHM6XFxcL1xcXC9zMy1ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVxcXC9wcGx1cy5pbWFnZXMuZGV4ZXJ0by5jb21cXFwvdXBsb2Fkc1xcXC8yMDE5XFxcLzExXFxcLzExMjE0OTQzXFxcL3BsYWNlaG9sZGVyLmpwZ1wifSIsImhhc2giOiI0MTM2ZmNhZDAxYmYzYzhmNWUzMmExMTA3MTlhZTcwZjM5MjkyMzQ4In0=/andy-milonkais-calls-out-pathetic-twitch-for-not-partnering-sliker-logo.png", "JesseCox": "https://vignette.wikia.nocookie.net/polarisnetwork/images/2/22/JesseCox.jpg/revision/latest?cb=20150404121849", "Adept": "https://www.esportspedia.com/streamers/thumb.php?f=Adeptthebest.png&width=300", "Jerma": "https://vignette.wikia.nocookie.net/youtube/images/6/64/Jerma2nd.png/revision/latest?cb=20191214230545", "Dodger": "https://clips-media-assets2.twitch.tv/187649885-preview-480x272.jpg", "Erobb": "https://i.redd.it/c92d4ve1g5wz.jpg", "Ster": "", "Vigors": "", "Daph": "https://www.famousbirthdays.com/faces/39daph-image.jpg", "Mitch": "https://img.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL3MzLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXFxcL3BwbHVzLmltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcL2FydGljbGVzXFxcL01pdGNoLUpvbmVzLVR3aXR0ZXItSW1hZ2UuanBnXCIsXCJ3aWR0aFwiOlwiXCIsXCJoZWlnaHRcIjpcIlwiLFwiZGVmYXVsdFwiOlwiaHR0cHM6XFxcL1xcXC9zMy1ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVxcXC9wcGx1cy5pbWFnZXMuZGV4ZXJ0by5jb21cXFwvdXBsb2Fkc1xcXC8yMDE5XFxcLzExXFxcLzExMjE0OTQzXFxcL3BsYWNlaG9sZGVyLmpwZ1wifSIsImhhc2giOiIzOTZjMjRkMTQzYzljZmJhZjE4NGFjYzg1MjVlYzk3Yzc4NjRhZDQ5In0=/mitch-jones-twitter-image.jpg", "TriHex": "https://upload.wikimedia.org/wikipedia/commons/6/64/Trihex_2018_%28cropped%29.png", "Hyphonix": "https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/03/12111116/Djp2O78VAAAf2iM.jpg", "DisguisedToast": "https://www.esportspedia.com/tft/images/f/fe/Disguised_toast.png", "imaqtpie": "https://wpq0221c4a-flywheel.netdna-ssl.com/wp-content/uploads/2018/10/Imaqtpie-300x300.png", "Reynad": "https://gamepedia.cursecdn.com/twitch_gamepedia/thumb/a/a4/Reynad27.jpg/290px-Reynad27.jpg?version=6c71b8e3fd0720251d106ea6e7867e7b", "Knut": "https://i.ytimg.com/vi/fSYngYQe5Vg/maxresdefault.jpg", "Giantwaffle": "https://gamepedia.cursecdn.com/twitch_gamepedia/e/e6/Wafulru.png", "Boneclinks": "https://i.redd.it/mnufv4daufvz.jpg", "Lacari": "https://toptwitchstreamers.com/wp-content/uploads/2019/05/Lacari-compressor.jpg", "dafran": "https://prosettings.net/wp-content/uploads/2019/01/dafran-profile-picture.jpg", "Lyndon": "https://vignette.wikia.nocookie.net/youtube/images/3/3e/LyndonFPS.png/revision/latest?cb=20180920085223", "Criken": "https://vignette.wikia.nocookie.net/roosterteeth/images/b/b3/Criken.png/revision/latest?cb=20171221124924", "Calvin": "https://bestplayersettings.com/wp-content/uploads/sites/3/2018/11/AimbotCalvin-300x300.jpg", "Roflgator": "https://clips-media-assets2.twitch.tv/30700377184-offset-11836-preview-480x272.jpg", "Seagull": "https://toptwitchstreamers.com/wp-content/uploads/2018/12/a_seagull2-compressor.jpg", "kaceytron": "https://pbs.twimg.com/profile_images/1085964463872696320/rjsWjsqs_400x400.jpg", "Kandyland": "https://pbs.twimg.com/profile_images/1198281595024789505/2xR9819F_400x400.jpg", "Boogie": "https://d.newsweek.com/en/full/1562651/boogie2988-reddit-twitter-youtube-controversy.png?w=1600&h=1600&q=88&f=9206193d407e7aa234a15a13a427728a", "Sweet_Anita": "https://pbs.twimg.com/media/Dt6DucYWsAAkZjw.jpg", "Alinity": "https://pbs.twimg.com/media/EL3ynlMUYAA65Fd.jpg", "TotalBiscuit": "https://vignette.wikia.nocookie.net/nlss/images/f/fe/Tb.jpg/revision/latest?cb=20180301153813" }));

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
              document.getElementById("wb_output").innerHTML = ("<strong style=\"color:" + message.tags["color"] + "; \">" + message.username + "</strong>: " + message.message);
              var regex_f_p = document.getElementById("first_word_detect_box").checked ? "^" : "";
              if (message.message.toLowerCase().search("\\b" + regex_f_p + chosenWord + "\\b") != -1) {
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
  var word_list;
  var cat_list = [];
  for (var key in list_of_categories) {
    if (list_of_categories[key].state == true) {
      cat_list = cat_list.concat(list_of_categories[key]);
    }
  }
  var chosen_cat = cat_list[Math.floor(Math.random() * cat_list.length)];
  var word_keys = Object.keys(chosen_cat.words);
  pickedAWord = false;
  while (!pickedAWord) {
    chosenWord = word_keys[Math.floor(Math.random() * word_keys.length)]
    image_ChosenWord = chosen_cat.words[chosenWord];
    pickedAWord = WordListRepeatHolder.add(chosenWord);
  }

  document.getElementById("theWord").innerHTML = "???";
  display_ChosenWord = chosenWord;
  updatePopoutWord();
  chosenWord = chosenWord.toLowerCase();
}

// //DEBUG Function
// //
// var index = 0;
// var cat_index = 0;

// function PickWord() {
//   wordFound = false;
//   var word_list;
//   var cat_list = [];
//   for (var key in list_of_categories) {
//     if (list_of_categories[key].state == true) {
//       cat_list = cat_list.concat(list_of_categories[key]);
//     }
//   }
//   var chosen_cat = cat_list[cat_index % cat_list.length];
//   cat_index++;
//   var word_keys = Object.keys(chosen_cat.words);
//   pickedAWord = false;
//   while (!pickedAWord) {
//     chosenWord = word_keys[index % word_keys.length]
//     image_ChosenWord = chosen_cat.words[chosenWord];
//     pickedAWord = WordListRepeatHolder.add(chosenWord);
//   }
//   index++

//   document.getElementById("theWord").innerHTML = "???";
//   display_ChosenWord = chosenWord;
//   updatePopoutWord();
//   chosenWord = chosenWord.toLowerCase();
// }


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
    document.getElementById(this.id).checked = true;
  } else {
    list_of_categories[this_Category_Key].state = !list_of_categories[this_Category_Key].state;
    document.getElementById(this.id).checked = list_of_categories[this_Category_Key].state;
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

}