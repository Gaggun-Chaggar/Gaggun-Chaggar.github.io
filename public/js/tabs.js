const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

/**
 * @param {HTMLElement} tablist
 */
const handleTabs = (tablist) => {
  const tabs = tablist.querySelectorAll(".tab");

  const tabTracker = tablist.parentElement.querySelector(".tab-tracker");

  const tabPanels = [...tabs].map((tab) => {
    const panelId = tab.getAttribute("aria-controls");
    return document.getElementById(panelId);
  });

  const { setTabActive, setTabInactive, createOnClickEvent } = useSetTabState(
    tabs,
    tabPanels,
    tabTracker
  );
  const { createOnKeydownEvent } = useKeyboardEvents(tabs);

  // add event listeners
  tabs.forEach((tab, index) => {
    const onClick = createOnClickEvent(index);
    const onKeydown = createOnKeydownEvent(index);

    tab.addEventListener("click", onClick);
    tab.addEventListener("keydown", onKeydown);
  });

  // set state
  tabs.forEach((_, i) => setTabInactive(i));

  const route = document.location.hash;
  const firstActiveTabIndex = [...tabs].findIndex(
    (t) => t.getAttribute("href") === route
  );
  setTabActive(firstActiveTabIndex > -1 ? firstActiveTabIndex : 0);
};

/**
 * @param {NodeListOf<Element>} tabs
 * @param {NodeListOf<Element>} tabPanels
 * @param {HTMLElement} tabTracker
 */
const useSetTabState = (tabs, tabPanels, tabTracker) => {
  let activeTabIndex = 0;
  let activeResizer;

  /**
   * @param {number} index
   */
  const setTabActive = (index) => {
    tabs[index].setAttribute("aria-selected", "true");
    tabs[index].setAttribute("tabindex", "0");
    tabs[index].classList.add("active");
    tabPanels[index].classList.add("hidden-fade-in");
    tabPanels[index].classList.remove("hidden");
    setTimeout(() => {
      tabPanels[index].classList.remove("hidden-fade-in");
    }, 1);

    activeTabIndex = index;

    if (!tabTracker) {
      return;
    }

    const setTrackerPosition = () => {
      tabTracker.style.setProperty(
        "--offset",
        `calc(${
          tabs[index].offsetLeft + tabs[index].offsetWidth / 2
        }px - var(--radius))`
      );
    };

    // handle initial page load
    setTrackerPosition();
    setTimeout(setTrackerPosition, 150);
    window.addEventListener("resize", debounce(setTrackerPosition, 100));
    activeResizer = setTrackerPosition;
  };

  /**
   * @param {number} index
   */
  const setTabInactive = (index) => {
    tabs[index].setAttribute("aria-selected", "false");
    tabs[index].setAttribute("tabindex", "-1");
    tabs[index].classList.remove("active");
    tabPanels[index].classList.add("hidden");

    window.removeEventListener("resize", activeResizer);
  };

  /**
   * @param {number} index
   */
  const setSelectedTab = (index) => {
    setTabInactive(activeTabIndex);
    setTabActive(index);
  };

  const createOnClickEvent = (index) => () => setSelectedTab(index);

  return {
    setTabActive,
    setTabInactive,
    createOnClickEvent,
  };
};

/**
 * @param {NodeListOf<Element>} tabs
 */
const useKeyboardEvents = (tabs) => {
  /**
   * @param {number} index
   */
  const focusOnNextTab = (index) => {
    const nextTabIndex = index === tabs.length - 1 ? 0 : index + 1;
    tabs[nextTabIndex].focus();
  };

  /**
   * @param {number} index
   */
  const focusOnPreviousTab = (index) => {
    const previousTabIndex = index === 0 ? tabs.length - 1 : index - 1;
    tabs[previousTabIndex].focus();
  };

  const focusOnFirstTab = () => {
    tabs[0].focus();
  };

  const focusOnLastTab = () => {
    tabs[tabs.length - 1].focus();
  };

  /**
   * @param {KeyboardEvent} event
   * @param {number} index
   */
  const createOnKeydownEvent = (index) => (event) => {
    let preventDefault = false;

    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft":
        focusOnPreviousTab(index);
        preventDefault = true;
        break;
      case "ArrowDown":
      case "ArrowRight":
        focusOnNextTab(index);
        preventDefault = true;
        break;
      case "Home":
        focusOnFirstTab();
        preventDefault = true;
        break;
      case "End":
        focusOnLastTab();
        preventDefault = true;
        break;
    }

    if (!preventDefault) return;

    event.stopPropagation();
    event.preventDefault();
  };

  return {
    createOnKeydownEvent,
  };
};

handleTabs(document.querySelector("nav[role='tablist']"));
