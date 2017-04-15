function id(what) { return document.getElementById(what) }
function get(what) { return localStorage[what] }
function set(item, value) { localStorage[item] = value }
Array.min = function(array){ return Math.min.apply( Math, array )};
var timer = { time:0, run:'false', base:0 }, table = {}, cpr = Math.floor(window.innerWidth/100) - 3;
set('cells', get("cells") || 0);
if (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) cpr = Math.min(Math.floor(screen.width/100), 8);
if (!cpr || cpr <= 0) cpr = 5;
set('times', get("times") || '');
timer.toggle = function() {
	if (timer.run == 'false') {
        if (id('timer').style.color == "rgb(127, 255, 0)") {
    		timer.time = 0;
    		timer.base = new Date();
    		timer.run = 'true';
    		id('timer').style.color = '#7FFF00';
            document.body.style.background = '#000';
            id('times').style.display = "none";
        }
	}
	else if (timer.run == 'true') {
		timer.run = 'false';
		id('timer').style.color = '#FFF';
		id('scramble').innerHTML = generateScramble();
        try {
            var row = Math.floor(get("cells")/cpr);
            var cell = get("cells")%cpr;
            if (cell === 0) table["row" + row] = id('times').insertRow(-1);
            table["row" + row]["cell" + cell] = table["row" + row].insertCell(-1);
            set('times', get("times") + timer.format(timer.time) + '|');
            table["row" + row]["cell" + cell].innerHTML = timer.format(timer.time);
            set('cells', parseFloat(get("cells")) + 1);
            var t = get("times").split('|'); t.pop();
            for (i = 0; i < t.length; i++) {
                for (j = 0; t[i].includes(':'); j++) {
                    t[i] = t[i].replace(':', '');
                }
            }
        } catch (ex) {
            try {
                var t = get("times").split('|'); t.pop();
                set('cells', t.length);
            } catch (ex) {}
        }
        if (timer.time == Array.min(t)) {
            document.body.style.background = '#64DD17';
            try{window.navigator.vibrate(200)}catch (ex){}
         }
        id('times').style.display = "";
	}
};
timer.tick = function() {
	if (timer.run == 'true') {
		timer.time = new Date() - timer.base;
		id('timer').innerHTML = timer.format(timer.time);
	}
	window.requestAnimationFrame(timer.tick);
};
timer.format = function(time) {
	var ms = time.toString().substring(time.toString().length - 3, time.toString().length);
	var h = Math.floor(time / 3600000);
	var m = Math.floor(time / 60000) - (h * 3600);
	var s = Math.floor(time / 1000) - (m * 60);
	time = '';
	if (h >= 1) { time = h + ':' }
	if (m >= 1) { time += m + ':' }
	for (i = 0; i < (2 - s.toString().length); i++) { s = '0' + s; }
	time += s + ':';
	for (i = 0; i < (3 - ms.length); i++) { ms = '0' + ms; }
	time += ms;
	return time;
};
function generateNotation() {
	var notation = Math.floor(Math.random() * 6);
    switch (notation) {
        case 0: notation = "U"; break;
        case 1: notation = "D"; break;
        case 2: notation = "F"; break;
        case 3: notation = "B"; break;
        case 4: notation = "L"; break;
        case 5: notation = "R"; break;
        default: notation = "U";
    }
    var addOn = Math.floor(Math.random() * 6);
    if (addOn == 3 || addOn == 4) notation += "i";
    else if (addOn == 5) notation += "2";
    return notation;
}
function generateScramble() {
	var scramble = '';
    var notation = "U", notation2;
    for (i = 0; i < 25; i++) {
        notation2 = notation;
        notation = generateNotation();
        while (notation.charAt(0) == notation2.charAt(0) || notation2.charAt(0) == notation.charAt(0)) {
            notation = generateNotation();
        }
        scramble += notation + " ";
    }
    return scramble;
}
var keyDown = 'false', timeout;
document.body.onkeyup = function (e) {     
    timer.toggle();
    id('timer').style.color = "#FFF";
    keyDown = 'false';
};
document.body.onkeydown = function (e) {
    if (keyDown == 'false') {
        if (timer.run == 'false') {
            id('timer').style.color = "#F00";
            clearTimeout(timeout);
            timeout = setTimeout(function(){if (keyDown == 'true'){id('timer').style.color = "#7FFF00";}}, 500);
        } else {
            timer.toggle();
            id('timer').style.color = "#FFF";
        }
        keyDown = 'true';
    }
};
if (!navigator.userAgent.match(/iPhone|iPad|iPod/i) && !navigator.userAgent.match(/Android/i)) {
    id('timer').onmouseup = function (e) {     
        timer.toggle();
        id('timer').style.color = "#FFF";
        keyDown = 'false';
    };
    id('timer').onmousedown = function (e) {
        if (keyDown == 'false') {
            if (timer.run == 'false') {
                id('timer').style.color = "#F00";
                clearTimeout(timeout);
                timeout = setTimeout(function(){if (keyDown == 'true'){id('timer').style.color = "#7FFF00";}}, 500);
            } else {
                timer.toggle();
                id('timer').style.color = "#FFF";
            }
            keyDown = 'true';
        }
    };
    id('scramble').onmousedown = function() { id('scramble').innerHTML = generateScramble() };
}
document.body.ontouchend = function(e){
    if (e.target.id == "timer") {
        timer.toggle();
        id('timer').style.color = '#FFFFFF';
    }
    keyDown = 'false';
};
document.body.ontouchstart = function(e){
    if (keyDown == 'false') {
        if (timer.run == 'false' && e.target.id == "timer") {
            id('timer').style.color = "#F00";
            clearTimeout(timeout);
            timeout = setTimeout(function(){if (keyDown == 'true'){id('timer').style.color = "#7FFF00";window.navigator.vibrate(50)}}, 500);
        } else if (timer.run == "true") {
            timer.toggle();
            id('timer').style.color = "#FFF";
        }
        keyDown = 'true';
    }
};
id('times').onclick = function (ev) {
    if (timer.run == 'false') {
        set('times', get("times").replace(ev.target.innerHTML + '|', ''));
        id('times').innerHTML = '';
        set('cells', parseFloat(get("cells")) - 1);
        updateTimes();
    }
};
document.body.oncontextmenu = function(e) { e.preventDefault(); }
id('scramble').ontouchstart = function() { id('scramble').innerHTML = generateScramble() };
function updateTimes() {
    try {
        if (get("times").includes('|')) {
            var times = get("times").split('|');
            if (times.length > 0) {
                for (i = 0; i < times.length; i++) {
                    if (times[i] != '') {
                        var row = Math.floor(i/cpr);
                        var cell = i%cpr;
                        if (cell == 0) table["row" + row] = id('times').insertRow(-1);
                        table["row" + row]["cell" + cell] = table["row" + row].insertCell(-1);
                        table["row" + row]["cell" + cell].innerHTML = times[i];
                    }
                }
            }
        }
    } catch (ex) {
            try {
                var t = get("times").split('|'); t.pop();
                set('cells', t.length);
            } catch (ex) {}
        }
}
function orientation() {
    cpr = Math.floor(window.innerWidth/100) - 3;
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) cpr = Math.min(Math.floor(screen.width/100), 8);
    if (!cpr || cpr <= 0) cpr = 5;
    id('times').innerHTML = "";
    updateTimes();
}
updateTimes();
id('scramble').innerHTML = generateScramble();
window.addEventListener("orientationchange", orientation); 
timer.tick();