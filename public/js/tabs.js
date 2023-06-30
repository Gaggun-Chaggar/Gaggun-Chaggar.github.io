/**
 * @param {HTMLElement} tablist
 */
const handleTabs = (tablist) => {
  const tabs = tablist.querySelectorAll(".tab");

  const tabPanels = [...tabs].map((tab) => {
    const panelId = tab.getAttribute("aria-controls");
    return document.getElementById(panelId);
  });

  const { setTabActive, setTabInactive, createOnClickEvent } = useSetTabState(
    tabs,
    tabPanels
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
  tabs.forEach((_, i) => {
    if (i === 0) return;
    setTabInactive(i);
  });

  setTabActive(0);

  const { switchView } = useSwitchView(tablist, tabs, tabPanels);

  switchView();
  window.addEventListener("resize", switchView);
};

/**
 * @param {NodeListOf<Element>} tabs
 * @param {NodeListOf<Element>} tabPanels
 */
const useSetTabState = (tabs, tabPanels) => {
  let activeTabIndex = 0;

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
  };

  /**
   * @param {number} index
   */
  const setTabInactive = (index) => {
    tabs[index].setAttribute("aria-selected", "false");
    tabs[index].setAttribute("tabindex", "-1");
    tabs[index].classList.remove("active");
    tabPanels[index].classList.add("hidden");
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

/**
 *
 * @param {HTMLElement} tablist
 * @param {NodeListOf<Element>} tabs
 * @param {NodeListOf<Element>} tabPanels
 */
const useSwitchView = (tablist, tabs, tabPanels) => {
  const tablistParent = tablist.parentElement;
  let view = "desktop";
  const convertTabpanelsToMobileView = () => {
    tablistParent.removeChild(tablist);
    tabPanels.forEach((tabpanel, index) => {
      const tab = tabs[index];
      const tabTitle = tab.textContent;

      const h2 = document.createElement("h2");
      h2.innerText = tabTitle;
      h2.className = "tab-heading fg-secondary p-2";

      tabpanel.prepend(h2);

      tabpanel.removeAttribute("role");
      tabpanel.classList.remove("tabpanel");
      tabpanel.classList.add("section");

      view = "mobile";
    });
  };

  const convertTabpanelsToDesktopView = () => {
    tablistParent.appendChild(tablist);

    tabPanels.forEach((tabpanel) => {
      const tabHeading = tabpanel.querySelector(".tab-heading");
      tabpanel.setAttribute("role", "tabpanel");
      tabpanel.classList.add("tabpanel");
      tabpanel.classList.remove("section");

      tabpanel.removeChild(tabHeading);
    });
    view = "desktop";
  };

  const switchView = () => {
    const width = document.querySelector("body").offsetWidth;
    const shouldSwitchToMobileView = width < 768 && view === "desktop";
    const shouldSwitchToDesktopView = width >= 768 && view === "mobile";

    if (shouldSwitchToMobileView) {
      return convertTabpanelsToMobileView();
    }

    if (shouldSwitchToDesktopView) {
      convertTabpanelsToDesktopView();
    }
  };

  return {
    switchView,
  };
};

handleTabs(document.querySelector("nav[role='tablist']"));
