const MAX_REPEAT_OF_WORDS = 10;

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
  list_of_categories.push(new Category("Twitch_Emotes_Switch", false, { "4Head": "https://static-cdn.jtvnw.net/emoticons/v1/354/3.0", "ANELE": "https://static-cdn.jtvnw.net/emoticons/v1/3792/3.0", "BabyRage": "https://static-cdn.jtvnw.net/emoticons/v1/22639/3.0", "BibleThump": "https://static-cdn.jtvnw.net/emoticons/v1/86/3.0", "BlessRNG": "https://static-cdn.jtvnw.net/emoticons/v1/153556/3.0", "BloodTrail": "https://static-cdn.jtvnw.net/emoticons/v1/69/3.0", "BOP": "https://static-cdn.jtvnw.net/emoticons/v1/301428702/3.0", "BrokeBack": "https://static-cdn.jtvnw.net/emoticons/v1/4057/3.0", "cmonBruh": "https://static-cdn.jtvnw.net/emoticons/v1/84608/3.0", "CoolCat": "https://static-cdn.jtvnw.net/emoticons/v1/58127/3.0", "CoolStoryBob": "https://static-cdn.jtvnw.net/emoticons/v1/123171/3.0", "CurseLit": "https://static-cdn.jtvnw.net/emoticons/v1/116625/3.0", "DansGame": "https://static-cdn.jtvnw.net/emoticons/v1/33/3.0", "DarkMode": "https://static-cdn.jtvnw.net/emoticons/v1/461298/3.0", "DatSheffy": "https://static-cdn.jtvnw.net/emoticons/v1/111700/3.0", "DoritosChip": "https://static-cdn.jtvnw.net/emoticons/v1/102242/3.0", "duDudu": "https://static-cdn.jtvnw.net/emoticons/v1/62834/3.0", "EleGiggle": "https://static-cdn.jtvnw.net/emoticons/v1/4339/3.0", "FailFish": "https://static-cdn.jtvnw.net/emoticons/v1/360/3.0", "FBCatch": "https://static-cdn.jtvnw.net/emoticons/v1/1441281/3.0", "FBPass": "https://static-cdn.jtvnw.net/emoticons/v1/1441271/3.0", "FBRun": "https://static-cdn.jtvnw.net/emoticons/v1/1441261/3.0", "FBSpiral": "https://static-cdn.jtvnw.net/emoticons/v1/1441273/3.0", "FBtouchdown": "https://static-cdn.jtvnw.net/emoticons/v1/626795/3.0", "FrankerZ": "https://static-cdn.jtvnw.net/emoticons/v1/65/3.0", "FutureMan": "https://www.twitchmetrics.net/e/98562-FutureMan", "GivePLZ": "https://static-cdn.jtvnw.net/emoticons/v1/112291/3.0", "GunRun": "https://static-cdn.jtvnw.net/emoticons/v1/1584743/3.0", "HeyGuys": "https://static-cdn.jtvnw.net/emoticons/v1/30259/3.0", "HolidaySanta": "https://static-cdn.jtvnw.net/emoticons/v1/1713822/3.0", "HolidayTree": "https://static-cdn.jtvnw.net/emoticons/v1/1713825/3.0", "HotPokket": "https://static-cdn.jtvnw.net/emoticons/v1/357/3.0", "imGlitch": "https://static-cdn.jtvnw.net/emoticons/v1/112290/3.0", "ItsBoshyTime": "https://static-cdn.jtvnw.net/emoticons/v1/133468/3.0", "Jebaited": "https://static-cdn.jtvnw.net/emoticons/v1/114836/3.0", "KAPOW": "https://static-cdn.jtvnw.net/emoticons/v1/133537/3.0", "Kappa": "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0", "KappaClaus": "https://static-cdn.jtvnw.net/emoticons/v1/74510/3.0", "KappaPride": "https://static-cdn.jtvnw.net/emoticons/v1/55338/3.0", "KappaRoss": "https://static-cdn.jtvnw.net/emoticons/v1/70433/3.0", "KappaWealth": "https://static-cdn.jtvnw.net/emoticons/v1/81997/3.0", "Kappu": "https://static-cdn.jtvnw.net/emoticons/v1/160397/3.0", "Keepo": "https://static-cdn.jtvnw.net/emoticons/v1/1902/3.0", "KonCha": "https://static-cdn.jtvnw.net/emoticons/v1/160400/3.0", "Kreygasm": "https://static-cdn.jtvnw.net/emoticons/v1/41/3.0", "LUL": "https://static-cdn.jtvnw.net/emoticons/v1/425618/3.0", "Mau5": "https://static-cdn.jtvnw.net/emoticons/v1/30134/3.0", "mcaT": "https://static-cdn.jtvnw.net/emoticons/v1/35063/3.0", "MercyWing1": "https://static-cdn.jtvnw.net/emoticons/v1/1003187/3.0", "MercyWing2": "https://static-cdn.jtvnw.net/emoticons/v1/1003189/3.0", "MingLee": "https://static-cdn.jtvnw.net/emoticons/v1/68856/3.0", "MorphinTime": "https://static-cdn.jtvnw.net/emoticons/v1/156787/3.0", "MrDestructoid": "https://static-cdn.jtvnw.net/emoticons/v1/28/3.0", "NinjaGrumpy": "https://static-cdn.jtvnw.net/emoticons/v1/138325/3.0", "NotLikeThis": "https://static-cdn.jtvnw.net/emoticons/v1/58765/3.0", "OpieOP": "https://www.twitchmetrics.net/e/100590-OpieOP", "PartyHat": " https://static-cdn.jtvnw.net/emoticons/v1/965738/3.0", "PartyTime": "https://static-cdn.jtvnw.net/emoticons/v1/135393/3.0", "PinkMercy": "https://static-cdn.jtvnw.net/emoticons/v1/1003190/3.0", "PipeHype": "https://static-cdn.jtvnw.net/emoticons/v1/4240/3.0", "PixelBob": "https://static-cdn.jtvnw.net/emoticons/v1/1547903/3.0", "PJSalt": "https://static-cdn.jtvnw.net/emoticons/v1/36/3.0", "PJSugar": "https://static-cdn.jtvnw.net/emoticons/v1/102556/3.0", "PogChamp": "https://static-cdn.jtvnw.net/emoticons/v1/88/3.0", "PopCorn": "https://static-cdn.jtvnw.net/emoticons/v1/724216/3.0", "PowerUpL": "https://static-cdn.jtvnw.net/emoticons/v1/425688/3.0", "PrimeMe": "https://static-cdn.jtvnw.net/emoticons/v1/115075/3.0", "PunchTrees": "https://static-cdn.jtvnw.net/emoticons/v1/47/3.0", "PunOko": "https://static-cdn.jtvnw.net/emoticons/v1/160401/3.0", "ResidentSleeper": "https://static-cdn.jtvnw.net/emoticons/v1/245/3.0", "riPepperonis": "https://static-cdn.jtvnw.net/emoticons/v1/62833/3.0", "SeemsGood": "https://static-cdn.jtvnw.net/emoticons/v1/64138/3.0", "SingsMic": "https://static-cdn.jtvnw.net/emoticons/v1/300116349/3.0", "SingsNote": "https://static-cdn.jtvnw.net/emoticons/v1/300116350/3.0", "SMOrc": "https://static-cdn.jtvnw.net/emoticons/v1/52/3.0", "Squid2": "https://static-cdn.jtvnw.net/emoticons/v1/191763/3.0", "Squid3": "https://static-cdn.jtvnw.net/emoticons/v1/191764/3.0", "Squid4": "https://static-cdn.jtvnw.net/emoticons/v1/191767/3.0", "SSSsss": "https://static-cdn.jtvnw.net/emoticons/v1/46/3.0", "StinkyCheese": "https://static-cdn.jtvnw.net/emoticons/v1/90076/3.0", "SwiftRage": "https://static-cdn.jtvnw.net/emoticons/v1/34/3.0", "TakeNRG": "https://static-cdn.jtvnw.net/emoticons/v1/112292/3.0", "TearGlove": "https://static-cdn.jtvnw.net/emoticons/v1/160403/3.0", "TheIlluminati": "https://static-cdn.jtvnw.net/emoticons/v1/145315/3.0", "TombRaid": "https://static-cdn.jtvnw.net/emoticons/v1/864205/3.0", "TriHard": "https://static-cdn.jtvnw.net/emoticons/v1/120232/3.0", "TwitchLit": "https://static-cdn.jtvnw.net/emoticons/v1/166263/3.0", "twitchRaid": "https://static-cdn.jtvnw.net/emoticons/v1/62836/3.0", "TwitchRPG": "https://static-cdn.jtvnw.net/emoticons/v1/1220086/3.0", "TwitchSings": "https://static-cdn.jtvnw.net/emoticons/v1/300116344/3.0", "TwitchVotes": "https://static-cdn.jtvnw.net/emoticons/v1/479745/3.0", "VoHiYo": "https://static-cdn.jtvnw.net/emoticons/v1/81274/3.0", "VoteNay": "https://static-cdn.jtvnw.net/emoticons/v1/106294/3.0", "VoteYea": "https://static-cdn.jtvnw.net/emoticons/v1/106293/3.0", "WutFace": "https://static-cdn.jtvnw.net/emoticons/v1/28087/3.0" }));
  list_of_categories.push(new Category("Movies_Switch", true, { "Parasite": "", "The Godfather": "", "The Dark Knight": "", "12 Angry Men": "", "Schindler's List": "", "The Lord of the Rings": "", "Fight Club": "", "Forrest Gump": "", "Inception": "", "The Matrix": "", "Goodfellas": "", "Seven Samurai": "", "City of God": "", "The Silence of the Lambs": "", "The Usual Suspects": "", "It's a Wonderful Life": "", "Life Is Beautiful": "", "The Professional": "", "Once Upon a Time in the West": "", "Interstellar": "", "Saving Private Ryan": "", "Spirited Away": "", "American History X": "", "Casablanca": "", "City Lights": "", "Psycho": "", "Raiders of the Lost Ark": "", "Rear Window": "", "The Intouchables": "", "Modern Times": "", "The Green Mile": "", "Terminator": "", "The Pianist": "", "Whiplash": "", "The Departed": "", "Back to the Future": "", "Memento": "", "Gladiator": "", "Apocalypse Now": "", "Sunset Blvd": "", "The Prestige": "", "Alien": "", "Star Wars": "", "The Lion King": "", "The Great Dictator": "", "The Lives of Others": "", "Cinema Paradiso": "", "Paths of Glory": "", "The Shining": "", "Django Unchained": "", "The Dark Knight Rises": "", "WALL": "", "American Beauty": "", "Grave of the Fireflies": "", "Aliens": "", "Citizen Kane": "", "Princess Mononoke": "", "Oldboy": "", "Vertigo": "", "Das Boot": "", "Once Upon a Time in America": "", "Witness for the Prosecution": "", "Reservoir Dogs": "", "Braveheart": "", "A Clockwork Orange": "", "Toy Story": "", "Requiem for a Dream": "", "Taxi Driver": "", "Double Indemnity": "", "To Kill a Mockingbird": "", "Lawrence of Arabia": "", "Eternal Sunshine of the Spotless Mind": "", "Full Metal Jacket": "", "Snatch": "", "Monty Python and the Holy Grail": "", "Inside Out": "", "The Kid": "", "For a Few Dollars More": "", "Inglourious Basterds": "", "Rashomon": "", "The Apartment": "", "All About Eve": "", "Indiana Jones": "", "Metropolis": "", "Scarface": "", "Batman Begins": "", "Some Like It Hot": "", "The Third Man": "", "Unforgiven": "", "3 Idiots": "", "Up": "", "The Hunt": "", "Raging Bull": "", "Downfall": "", "Good Will Hunting": "", "Die Hard": "", "The Great Escape": "", "Chinatown": "", "Heat": "", "Sunrise": "", "My Neighbor Totoro": "", "The Bridge on the River Kwai": "", "The Gold Rush": "", "Ikiru": "", "Ran": "", "The Seventh Seal": "", "Blade Runner": "", "The Secret in Their Eyes": "", "Sholay": "", "Wild Strawberries": "", "The General": "", "The Elephant Man": "", "Casino": "", "Howl's Moving Castle": "", "Warrior": "", "The Wolf of Wall Street": "", "Gran Torino": "", "Judgment at Nuremberg": "", "The Big Lebowski": "", "A Beautiful Mind": "", "Rebecca": "", "The Deer Hunter": "", "How to Train Your Dragon": "", "Cool Hand Luke": "", "Gone with the Wind": "", "Fargo": "", "Trainspotting": "", "Incendies": "", "The Sixth Sense": "", "Into the Wild": "", "It Happened One Night": "", "Finding Nemo": "", "Gone Girl": "", "No Country for Old Men": "", "The Thing": "", "Mary and Max": "", "Rush": "", "The Maltese Falcon": "", "Kill Bill": "", "Life of Brian": "", "Hotel Rwanda": "", "The Wages of Fear": "", "Platoon": "", "There Will Be Blood": "", "Butch Cassidy and the Sundance Kid": "", "Network": "", "The Martian": "", "The 400 Blows": "", "Stand by Me": "", "Persona": "", "Touch of Evil": "", "The Revenant": "", "12 Years a Slave": "", "The Princess Bride": "", "The Grand Budapest Hotel": "", "In the Name of the Father": "", "Amores Perros": "", "Million Dollar Baby": "", "Annie Hall": "", "Shutter Island": "", "The Grapes of Wrath": "", "Wild Tales": "", "Diabolique": "", "Stalker": "", "Jurassic Park": "", "Gandhi": "", "The Wizard of Oz": "", "The Bourne Ultimatum": "", "The Best Years of Our Lives": "", "Sin City": "", "Donnie Darko": "", "Before Sunrise": "", "Strangers on a Train": "", "Twelve Monkeys": "", "The Truman Show": "", "Groundhog Day": "", "Monsters Inc": "", "Jaws": "", "Memories of Murder": "", "Rocky": "", "Infernal Affairs": "", "Harry Potter": "", "The Avengers": "", "Dog Day Afternoon": "", "Barry Lyndon": "", "Fanny and Alexander": "", "La Haine": "", "Guardians of the Galaxy": "", "Throne of Blood": "", "The Imitation Game": "", "High Noon": "", "Prisoners": "", "Pirates of the Caribbean": "", "Castle in the Sky": "", "The Help": "", "Roman Holiday": "", "Notorious": "", "Papillon": "", "Beauty and the Beast": "", "The Night of the Hunter": "", "Anatomy of a Murder": "", "Before Sunset": "", "Catch Me If You Can": "", "Three Colors: Red": "", "The Killing": "", "La Strada": "", "The Graduate": "" }));
  list_of_categories.push(new Category("Actions_Switch", false, { "Accept": "", "Accuse": "", "Achieve": "", "Acknowledge": "", "Acquire": "", "Adapt": "", "Add": "", "Adjust": "", "Admire": "", "Admit": "", "Adopt": "", "Adore": "", "Advise": "", "Afford": "", "Agree": "", "Aim": "", "Allow": "", "Announce": "", "Anticipate": "", "Apologize": "", "Appear": "", "Apply": "", "Appreciate": "", "Approach": "", "Approve": "", "Argue": "", "Arise": "", "Arrange": "", "Arrive": "", "Ask": "", "Assume": "", "Assure": "", "Astonish": "", "Attach": "", "Attempt": "", "Attend": "", "Attract": "", "Avoid": "", "Awake": "", "Beat": "", "Become": "", "Beg": "", "Begin": "", "Behave": "", "Believe": "", "Belong": "", "Bend": "", "Bet": "", "Bind": "", "Bite": "", "Blow": "", "Boil": "", "Borrow": "", "Bounce": "", "Bow": "", "Break": "", "Breed": "", "Bring": "", "Broadcast": "", "Build": "", "Burn": "", "Catch": "", "Celebrate": "", "Change": "", "Choose": "", "Chop": "", "Claim": "", "Climb": "", "Cling": "", "Come": "", "Commit": "", "Communicate": "", "Compare": "", "Compete": "", "Complain": "", "Complete": "", "Concern": "", "Confirm": "", "Consent": "", "Consider": "", "Consist": "", "Consult": "", "Contain": "", "Continue": "", "Convince": "", "Cook": "", "Cost": "", "Count": "", "Crawl": "", "Create": "", "Demand": "", "Deny": "", "Depend": "", "Describe": "", "Deserve": "", "Desire": "", "Destroy": "", "Determine": "", "Develop": "", "Differ": "", "Disagree": "", "Discover": "", "Discuss": "", "Dislike": "", "Distribute": "", "Dive": "", "Do": "", "Doubt": "", "Drag": "", "Dream": "", "Be": "", "Call": "", "Feel": "", "Find": "", "Get": "", "Give": "", "Go": "", "Have": "", "Hear": "", "Help": "", "Keep": "", "Know": "", "Leave": "", "Let": "", "Like": "", "Live": "", "Look": "", "Make": "", "May": "", "Mean": "", "Might": "", "Move": "", "Need": "", "Play": "", "Put": "", "Run": "", "Say": "", "See": "", "Seem": "", "Should": "", "Show": "", "Start": "", "Take": "", "Talk": "", "Tell": "", "Think": "", "Try": "", "Turn": "", "Use": "", "Want": "", "Work": "", "Shoot": "", "Kill": "" }));
  list_of_categories.push(new Category("Actors_Switch", false, { "Johnny Depp": "", "Leonardo DiCaprio": "", "Christian Bale": "", "Tom Hanks": "", "Tom Cruise": "", "Robert Downey Jr": "", "Denzel Washington": "", "Brad Pitt": "", "Harrison Ford": "", "Jake Gyllenhaal": "", "Jack Nicholson": "", "Morgan Freeman": "", "Ryan Gosling": "", "Al Pacino": "", "Matt Damon": "", "Liam Neeson": "", "Clint Eastwood": "", "Hugh Jackman": "", "Michael Caine": "", "Will Smith": "", "Anthony Hopkins": "", "Robert De Niro": "", "Chris Hemsworth": "", "Samuel Jackson": "", "James Franco": "", "Russell Crowe": "", "Tom Hardy": "", "Gary Oldman": "", "Zac Efron": "", "Dustin Hoffman": "", "Channing Tatum": "", "Sean Connery": "", "George Clooney": "", "Mark Wahlberg": "", "Marlon Brando": "", "Kevin Spacey": "", "Robert Duvall": "", "Bradley Cooper": "", "Ben Affleck": "", "Heath Ledger": "", "Sean Penn": "", "Laurence Olivier": "", "Daniel Craig": "", "Adam Sandler": "", "Bruce Willis": "", "Edward Norton": "", "Jude Law": "", "Robert Pattinson": "", "Benicio del Toro": "", "Jennifer Lawrence": "", "Marilyn Monroe": "", "Natalie Portman": "", "Joan Crawford": "", "Kate Winslet": "", "Diane Keaton": "", "Anne Hathaway": "", "Audrey Hepburn": "", "Katharine Hepburn": "", "Elizabeth Taylor": "", "Sophia Loren": "", "Meryl Streep": "", "Halle Berry": "", "Scarlett Johansson": "", "Angelina Jolie": "", "Sandra Bullock": "", "Jane Fonda": "", "Julia Roberts": "", "Bette Davis": "", "Greta Garbo": "", "Judy Garland": "", "Jennifer Aniston": "", "Lauren Bacall": "", "Nicole Kidman": "", "Emma Watson": "", "Cameron Diaz": "", "Ingrid Bergman": "", "Grace Kelly": "", "Kirsten Dunst": "", "Olivia de Havilland": "", "Cate Blanchett": "", "Ahney Her": "", "Doris Day": "", "Vivien Leigh": "", "Helen Mirren": "", "Debbie Reynolds": "", "Julie Andrews": "", "Mila Kunis": "", "Charlize Theron": "", "Marlene Dietrich": "", "Maggie Smith": "", "Eva Longoria": "", "Shirley Temple": "", "Carrie Fisher": "", "Saoirse Ronan": "", "Jennifer Jason Leigh": "", "Shelley Winters": "", "Emma Stone": "", "Keira Knightley": "" }));
  list_of_categories.push(new Category("TV_Shows_Switch", false, { "Friends": "", "Lost": "", "Desperate Housewives": "", "Haven": "", "House": "", "Doctor Who": "", "Californication": "", "Game of Thrones": "", "Merlin": "", "Big Bang Theory": "", "The Walking Dead": "", "Torchwood": "", "Under the Dome": "", "Breaking Bad": "", "How I Met Your Mother": "", "Sherlock": "", "Scandal": "", "The Following": "", "Buffy the Vampire Slayer": "", "Colombo": "", "Dallas": "", "Dawson's Creek": "", "Atlantis": "", "Twin Peaks (2016)": "", "House of Cards (US Version)": "", "Elementary": "", "Dexter": "", "True Detective": "", "Penny Dreadful": "", "American Horror Story": "", "Bates Motel": "", "Mistresses": "", "Orange Is the New Black": "", "Fear the Walking Dead": "", "Criminal Minds": "", "Extant": "", "Arrow": "", "Outlander": "", "Downton Abbey": "", "Vikings": "", "Parks and Recreation": "", "Defiance": "", "Black Sails": "", "Castle": "", "Two and a Half Men": "", "Suits": "", "Sons of Anarchy": "", "Prison Break": "", "Ripper Street": "", "Mad Men": "", "Heroes": "", "Nashville": "", "30 Rock": "", "The Killing": "", "The Tudors": "", "The Borgias": "", "Wentworth": "", "Chicago P.D": "", "Peaky Blinders": "", "Zoey101": "" }));
  list_of_categories.push(new Category("BTT_FFZ_Switch", false, { "PedoBear": "https://cdn.betterttv.net/emote/54fa928f01e468494b85b54f/3x", "RebeccaBlack": "https://cdn.betterttv.net/emote/54fa92ee01e468494b85b553/3x", "GabeN": "https://cdn.betterttv.net/emote/54fa90ba01e468494b85b543/3x", "AngelThump": "https://cdn.betterttv.net/emote/566ca1a365dbbdab32ec055b/3x", "D:": "https://cdn.betterttv.net/emote/55028cd2135896936880fdd7/3x", "FishMoley": "https://cdn.betterttv.net/emote/566ca00f65dbbdab32ec0544/3x", "KKona": "https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/3x", "haHAA": "https://cdn.betterttv.net/emote/555981336ba1901877765555/3x", "FeelsBirthdayMan": "https://cdn.betterttv.net/emote/55b6524154eefd53777b2580/3x", "FeelsBadMan": "https://cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/3x", "FeelsGoodMan": "https://cdn.betterttv.net/emote/566c9fde65dbbdab32ec053e/3x", "NaM": "https://cdn.betterttv.net/emote/566ca06065dbbdab32ec054e/3x", "SourPls": "https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/3x", "LuL": "https://cdn.betterttv.net/emote/567b00c61ddbe1786688a633/3x", "monkaS": "https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/3x", "FeelsAmazingMan": "https://cdn.betterttv.net/emote/5733ff12e72c3c0814233e20/3x", "DuckerZ": "https://cdn.betterttv.net/emote/573d38b50ffbf6cc5cc38dc9/3x", "Wowee": "https://cdn.betterttv.net/emote/58d2e73058d8950a875ad027/3x", "Clap": "https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x", "OMEGALUL": "https://cdn.betterttv.net/emote/583089f4737a8e61abb0186b/3x", "PepeHands": "https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x", "pepeJAM": "https://cdn.betterttv.net/emote/5b77ac3af7bddc567b1d5fb2/3x", "kekw": "https://cdn.betterttv.net/emote/5dae422b89488d12cc727c80/3x", "Pepega": "https://cdn.betterttv.net/emote/5aca62163e290877a25481ad/3x", "pepeD": "https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x", "EZ": "https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x", "POGGERS": "https://cdn.betterttv.net/emote/58ae8407ff7b7276f8e594f2/3x", "PepePls": "https://cdn.betterttv.net/emote/55898e122612142e6aaa935b/3x", "gachiBASS": "https://cdn.betterttv.net/emote/57719a9a6bdecd592c3ad59b/3x", "AYAYA": "https://cdn.betterttv.net/emote/58493695987aab42df852e0f/3x", "5Head": "https://cdn.betterttv.net/emote/5d6096974932b21d9c332904/3x", "gachiHYPER": "https://cdn.betterttv.net/emote/59143b496996b360ff9b807c/3x", "weirdChamp": "https://cdn.betterttv.net/emote/5d20a55de1cfde376e532972/3x", "ricardoFlick": "https://cdn.betterttv.net/emote/5bc2143ea5351f40921080ee/3x", "monkaW": "https://cdn.betterttv.net/emote/59ca6551b27c823d5b1fd872/3x", "PepeLaugh": "https://cdn.betterttv.net/emote/5c548025009a2e73916b3a37/3x", "blobDance": "https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/3x", "KEKW": "https://cdn.betterttv.net/emote/5e35dbb35e6f5751e76cc934/3x", "PepoDance": "https://cdn.betterttv.net/emote/5a6edb51f730010d194bdd46/3x", "TriDance": "https://cdn.betterttv.net/emote/5d1e70f498539c4801cc3811/3x", "HYPERS": "https://cdn.betterttv.net/emote/5980af4e3a1ac5330e89dc76/3x", "sumSmash": "https://cdn.betterttv.net/emote/5af84b9e766af63db43bf6b9/3x", "PepegaAim": "https://cdn.betterttv.net/emote/5d0d7140ca4f4b50240ff6b4/3x", "monkaHmm": "https://cdn.betterttv.net/emote/5aa16eb65d4a424654d7e3e5/3x", "peepoClap": "https://cdn.betterttv.net/emote/5d38aaa592fc550c2d5996b8/3x", "RainbowPls": "https://cdn.betterttv.net/emote/5b35cae2f3a33e2b6f0058ef/3x", "TriKool": "https://cdn.betterttv.net/emote/59a6d3dedccaf930aa8f3de1/3x", "pepeJAMJAM": "https://cdn.betterttv.net/emote/5c36fba2c6888455faa2e29f/3x", "peepoHappy": "https://cdn.betterttv.net/emote/5a16ee718c22a247ead62d4a/3x", "monkaTOS": "https://cdn.betterttv.net/emote/5a7fd054b694db72eac253f4/3x", "ppOverheat": "https://cdn.betterttv.net/emote/5b3e953a2c8a38720760c7f7/3x", "peepoLeave": "https://cdn.betterttv.net/emote/5d324913ff6ed36801311fd2/3x", "HYPERCLAP": "https://cdn.betterttv.net/emote/5b35ca08392c604c5fd81874/3x", "pepeDS": "https://cdn.betterttv.net/emote/5b444de56b9160327d12534a/3x", "peepoArrive": "https://cdn.betterttv.net/emote/5d922afbc0652668c9e52ead/3x", "gachiGASM": "https://cdn.betterttv.net/emote/55999813f0db38ef6c7c663e/3x", "monkaX": "https://cdn.betterttv.net/emote/58e5abdaf3ef4c75c9c6f0f9/3x", "weSmart": "https://cdn.betterttv.net/emote/589771dc10c0975495c578d1/3x", "PogUU": "https://cdn.betterttv.net/emote/5cf6a8322316b42d72be7c36/3x", "peepoPooPoo": "https://cdn.betterttv.net/emote/5c3427a55752683d16e409d1/3x", "ppHop": "https://cdn.betterttv.net/emote/5a9578d6dcf3205f57ba294f/3x", "peepoRun": "https://cdn.betterttv.net/emote/5bc7ff14664a3b079648dd66/3x", "FeelsRainMan": "https://cdn.betterttv.net/emote/57850b9df1bf2c1003a88644/3x", "PepoCheer": "https://cdn.betterttv.net/emote/5abd36396723dc149c678e90/3x", "monkaSHAKE": "https://cdn.betterttv.net/emote/58d867c84c25f4458349ecc7/3x", "TeaTime": "https://cdn.betterttv.net/emote/56f6eb647ee3e8fc6e4fe48e/3x", "LULW": "https://cdn.betterttv.net/emote/587d26d976a3c4756d667153/3x", "COGGERS": "https://cdn.betterttv.net/emote/5ab6f0ece1d6391b63498774/3x", "KKool": "https://cdn.betterttv.net/emote/56c2cff2d9ec6bf744247bf1/3x", "nymnCorn": "https://cdn.betterttv.net/emote/56cb56f5500cb4cf51e25b90/3x", "POGSLIDE": "https://cdn.betterttv.net/emote/5aea37908f767c42ce1e0293/3x", "bongoTap": "https://cdn.betterttv.net/emote/5ba6d5ba6ee0c23989d52b10/3x", "pepeMeltdown": "https://cdn.betterttv.net/emote/5ba84271c9f0f66a9efc1c86/3x", "ddHuh": "https://cdn.betterttv.net/emote/58b20d74d07b273e0dcfd57c/3x", "WaitWhat": "https://cdn.betterttv.net/emote/55cbeb8f8b9c49ef325bf738/3x", "ppJedi": "https://cdn.betterttv.net/emote/5b52e96eb4276d0be256f809/3x", "peepoSad": "https://cdn.betterttv.net/emote/5a16ddca8c22a247ead62ceb/3x", "HACKERMANS": "https://cdn.betterttv.net/emote/5b490e73cf46791f8491f6f4/3x", "RareParrot": "https://cdn.betterttv.net/emote/55a24e1294dd94001ee86b39/3x", "WAYTOODANK": "https://cdn.betterttv.net/emote/5ad22a7096065b6c6bddf7f3/3x", "pressF": "https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/3x", "WeirdChamp": "https://cdn.betterttv.net/emote/5d9198fbd2458468c1f4adb7/3x", "monkaGun": "https://cdn.betterttv.net/emote/58f6e05e58f5dd226a16166e/3x", "peepoSmash": "https://cdn.betterttv.net/emote/5c72084d41600b0832ab0931/3x", "PeepoClap": "https://cdn.betterttv.net/emote/5de48e64515a2a77bc9e7339/3x", "pikaOMG": "https://cdn.betterttv.net/emote/5bec16e1c3cac7088d09bdd7/3x", "HAhaa": "https://cdn.betterttv.net/emote/55f47f507f08be9f0a63ce37/3x", "PepegaPls": "https://cdn.betterttv.net/emote/5c04b07db4297124fa9d165e/3x", "MYAAA": "https://cdn.betterttv.net/emote/5de20a2c2dea2902de074598/3x", "peepoHey": "https://cdn.betterttv.net/emote/5c0e1a3c6c146e7be4ff5c0c/3x", "AlienPls": "https://cdn.betterttv.net/emote/5805580c3d506fea7ee357d6/3x", "forsenPls": "https://cdn.betterttv.net/emote/55e2096ea6fa8b261f81b12a/3x", "peepoArrive": "https://cdn.betterttv.net/emote/5e1c16778af14b5f1b43a246/3x", "Thonk": "https://cdn.betterttv.net/emote/585231dd58af204561cd6036/3x", "pepeJAMMER": "https://cdn.betterttv.net/emote/5baa5b59f17b9f6ab0f3e84f/3x", "pepeSmoke": "https://cdn.betterttv.net/emote/5b15162147c7bf3bfc0b9c76/3x", "CrabPls": "https://cdn.betterttv.net/emote/5c2a4ddda402f16774559abe/3x", "SALAMI": "https://cdn.betterttv.net/emote/5de45e0d515a2a77bc9e723d/3x", "headBang": "https://cdn.betterttv.net/emote/57320689d69badf9131b82c4/3x", "peepoLove": "https://cdn.betterttv.net/emote/5a5e0e8d80f53146a54a516b/3x", "TriFi": "https://cdn.betterttv.net/emote/5df0742ee7df1277b6070125/3x", "widepeepoHappy": "https://cdn.betterttv.net/emote/5e1a76dd8af14b5f1b438c04/3x", "forsenCD": "https://cdn.betterttv.net/emote/5d3e250a6d68672adc3fbff7/3x", "PauseChamp": "https://cdn.betterttv.net/emote/5cd6b08cf1dac14a18c4b61f/3x", "KKomrade": "https://cdn.betterttv.net/emote/56be9fd6d9ec6bf74424760d/3x", "PepeS": "https://cdn.betterttv.net/emote/59420c88023a013b50774872/3x", "billyReady": "https://cdn.betterttv.net/emote/58763fcecb2b7248f8b9b0cf/3x", "GachiPls": "https://cdn.betterttv.net/emote/58868aa5afc2ff756c3f495e/3x", "AAUGH": "https://cdn.betterttv.net/emote/5ddb7c12e579cd5efad78b28/3x" }));

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
            var regex_f_p = document.getElementById("first_word_detect_box").checked ? "^" : "";
            if (message.message.toLowerCase().search("\\b" + regex_f_p + chosenWord + "\\b") != -1) {
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