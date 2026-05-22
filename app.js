(function () {
  const STORAGE_KEY = "zam-zam-menu-data-v1";
  const defaultData = window.ZAM_ZAM_MENU_DATA || {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getMenuData() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : clone(defaultData);
    } catch (error) {
      return clone(defaultData);
    }
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value || "";
    });
  }

  function phoneHref(phone) {
    return "tel:" + String(phone || "").replace(/[^\d+]/g, "");
  }

  function whatsappHref(phone, message) {
    const number = String(phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(message || "Assalam o Alaikum, mujhe order karna hai.");
    return "https://wa.me/" + number + "?text=" + text;
  }

  function renderRestaurant(restaurant) {
    setText("[data-restaurant-name]", restaurant.name);
    setText("[data-tagline]", restaurant.tagline);
    setText("[data-hero-text]", restaurant.heroText);
    setText("[data-hours-label]", restaurant.hoursLabel);
    setText("[data-hours]", restaurant.hours);
    setText("[data-phone-label]", restaurant.phoneLabel);
    setText("[data-location-label]", restaurant.locationLabel);
    setText("[data-address]", restaurant.address);
    setText("[data-intro]", restaurant.intro);
    setText("[data-help-title]", restaurant.helpTitle);
    setText("[data-help-text]", restaurant.helpText);

    document.querySelectorAll("[data-phone], [data-call-button]").forEach((link) => {
      link.href = phoneHref(restaurant.phone);
      if (link.hasAttribute("data-phone")) {
        link.textContent = restaurant.phone;
      }
    });

    document.querySelectorAll("[data-whatsapp-button]").forEach((link) => {
      const whatsappNumber = restaurant.whatsapp || restaurant.phone;
      link.href = whatsappHref(whatsappNumber, restaurant.whatsappMessage);
    });

    document.title = restaurant.name + " - Online Menu";
  }

  function renderCategories(categories) {
    const container = document.getElementById("menu-categories");
    if (!container) return;

    container.innerHTML = "";
    categories.forEach((category) => {
      const card = document.createElement("article");
      card.className = "menu-card" + (category.highlight ? " highlight" : "");
      card.id = category.id;

      const heading = document.createElement("div");
      heading.className = "card-heading";
      const icon = document.createElement("span");
      icon.className = "icon";
      icon.textContent = category.code || "MN";
      const title = document.createElement("h3");
      title.textContent = category.title || "Menu";
      heading.append(icon, title);

      const list = document.createElement("ul");
      list.className = "menu-list";
      (category.items || []).forEach((item) => {
        const row = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = item.name || "";
        const price = document.createElement("strong");
        price.textContent = item.price || "";
        row.append(name, price);
        list.appendChild(row);
      });

      card.append(heading, list);
      container.appendChild(card);
    });
  }

  function renderMenu() {
    const data = getMenuData();
    renderRestaurant(data.restaurant || {});
    renderCategories(data.categories || []);
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  window.ZamZamMenu = {
    storageKey: STORAGE_KEY,
    defaultData,
    getMenuData,
    renderMenu
  };

  renderMenu();
})();
