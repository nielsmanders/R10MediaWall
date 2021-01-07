LeapManager.init({
    maxCursors: 1,
    frameCallback: function(frame) {
        frame.hands.forEach(function(h, i) {
            // only listen to the first hand
            if (i > 0) return;

            str = (h.palmPosition.join(" "));
            var array = str.split(' '),
                x = array[0],
                y = array[1],
                z = array[2];

            sessionStorage.setItem("x", x);
            sessionStorage.setItem("y", y);

        });
    }
});