function e(id) { return document.getElementById(id); }

function cleanElement(el) { if (typeof(el) == 'string') el = e(el); while (el?.hasChildNodes()) el.removeChild(el.firstChild); }

function checkEnter(event, func, ...args) {
    if (event.keyCode === 13) func(...args);
}

function insertElement(type, parent, classList, html) {
    let el = document.createElement(type);
    if (![undefined, null, false].includes(html)) el.innerHTML = html;
    if (classList) {
        if (typeof(classList) == 'string') classList = [classList];
        if (classList.length) el.classList.add(...classList);
    } 
    if (parent) {
        if (typeof(parent) == 'string') parent = e(parent);
        if (parent) parent.appendChild(el);
    }
    return el;
}

function insertSpacer(parent) { return insertElement('div', parent, ['spacer']); }

function resizeArea(el) {
    if (typeof(el) == 'string') el = e(el);
    if (el) {
        el.style.height = "1px";
        el.style.height = (25+el.scrollHeight)+"px";
    }
}

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < 32; i++) {
        chr   = this.charCodeAt(i % this.length);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function bits(str, a, b) {
    return ((str.hashCode() >>> 0) >> Math.min(a, b)) & ((1 << (Math.abs(a - b))) - 1);
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return `#${col(r)}${col(g)}${col(b)}`;
}

function col(x) { return Math.round(x * 255).toString(16).padStart(2, '0'); }

function toJSDate(num) {
    if (typeof(num) == 'string') {
        if (isNaN(num)) num = new Date(num);
        else num = Number(num);
    }
    if (typeof(num) == 'number') num = new Date(num);
    return `${String(num.getFullYear()).padStart(4, '0')}-${String(num.getMonth()+1).padStart(2, '0')}-${String(num.getDate()).padStart(2, '0')}`
}

function rdiv(a, b) { return a - (a % b); }

function fweek(num) {
    if (typeof(num) == 'string') {
        if (isNaN(num)) num = new Date(num);
        else num = Number(num);
    }
    if (typeof(num) == 'number') num = new Date(num);
    return num.getTime() - (((num.getDay() + 6) % 7) * 86400000) - (num.getTime() % 86400000);
}

function lerp(a, b, t) {
    return t * (b - a) + a;
}

function clamp(a, b, c) {
    return Math.min(Math.max(Math.min(a, c), b), Math.max(a, c));
}