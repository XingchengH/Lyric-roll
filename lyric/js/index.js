
// [
//     {time: 12.720, lyric: '岁月在默数三四五六 第六天以后'},
// ]

// fetch the lyric object with time and lyric
function parseLyric() {
    var lines = lyric.split('\n');
    var res = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var part = line.split(']');
        var timeStr = part[0].substring(1);

        var obj = {
            time: pareseTime(timeStr),
            lyric: part[1],
        }
        res.push(obj);
    }

    return res;
}

/**
 * convert time string to seconds
 * @param {String} timeStr 
 * @returns 
 */
function pareseTime(timeStr) {
    var parts = timeStr.split(':');
    var min = parseInt(parts[0]);
    var sec = parseFloat(parts[1]);
    return min * 60 + sec;
}

var lrcObj = parseLyric();

// require the dom elements
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}

/**
 * find the current lyric index which should be highlighted
 * from the lyric object accoring to the playing time
 * return -1 if not lyric need to be highlighted
 */
function findIdx() {
    // console.log(dom.audio.currentTime);
    var currTime = doms.audio.currentTime; // current player time

    for (var i = 0; i < lrcObj.length; i++) {
        var time = lrcObj[i].time;
        if (currTime < time) {
            return i - 1;
        }
    }
    return lrcObj.length - 1;
}

// Interface
function createLrcElements() {
    var frag = document.createDocumentFragment(); // create a document fragment to hold the li elements
    for (var i = 0; i < lrcObj.length; i++) {
        var li = document.createElement('li');
        li.textContent = lrcObj[i].lyric;
        // doms.ul.appendChild(li); // not optimal which each time create a new li, and update the dom
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}

createLrcElements();

// container height
var containerHeight = doms.container.clientHeight;
// li height
var liHeight = doms.ul.children[0].clientHeight;
// max offset which will not change
var maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * set ul offset
 */
function setOffset() {
    var idx = findIdx();
    var offset = liHeight * idx + liHeight / 2 - containerHeight / 2;

    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset) {
        offset = maxOffset;
    }

    doms.ul.style.transform = `translateY(-${offset}px)`; // up

    // remove active
    var li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }

    li = doms.ul.children[idx];
    if (li) {
        li.classList.add('active');
    }
}

// event
doms.audio.addEventListener('timeupdate', setOffset);