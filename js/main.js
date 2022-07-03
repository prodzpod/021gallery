window.onload = handleLoad;
window.onresize = handleResize;
document.addEventListener("wheel", handleWheel);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);

let LAYER = 0;
let PAGES = [0];
let PAGE = [0];

function handleLoad() {
    handleResize();
    let main = insertElement('div', e('page-wrapper').firstElementChild, 'page-row');
    for (let i = 0; i < CONTENT.length; i++) loadContent([i], CONTENT[i], main);
    PAGES[0] = CONTENT.length;
}

function handleResize() {
    document.documentElement.style.setProperty('--w', window.innerWidth + "px");
    document.documentElement.style.setProperty('--h', window.innerHeight + "px");
}

function loadContent(page, content, el) {
    let child = insertElement('div', el, 'page-cell');
    insertElement('div', child, 'page-inner', content.content);
    if (content.subpage?.length) {
        let sub = insertElement('div', child, 'subpage');
        sub.setAttribute('id', 'page-' + page.join('-'));
        for (let i = 0; i < content.subpage.length; i++) loadContent([...page, i], content.subpage[i], sub);
    }
    child.addEventListener("click", enterPage);
}

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}50

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) return;
  const xDiff = xDown - evt.touches[0].clientX;
  const yDiff = yDown - evt.touches[0].clientY;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) movePage(1);
    else movePage(-1);
  } else {
    if (yDiff > 0) enterPage();
    else exitPage();
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

let busy = false;
function handleWheel(evt) {
    if (busy) return;
    console.log(evt.deltaY)
    if (evt.deltaY < 0 && PAGE[LAYER] === 0) exitPage();
    else movePage(Math.sign(evt.deltaY));
    busy = true;
    setTimeout(() => { busy = false; }, 350);
}

function movePage(dir) {
    if (dir === 0 || 0 > (PAGE[LAYER] + dir) || (PAGE[LAYER] + dir) >= PAGES[LAYER]) return;
    PAGE[LAYER] += dir;
    updatePage();
}

function enterPage() {
    if (!e('page-' + PAGE.join('-'))) return;
    let main = insertElement('div', e('page-wrapper').firstElementChild, 'page-row');
    LAYER++;
    main.setAttribute('id', 'row-' + LAYER);
    let subpage = e('page-' + PAGE.join('-'));
    PAGES.push(subpage.childElementCount);
    PAGE.push(0);
    for (let i = 0; i < PAGE.reduce((prev, cur) => prev + cur, 0); i++) insertElement('div', main, 'page-empty');
    for (let el of Array.from(subpage.childNodes)) main.appendChild(el);
    cleanElement(subpage);
    updatePage();
}

function exitPage() {
    if (LAYER <= 0) return;
    PAGES.pop();
    PAGE.pop();
    for (let el of Array.from(e('row-' + LAYER).getElementsByClassName('page-empty'))) el.parentElement.removeChild(el);
    for (let el of Array.from(e('row-' + LAYER).childNodes)) e('page-' + PAGE.join('-')).appendChild(el);
    e('row-' + LAYER).parentElement.removeChild(e('row-' + LAYER));
    LAYER--;
    updatePage();
}

let rX = 0, rY = 0;
function updatePage() {
    let int = setInterval(() => {
        let x = PAGE.reduce((prev, cur) => prev + cur, 0);
        let y = LAYER;
        rX = lerp(rX, x, 0.5); rY = lerp(rY, y, 0.5);
        e('page-wrapper').firstElementChild.style.marginLeft = "calc(" + (-rX) + " * var(--w))";
        e('page-wrapper').firstElementChild.style.marginTop = "calc(" + (-rY) + " * var(--h))";
        if (Math.hypot(rX - x, rY - y) < 0.00001) clearInterval(int);
    }, 50);
}