function id(what) { return document.getElementById(what) }
function get(what) { return localStorage[what] }
function set(item, value) { localStorage[item] = value }
Array.min = function(array){ return Math.min.apply( Math, array )};
Array.max = function(array){ return Math.max.apply( Math, array )};
var timer = { time:0, run:'false', base:0 }, table = {}, cpr = Math.floor(window.innerWidth/100) - 1;
set('cube', get("cube") || "3x3");
set('3x3Cells', get("3x3Cells") || 0);
set('2x2Cells', get("2x2Cells") || 0);
set('4x4Cells', get("4x4Cells") || 0);
set('5x5Cells', get("5x5Cells") || 0);
set('SkewbCells', get("SkewbCells") || 0);
set('PyraminxCells', get("PyraminxCells") || 0);
if (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) cpr = Math.min(Math.floor(screen.width/100), 12);
if (!cpr || cpr <= 0) cpr = 1;
set('3x3Times', get("3x3Times") || '');
set('2x2Times', get("2x2Times") || '');
set('4x4Times', get("4x4Times") || '');
set('5x5Times', get("5x5Times") || '');
set('SkewbTimes', get("SkewbTimes") || '');
set('PyraminxTimes', get("PyraminxTimes") || '');
timer.toggle = function() {
    if (timer.run == 'false') {
        if (id('timer').style.color == "rgb(127, 255, 0)") {
            timer.time = 0;
            timer.base = new Date();
            timer.run = 'true';
            id('timer').style.color = '#7FFF00';
            document.body.style.background = '#000';
            var eles = document.querySelectorAll('body *:not(#timer):not(main):not(strong)');
            for (i = 0; i < eles.length; i++) {
                eles[i].style.visibility= "hidden";
            }
        }
    }
    else if (timer.run == 'true') {
        timer.run = 'false';
        id('timer').style.color = '#FFF';
        id('scramble').innerHTML = generateScramble();
        try {
            var row = Math.floor(get(get("cube") + "Cells")/cpr);
            var cell = get(get("cube") + "Cells")%cpr;
            if (cell === 0) table["row" + row] = id('times').insertRow(-1);
            table["row" + row]["cell" + cell] = table["row" + row].insertCell(-1);
            set(get("cube") + 'Times', get(get("cube") + "Times") + timer.format(timer.time) + '|');
            table["row" + row]["cell" + cell].innerHTML = timer.format(timer.time);
            set(get("cube") + 'Cells', parseFloat(get(get("cube") + "Cells")) + 1);
            var t = get(get("cube") + "Times").split('|'); t.pop();
            for (i = 0; i < t.length; i++) {
                for (j = 0; t[i].includes(':'); j++) {
                    t[i] = t[i].replace(':', '');
                }
            }
        } catch (ex) {
            try {
                var t = get(get("cube") + "Times").split('|'); t.pop();
                set(get(get("cube") + 'Cells'), t.length);
            } catch (ex) {}
        }
        if (timer.time == Array.min(t)) {
            document.body.style.background = '#64DD17';
            try{window.navigator.vibrate(200)}catch (ex){}
        }
        refreshStats();
        var eles = document.querySelectorAll('body *:not(#timer):not(#times)');
        for (i = 0; i < eles.length; i++) {
            eles[i].style.visibility= "";
        }
        updateCollapse();
    }
};
timer.tick = function() {
	if (timer.run == 'true') {
		timer.time = new Date() - timer.base;
		id('timer').innerHTML = timer.format(timer.time);
                    id('timer').style.fontSize = (100-((id('timer').innerHTML.length-6)*17)) + "px";
	}
	window.requestAnimationFrame(timer.tick);
};
timer.format = function(time) {
	var ms = time.toString().substring(time.toString().length - 3, time.toString().length);
	var h = Math.floor(time / 3600000);
	var m = Math.floor(time / 60000) - (h * 60);
	var s = Math.floor(time / 1000) - (m * 60);
          if (h > 0) s = s - (m * 60);
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
    switch (get("cube")) {
        case "3x3" || "2x2":
            n = ["U", "D", "F", "B", "L", "R"],
            a = ["i", "i", "i", "2", "2", "", "", "", "", "", "", ""];
            break;
        case "Pyraminx":
            n = ["U", "B", "L", "R"],
            a = ["i", "i", "", "", ""];
            break;
        case "4x4":
            n = ["U", "D", "F", "B", "L", "R", "Fw", "Bw", "Rw", "Lw", "Uw", "Bw"],
            a = ["'", "'", "'", "2", "2", "", "", "", "", "", "", ""];
            break;
        case "5x5":
            n = ["U", "D", "F", "B", "L", "R", "Fw", "Bw", "Rw", "Lw", "Uw", "Bw"],
            a = ["'", "'", "'", "2", "2", "", "", "", "", "", "", ""];
            break;
        case "Skewb":
            n = ["U", "B", "L", "R"],
            a = ["i", "i", "", "", ""];
            break;
        default:
            n = ["U", "D", "F", "B", "L", "R"],
            a = ["i", "i", "i", "2", "2", "", "", "", "", "", "", ""];
    }
    return n[Math.floor(n.length * Math.random())] + a[Math.floor(a.length * Math.random())]
}
var scrambleLengths = {}, a, n;
scrambleLengths['3x3'] = 25, scrambleLengths['2x2'] = 9, scrambleLengths['4x4'] = 40, scrambleLengths['5x5'] = 60, scrambleLengths['Skewb'] = Math.round(Math.max(Math.random()*9,6)), scrambleLengths['Pyraminx'] = Math.round(Math.max(Math.random()*12,8));
function generateScramble() {
    scramble = '', notation = "U", notation2 = '', scrambleLengths['Pyraminx'] = Math.round(Math.max(Math.random()*12,8)), scrambleLengths['Skewb'] = Math.round(Math.max(Math.random()*9,6));
    for (i = 0; i < scrambleLengths[get("cube")]; i++) {
        notation2 = notation;
        notation = generateNotation();
        while (notation.charAt(0) == notation2.charAt(0) || Math.floor(n.indexOf(notation.charAt(0)) / 2) == Math.floor(n.indexOf(notation2.charAt(0)) / 2) || notation2.charAt(0) == notation.charAt(0)) {
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
            document.body.style.background = '#000';
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
    document.body.onmouseup = function (e) {     
        timer.toggle();
        id('timer').style.color = "#FFF";
        keyDown = 'false';
    };
    id('timer').onmousedown = function (e) {
        if (keyDown == 'false') {
            if (timer.run == 'false') {
                document.body.style.background = '#000';
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
    id('timesCollapse').onmouseup = collapseTimes;
    id('timesCollapse').setAttribute('class', 'hover');
    id('times').setAttribute('class', 'hover');
    id('scramble').setAttribute('class', 'hover');
} else {
    id('timesCollapse').ontouchend = collapseTimes;
    id('scramble').ontouchstart = function() { id('scramble').innerHTML = generateScramble() };
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
            document.body.style.background = '#000';
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
        set(get("cube") + 'Times', get(get("cube") + "Times").replace(ev.target.innerHTML + '|', ''));
        set(get("cube") + 'Cells', parseFloat(get(get("cube") + "Cells")) - 1);
        updateTimes();
        refreshStats();
    }
};
document.body.oncontextmenu = function(e) { e.preventDefault(); }
function updateTimes() {
    id('times').innerHTML = "";
    try {
        if (get(get("cube") + "Times").includes('|')) {
            var times = get(get("cube") + "Times").split('|');
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
            id('timesCollapse').style.visibility = "";
            id('timesCollapse').previousElementSibling.style.visibility = "";
            id('timesCollapse').nextElementSibling.style.visibility = "";
        } else {
            id('timesCollapse').style.visibility = "hidden";
            id('timesCollapse').previousElementSibling.style.visibility = "hidden";
            id('timesCollapse').nextElementSibling.style.visibility = "hidden";
        }
    } catch (ex) {
            try {
                var t = get(get("cube") + "Times").split('|'); t.pop();
                set(get("cube") + 'Cells', t.length);
            } catch (ex) {}
        }
}
function orientation() {
    cpr = Math.floor(window.innerWidth/100) - 1;
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) cpr = Math.min(Math.floor(screen.width/100), 12);
    if (!cpr || cpr <= 0) cpr = 1;
    updateTimes();
}
updateTimes();
id('scramble').innerHTML = generateScramble();
function refreshStats() {
    var t = get(get("cube") + "Times").split('|'); t.pop();
    if (t.length > 1) {
        var s = [];
        for (i = 0; i < t.length; i++) {
            var a = t[i].split(':');
            if (a.length == 3) s[i] = (+a[0]) * 60000 + (+a[1]) * 1000 + (+a[2]); 
            else s[i] = (+a[0]) * 1000 + (+a[1]);
        }
        var sum = s.reduce(function(a, b) { return a + b; });
        var avg = sum / s.length;
        id('stats').innerHTML = "<tr><td>" + timer.format(Array.min(s)) + "</td><td>" + timer.format(Math.round(avg))  + "</td><td>" + timer.format(Array.max(s)) + "</td></tr>";
    } else id('stats').innerHTML = "";
}
if (get("timesVisible") == undefined) set('timesVisible', true);
var timesVisible = (get("timesVisible") == 'true');
function collapseTimes() {
    set('timesVisible', timesVisible?false:true);
    timesVisible = (get("timesVisible") == 'true');
    id('times').style.visibility = timesVisible ? 'visible':'hidden';
    id('timesCollapse').innerHTML = timesVisible ? 'Hide times':'Show times';
}
function updateCollapse() {
    id('times').style.visibility = timesVisible ? 'visible':'hidden';
    id('timesCollapse').innerHTML = timesVisible ? 'Hide times':'Show times';
}
function updateCube() {
    set('cube', id('cube').value);
    updateTimes();
    refreshStats();
    id('scramble').innerHTML = generateScramble();
}
id('cube').value = get("cube");
updateCollapse();
refreshStats();
window.addEventListener("orientationchange", orientation);
window.addEventListener("resize", orientation);
timer.tick();