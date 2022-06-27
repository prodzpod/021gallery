let page = 0;
let npage = 3;
let selected = -1;
let subpage = 1;
let nsubpage = 2;
let combo = 0;

let busy = false;

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
    return "desktop";
};

window.onload = function(event) {
    let i = 0;
    let inner = e('main').firstElementChild;
    for (let el of CONTENT) {
        let block = insertElement('div', inner, 'block');
        block.setAttribute('id', 'main-' + i);
        block.setAttribute('onclick', 'onClick(' + i + ')');
        i++;
        let content = insertElement('div', block, ['content', 'vlist']);
        insertSpacer(content);
        content.innerHTML += el.content;
        insertSpacer(content);
        let subpages = insertElement('div', block, 'subpages');
        for (let page of el.subpages) {
            let block = insertElement('div', subpages, 'block');
            let content = insertElement('div', block, ['content', 'vlist']);
            insertSpacer(content);
            content.innerHTML += page;
            insertSpacer(content);
        }
    }
    npage = i;
    nsubpage = 2;
    onScrolled();
    if (deviceType() === "mobile") {
        e('main').onscroll = function() {
            if (!busy) {
                page = e('main').scrollLeft / document.documentElement.clientWidth;
                onScrolled();
            }
        }
        
        e('sub').onscroll = function() {
            if (!busy) {
                subpage = e('sub').scrollLeft / document.documentElement.clientWidth;
                onScrolled();
            }
        }
    }
}

window.onwheel = function(event) {
    let amount = event.deltaY / 2000 + combo;
    if (combo === 0 || Math.sign(combo) === Math.sign(amount)) {
        combo += Math.sign(amount) / 0.01
        if (Math.abs(combo) > 0.05) combo = clamp(-0.05, combo, 0.05);
    } else combo = 0;
    if (selected !== -1) {
        subpage += amount;
        subpage = clamp(0, subpage, nsubpage);
        if (combo === -0.05) subpage = 0.95;
    }
    else {
        page += amount;
        page = clamp(0, page, npage - 1);
    }
    onScrolled();
}

function onScrolled() {
    if (selected !== -1 && subpage < 1) {
        selected = -1;
        page += subpage - 1;
        subpage = 1;
        e('page-wrapper').style.marginTop = 0;
        e('page-bg').style.opacity = 1;
        busy = true;
        setTimeout(() => { busy = false; }, 500);
    }
    let vpage = Math.trunc(page) + ((page % 1) * (page % 1));
    let vsubpage = Math.trunc(subpage) + ((subpage % 1) * (subpage % 1));
    e('main').scrollLeft = document.documentElement.clientWidth * vpage;
    e('page-bg').style.marginLeft = -document.documentElement.clientWidth * (vpage + vsubpage - 1);
    e('sub').scrollLeft = document.documentElement.clientWidth * vsubpage;
}

function onClick(page) {
    selected = page;
    loadSubpages(page);
    subpage = 1;
    onScrolled();
    e('page-wrapper').style.marginTop = -document.documentElement.clientHeight;
    e('page-bg').style.opacity = 0;
    busy = true;
    setTimeout(() => { busy = false; }, 500);
}

function loadSubpages(page) {
    cleanElement(e('sub').firstElementChild);
    let target = e('main-' + page).getElementsByClassName('subpages')[0];
    e('sub').firstElementChild.innerHTML = '<div class="block"></div>' + target.innerHTML;
    nsubpage = target.getElementsByClassName('block').length;
}