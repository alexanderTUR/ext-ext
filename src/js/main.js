// This script solve the popular problem when 100vh doesn’t fit the mobile browser screen (work with PostCSS plugin)
const customViewportCorrectionVariable = 'vh';

function setViewportProperty(doc) {
  let prevClientHeight;
  let customVar = '--' + (customViewportCorrectionVariable || 'vh');
  function handleResize() {
    let clientHeight = doc.clientHeight;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(function updateViewportHeight() {
      doc.style.setProperty(customVar, clientHeight * 0.01 + 'px');
      prevClientHeight = clientHeight;
    });
  }
  handleResize();
  return handleResize;
}
window.addEventListener('resize', setViewportProperty(document.documentElement));

document.addEventListener('DOMContentLoaded', function (event) {
  // Micromodal plugin init
  MicroModal.init({
    disableScroll: false,
    awaitOpenAnimation: true,
    awaitCloseAnimation: true,
  });

  // Burger menu scripts
  const burgerButton = document.querySelector('.burger-button');
  const navigation = document.querySelector('.main-navigation');
  const clickDelay = 300;
  let clickDelayTimer = null;

  burgerButton.addEventListener('click', () => {
    if (clickDelayTimer === null) {
      burgerButton.classList.toggle('burger-button_active');
      navigation.classList.toggle('main-navigation_opened');

      if (!burgerButton.classList.contains('burger-button_active')) {
        burgerButton.classList.add('burger-button_closing');
      }

      clickDelayTimer = setTimeout(function () {
        burgerButton.classList.remove('burger-button_closing');
        clearTimeout(clickDelayTimer);
        clickDelayTimer = null;
      }, clickDelay);
    }
  });

  const navigationLinks = document.querySelectorAll('.main-navigation__link');
  navigationLinks.forEach((navigationLink) => {
    navigationLink.addEventListener('click', (elem) => {
      if (burgerButton.classList.contains('burger-button_active')) {
        burgerButton.click();
      }
    });
  });

  // Scroll to ID scripts
  const calcOffset = () => {
    if (window.innerWidth < 1024) {
      return 100;
    } else return 0;
  };

  function scrollToElement(myElement, scrollDuration = 500, offset = calcOffset()) {
    const elementExists = document.querySelector(myElement);
    if (elementExists && elementExists.getBoundingClientRect) {
      const rect = elementExists.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY - offset;
      const cosParameter = (window.scrollY - elementTop) / 2;
      let scrollCount = 0;
      let oldTimestamp = performance.now();
      function step(newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) {
          window.scrollTo(0, elementTop);
          return;
        }
        window.scrollTo(
          0,
          Math.round(cosParameter + cosParameter * Math.cos(scrollCount)) + elementTop
        );
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
  }

  const scrolledLinks = document.querySelectorAll("a[rel='scroll-to-id']");

  if (scrolledLinks.length) {
    scrolledLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        scrollToElement(e.target.getAttribute('href'));
      });
    });
  }

  // Highlight menu links with intersection observer
  const changeNav = (entries, observer) => {
    entries.forEach((entry) => {
      // verify the element is intersecting
      if (entry.isIntersecting && entry.intersectionRatio) {
        // remove old active class
        document.querySelector('.current').classList.remove('current');
        // get id of the intersecting section
        const id = entry.target.getAttribute('id');
        // find matching link & add appropriate class
        const newLink = document.querySelector(`[href="#${id}"]`).classList.add('current');
      }
    });
  };

  // calc threshold function
  const calcThreshold = () => {
    if (window.innerWidth > 1280) {
      return 0.4;
    } else if (window.innerWidth >= 1024 && window.innerWidth <= 1280) {
      return 0.3;
    } else return 0.2;
  };

  // init the observer
  const options = {
    threshold: calcThreshold(),
  };

  const observer = new IntersectionObserver(changeNav, options);

  // target the elements to be observed
  const sections = document.querySelectorAll('.jsMenuTarget');
  sections.forEach((section) => {
    // console.log('section', section);
    observer.observe(section);
  });

  // Tabs scripts
  const tabsControlButtons = document.querySelectorAll('.tabs__switchers-button');
  if (tabsControlButtons.length) {
    tabsControlButtons.forEach((tabsControlButton) => {
      tabsControlButton.addEventListener('click', (elem) => {
        tabsControlButtons.forEach((tabsControlButton) => {
          tabsControlButton.classList.remove('tabs__switchers-button_active');
        });
        tabsControlButton.classList.add('tabs__switchers-button_active');
        const activeTabName = elem.target.getAttribute('data-switch-tab');
        const contentTabs = document.querySelectorAll('.tabs__tab');
        contentTabs.forEach((contentTab) => {
          contentTab.classList.remove('tabs__tab_active');
        });
        const targetTab = document.querySelector(`[data-tab='${activeTabName}']`);
        targetTab.classList.add('tabs__tab_active');
      });
    });
  }
});
