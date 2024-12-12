'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
//---ALTERNATIVELY--- A better way than the For loop

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////////////////////
//------------------Button Navigation------------------
///////////////////////////////////////////////////////

btnScrollTo.addEventListener('click', function (e) {
  //---REMINDER--- MODERN WAYS OF SCROLL
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////////////
//------------------Page Navigation--------------------
///////////////////////////////////////////////////////

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     let id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//*************************************************** */
//---ALTERNATIVELY--- Its better to use even delegation
//*************************************************** */

//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    let id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////////////////////////
//------------------Tabbed Component-------------------
///////////////////////////////////////////////////////

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  e.preventDefault();

  //Guard Clause
  if (!clicked) return;
  //Active Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //Active Content Area
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////////////
//------------------Menu Fade Animation-----------------
///////////////////////////////////////////////////////

//===REFACTORED====
//---REMINDER--- Here we used el.style.opacity = this since we binded the HandleHover function therefore the this keyword points to the opacity

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////
//------------------Sticky Navigation------------------
///////////////////////////////////////////////////////

//Using scroll event firstly
//===REMINDER=== (there is another method and this method should be avoided)
/*
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function (e) {
  if (window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/
//====ALTERNATIVELY==== This is the better Method ( INTERSECTION OBSERVER API)

// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
//////////////////////////////////////////////////////////////////////
///////////////////---VERY-IMPORTANT---------////////////////////////
/////////////////////////////////////////////////////////////////////
/*
//--TEST----
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  //---REMINDER--- OLD SCHOOL SCROLLS
  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //Better Scroll
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //---REMINDER--- MODERN WAYS OF SCROLL
  section1.scrollIntoView({ behavior: 'smooth' });
});
//---IMPORTANT---

//---SELECTING ELEMENTS----

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//---IMPORTANT---

//---Creating and inserting elements

// .insertAdjacentHTML

const message = document.createElement('div');

message.classList.add('cookie--message');
message.textContent =
  'We use cookies for imporved functionalitiy and analytics';

message.innerHTML =
  'We use cookies for imporved functionalitiy and analytics . <button class="btn btn--close-cookie"> Got it</button>';

//Adding it as a First Child
// header.prepend(message);
//Adding it as a Last Child
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
header.after(message);

//DELETING ELEMENTS

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//Styles

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.color = '#bbb';
message.style.textAlign = 'center';

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// Increasing height

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

//---IMPORTANT---
//---Attirbutes---

const logo = document.querySelector('.nav__logo');
console.log(logo.src);

// Data Attributes

console.log(logo.dataset.versionNumber);

//Classes

logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

//Dont use since it overrides the classes
// logo.className = 'Marwan';


const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('addEventListener:Great!');
  //---REMINDER--- This basically cancels the event after it happens
  // h1.removeEventListener('mouseenter', alertH1);
};

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);

h1.onmouseenter = function (e) {
  // alert('onMouse');
};


// rgb(255,255,255)

//BUBBLING

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  //---VERY-IMPORTANT--- Stop propagation/Bubbling Not the best idea
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

//---SECTION---- Dom traversing

const h1 = document.querySelector('h1');

//Going Downwards : Child elements

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'violet';
console.log();

//Going Upwards : parent elements

console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways : siblings ( direct previous or next)

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
