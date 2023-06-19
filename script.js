// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const section1 = document.querySelector("#section--1");
const h1 = document.querySelector("h1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Scrolling ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
btnScrollTo.addEventListener("click", function (e) {
  // New Way
  section1.scrollIntoView({ behavior: "smooth" }); // Smooth Scrolling
  /* Old School Way
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth",
  });
  
  // getBoundingClientRect() : 해당 요소의 뷰포트 상 위치와 크기를 좌표(x, y, width, height 등)로 알려줌. 스크롤 하면 좌표값이 바뀐다.
  const s1coords = section1.getBoundingClientRect();
  // section 1 좌표값
  console.log(s1coords); // DOMRect {x: 0, y: 713.6000366210938, width: 958.4000244140625, height: 1567, top: 713.6000366210938, …}
  // Button 좌표값
  console.log(e.target.getBoundingClientRect()); // DOMRect {x: 30, y: 559.9750366210938, width: 117.6500015258789, …}

  // window.pageXOffset : 얼만큼 스크롤 되었는지 알려줌
  console.log("Current Scroll (x / y)", window.pageXOffset, window.pageYOffset);

  // document.documentElement.clientHeight : 현재 뷰포트 크기 알려줌
  console.log(
    "Viewport height / width",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); */
});

// Page Navigation ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Event Delegation 없이 nav button 에 Event 추가 시 : 버튼 하나마다 이벤트 발생하므로 작업이 느려짐
document.querySelectorAll(".nav__link").forEach(function (el) {
  el.addEventListener("click", function (e) {
    e.preventDefault();

    const id = this.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
}); */
// Event Delegation
// 1. 이벤트 적용할 요소들의 공통된 부모 요소에 Event Listener를 추가 (Add Event Listner to common parent element)
// 2. 어떤 요소가 이벤트를 유발시켰는지 결정 (Determine which element originated the event)
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    // console.log(id); // #section--1 / #section--2 / #section--3
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Events and Event Handlers ////////////////////////////////////////////////////////////////////////////////////////////////////////
// mouseenter
const mouseH1 = function (e) {
  console.log("mouse entered");

  // removeEventListener
  h1.removeEventListener("mouseenter", mouseH1); // 이벤트 한 번만 실행하고 제거
};

h1.addEventListener("mouseenter", mouseH1);
/* Old School Way
h1.onmouseenter = function (e) {
  console.log("mouse entered");
}; */

// setTimeout(() => h1.removeEventListener("mouseenter", mouseH1), 3000); // 일정 시간 지난 뒤 이벤트 제거

// Tabbed Component /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
tabsContainer.addEventListener("click", function (e) {
  const clickedBtn = e.target.closest(".operations__tab"); // e.target만 하면 <button> 안의 <span> 태그 누르면 span이 선택되기 때문

  // Guard Clause : Tab Container 안이지만 버튼 밖에를 클릭했을 때 무시 (tab 영역에서 버튼 밖 클릭했을 때 무시). null 오류 방지
  if (!clickedBtn) return;

  // Deactivate Other Tabs
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Active Selected Button
  clickedBtn.classList.add("operations__tab--active");
  // Active Selected Content
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu Fade Animation ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mouseover ↔ mouseout (버블 O)
// mouseenter ↔ mouseleave (버블 X)
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target; // 메뉴 a 태그 안에 잘못 클릭할 만한 다른 태그가 없으므로, closest 안 써도 됨
    const siblings = link.closest("nav").querySelectorAll(".nav__link");
    const logo = link.closest("nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky Navigation: Intersection Observer API  /////////////////////////////////////////////////////////////////////////////////////
/*
const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Revealing Elements on Scroll //////////////////////////////////////////////////////////////////////////////////////////////////////
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  // Stop observing when scroll done
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy Loading Images //////////////////////////////////////////////////////////////////////////////////////////////////////////////
const imgTargets = document.querySelectorAll("img[data-src]"); // data-src 속성 가진 모든 img 선택
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src(Placeholder Image) with data-src(Original Image)
  entry.target.src = entry.target.dataset.src;

  // Removing Blur Effect
  entry.target.addEventListener("load", function () {
    // 바로 class remove 하면 로딩 전에 blur 제거되므로, load 완료되면 blur 제거하도록
    entry.target.classList.remove("lazy-img");
  });

  // Stop observing when scroll done
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px", // 사용자가 이미지 로딩 느린 걸 눈치채지 못하도록 미리 로드
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Building a Slider Component //////////////////////////////////////////////////////////////////////////////////////////////////////
// const slider = document.querySelector(".slider");
const sliders = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // slider.style.transform = "scale(0.4) translateX(-800px)";
  // slider.style.overflow = "visible";

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend", // adding it as last child
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activate Current Dot
  const activateDot = function (slide) {
    // 기존 activation 제거
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    // Activated Selected Dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide); // currentSlide = 1 : -100%, 0%, 100%, 200%
    activateDot(currentSlide);
  };

  // Previous Slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Initialization
  const init = function () {
    createDots();
    goToSlide(0); // 0%, 100%, 200%, 300%
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // Slide by Keyboard <- ->
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Slide by Dots : 각 버튼에 이벤트 달기보다는, 부모 요소(Dot Container)에 이벤트 적용 (Event Delegation 이용)
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = e.target.dataset.slide;

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliders();

// Lifecycle DOM Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Document - DOMContentLoaded Event : document에 의해, HTML이 파싱되자마자 (HTML이 다운로드 되고 DOM Tree로 변환되었을 때) 발동되는 이벤트
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed and DOM Tree built!", e);
});
// Window - load Event : HTML 파싱 뿐 아니라 CSS 파일, 이미지 등 페이지가 최종적으로 로딩이 끝나면 발동되는 이벤트
window.addEventListener("load", function (e) {
  console.log("Page fully loaded", e);
});
// Window - beforeunload event : 사용자가 페이지를 떠나기 직전에 생성되는 이벤트.
// 사용자가 브라우저 탭 닫기 전에 사용자에게 해당 페이지 나갈 건지 물어볼 때 사용.
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = "";
});*/
