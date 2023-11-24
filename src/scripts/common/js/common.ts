import {HeaderControl} from '/common/js/header/_header.js';
import {ControlLocalNavDropDown} from '/common/js/_localNavControl/_controlLocalNavDropDown.js';
import {ControlLocalNavTop} from '/common/js/_localNavControl/_controlLocalNavTop.js';
import {Tab} from '/common/js/component/_tab.js';
import {Accordion} from '/common/js/component/_accordion.js';
import {Dialog} from '/common/js/component/_dialog.js';
import {ShowMoreContents} from '/common/js/component/_showMoreContents.js';
import {CheckDisabled} from '/common/js/component/_checkDisabledDate.js';
import {MatchHeightElements} from '/common/js/component/_matchHeightElements.js';


const headerControl = new HeaderControl();

headerControl.init();

const localNavTopRoot = document.querySelector<HTMLElement>('.js-localnav-top');
const localNavDropDownTriggers = document.querySelectorAll<HTMLElement>('.js-localnav-dropdown-trigger');
const tabRoots = document.querySelectorAll<HTMLElement>('.js-tab');
const toggleRoots = document.querySelectorAll<HTMLElement>('.js-toggle');
const dialogRoots = document.querySelectorAll<HTMLDialogElement>('.js-dialog');
const showMoreRoots = document.querySelectorAll<HTMLElement>('.js-show-more');
const checkDisabledRoots = document.querySelectorAll<HTMLElement>('.js-check-disabled');

const matchHeightElements = new MatchHeightElements({
    debounce: 50,
});

matchHeightElements.init();

// window.matchHeightElements = matchHeightElements;

if (localNavTopRoot) {
    const controlLocalNavTop = new ControlLocalNavTop(localNavTopRoot);

    controlLocalNavTop.init();
}

if (localNavDropDownTriggers.length !== 0) {
    const controlLocalNavDropDown = new ControlLocalNavDropDown(localNavDropDownTriggers);

    controlLocalNavDropDown.init();
}

tabRoots.forEach((tabRoot) => {
    const tab = new Tab(tabRoot);

    tab.init();
});

toggleRoots.forEach((toggleRoot) => {
    const accordion = new Accordion(toggleRoot);

    accordion.init();
});

dialogRoots.forEach((dialogRoot) => {
    const dialog = new Dialog(dialogRoot);

    dialog.init();
});

showMoreRoots.forEach((target) => {
    const moreBtn = target.querySelector<HTMLButtonElement>('.js-show-more-btn');

    if (!moreBtn) {
        return;
    }

    const showMoreContents = new ShowMoreContents(target, moreBtn);

    showMoreContents.init();
});

checkDisabledRoots.forEach((checkDisabledRoot) => {
    const checkDisabled = new CheckDisabled(checkDisabledRoot);

    checkDisabled.init();
});
