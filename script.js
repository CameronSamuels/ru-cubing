function id(what) { return document.getElementById(what) }
function get(what) { return localStorage[what] }
function set(item, value) { localStorage[item] = value }
Array.min = function(array){ return Math.min.apply( Math, array )};
var timer = { time:0, run:'false', base:0 }, table = {};
set('cells', get("cells") || 0);
set('times', get("times") || '');
chrome.storage.sync.get("times", function(obj){set('times', obj.times || get("times") || '')});
chrome.storage.sync.get("cells", function(obj){set('cells', obj.cells || get("cells") || '')});
timer.toggle = function() {
	if (timer.run == 'false') {
        if (id('timer').style.color == "rgb(127, 255, 0)") {
    		timer.time = 0;
    		timer.base = new Date();
    		timer.run = 'true';
    		id('timer').style.color = '#7FFF00';
            id('body').style.background = '#000';
        }
	}
	else if (timer.run == 'true') {
		timer.run = 'false';
		id('timer').style.color = '#FFF';
		id('scramble').innerHTML = generateScramble();
        var row = Math.floor(get("cells")/10);
        var cell = get("cells")%10;
        if (cell === 0) table["row" + row] = id('times').insertRow(-1);
        table["row" + row]["cell" + cell] = table["row" + row].insertCell(-1);
        set('times', get("times") + timer.format(timer.time) + '|');
        table["row" + row]["cell" + cell].innerHTML = timer.format(timer.time);
        set('cells', parseFloat(get("cells")) + 1);
        chrome.storage.sync.set({'times': get("times")});
        chrome.storage.sync.set({'cells': get("cells")});
        var t = get("times").split('|'); t.pop();
        for (i = 0; i < t.length; i++) {
            for (j = 0; t[i].includes(':'); j++) {
                t[i] = t[i].replace(':', '');
            }
        }
        if (timer.time == Array.min(t)) id('body').style.background = '#64DD17';
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
var keyDown = 'false';
id('body').onkeyup = function (e) {     
    timer.toggle();
    id('timer').style.color = "#FFF";
    keyDown = 'false';
};
id('body').onkeydown = function (e) {
    if (keyDown == 'false') {
        id('timer').style.color = "#F00";
        keyDown = 'true';
        setTimeout(function(){if (keyDown == 'true'){id('timer').style.color = "#7FFF00";}}, 500);
    }
};
id('timer').onmouseup = function (e) {     
    timer.toggle();
    id('timer').style.color = "#FFF";
    keyDown = 'false';
};
id('timer').onmousedown = function (e) {
    if (keyDown == 'false') {
        id('timer').style.color = "#F00";
        keyDown = 'true';
        setTimeout(function(){if (keyDown == 'true'){id('timer').style.color = "#7FFF00";}}, 500);
    }
};
id('times').onclick = function (ev) {
    set('times', get("times").replace(ev.target.innerHTML + '|', ''));
    id('times').innerHTML = '';
    set('cells', parseFloat(get("cells")) - 1);
    chrome.storage.sync.set({'times': get("times")});
    chrome.storage.sync.set({'cells': get("cells")});
    updateTimes();
};
id('main').ontouchend = function(){
    timer.toggle();
    document.getElementById('timer').style.color = '#FFFFFF';
    keyDown = 'false';
};
id('main').ontouchstart = function(){
    if (keyDown == 'false') {
        document.getElementById('timer').style.color = '#FF0000';
        keyDown = 'true';
        setTimeout(function(){if (keyDown == 'true'){document.getElementById('timer').style.color = '#7FFF00';}}, 550);
    }
};

id('scramble').onclick = function() { id('scramble').innerHTML = generateScramble() };
function updateTimes() {
    if (get("times").includes('|')) {
        var times = get("times").split('|');
        if (times.length > 0) {
            for (i = 0; i < times.length; i++) {
                if (times[i] != '') {
                    var row = Math.floor(i/10);
                    var cell = i%10;
                    if (cell == 0) table["row" + row] = id('times').insertRow(-1);
                    table["row" + row]["cell" + cell] = table["row" + row].insertCell(-1);
                    table["row" + row]["cell" + cell].innerHTML = times[i];
                }
            }
        }
    }
}
updateTimes();
id('scramble').innerHTML = generateScramble();
timer.tick();