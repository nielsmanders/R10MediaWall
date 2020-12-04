LeapManager.init({
    maxCursors: 1,
    frameCallback: function(frame) {
        frame.hands.forEach(function(h, i) {
            // only listen to the first hand
            if (i > 0) return;



            document.getElementById("h0_palmPosition").innerHTML = ("Hand[0] palmPosition " + h.palmPosition.join(" "));


            str = (h.palmPosition.join(" "));
            var array = str.split(' '),
                x = array[0],
                y = array[1],
                z = array[2];

            // console.log("x:" + x);
            // console.log("y:" + y);
            // console.log("z:" + z);

            sessionStorage.setItem("x", x);
            sessionStorage.setItem("y", y);

        });
    }
});