var options = {
    enableGestures: true
};
Leap.loop(options, function(frame) {

    let numberHands = frame.hands.length;

    if (numberHands == 1) {
        if (excecuted == false) {
            randomWord();
            excecuted = true;
            excecutedNumber = 1;
        }
    } else {
        if (excecuted == true) {
            excecuted = false;
        }
    }

});

function randomWord() {
    var chosenWord;
    var lastWord;

    var word = Array("You always pass failure on the way to success.", "Keep your face to the sunshine and you can never see a shadow.", "If oppertunity doesn't knock, build a door.", "The first step is to say that you can.", "The best is yet to be.", "Wherever you are, and whatever you do, be in love.");
    chosenWord = word[Math.floor(Math.random() * word.length)];

    if (chosenWord == lastWord) {
        return pickWord();
    } else {
        document.getElementById("quote").innerHTML = chosenWord;
        lastWord = chosenWord;
    }
}