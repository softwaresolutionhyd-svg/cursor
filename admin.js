(function () {
  const STORAGE_KEY = "zam-zam-menu-data-v1";
  const defaultData = window.ZAM_ZAM_MENU_DATA || { restaurant: {}, categories: [] };
  let state = readSavedData();

  const restaurantFields = [
    ["name", "Restaurant Name"],
    ["tagline", "Tagline"],
    ["heroText", "Hero Text"],
    ["intro", "Intro Text"],
    ["hoursLabel", "Hours Label"],
    ["hours", "Hours"],
    ["phoneLabel", "Phone Label"],
    ["phone", "Phone Number"],
    ["locationLabel", "Location Label"],
    ["address", "Address"],
    ["helpTitle", "Help Title"],
    ["helpText", "Help Text"]
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readSavedData() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : clone(defaultData);
    } catch (error) {
      return clone(defaultData);
    }
  }

  function slugify(value) {
    const slug = String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "category";
  }

  function setStatus(message) {
    document.getElementById("admin-status").textContent = message;
  }

  function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    if (options.className) element.className = options.className;
    if (options.text) element.textContent = options.text;
    if (options.type) element.type = options.type;
    if (options.value !== undefined) element.value = options.value;
    if (options.placeholder) element.placeholder = options.placeholder;
    if (options.dataset) {
      Object.entries(options.dataset).forEach(([key, value]) => {
        element.dataset[key] = value;
      });
    }
    return element;
  }

  function createField(labelText, value, dataset, multiline = false) {
    const label = createElement("label", { className: "field" });
    label.appendChild(createElement("span", { text: labelText }));

    const input = createElement(multiline ? "textarea" : "input", {
      value: value || "",
      dataset
    });
    if (!multiline) input.type = "text";

    label.appendChild(input);
    return label;
  }

  function renderRestaurantFields() {
    const container = document.getElementById("restaurant-fields");
    container.innerHTML = "";

    restaurantFields.forEach(([field, label]) => {
      const multiline = field === "heroText" || field === "intro" || field === "helpText";
      container.appendChild(
        createField(label, state.restaurant[field], { restaurantField: field }, multiline)
      );
    });
  }

  function renderCategoryEditor() {
    const container = document.getElementById("category-editor");
    container.innerHTML = "";

    state.categories.forEach((category, categoryIndex) => {
      const card = createElement("article", { className: "admin-category" });

      const top = createElement("div", { className: "admin-category-top" });
      const title = createElement("h3", {
        text: category.title || "New Category"
      });
      const removeButton = createElement("button", {
        className: "small-danger",
        text: "Delete Category",
        type: "button",
        dataset: { removeCategory: categoryIndex }
      });
      top.append(title, removeButton);

      const fields = createElement("div", { className: "form-grid" });
      fields.append(
        createField("Category Title", category.title, { categoryField: "title", categoryIndex }),
        createField("Short Code", category.code, { categoryField: "code", categoryIndex }),
        createField("Category ID", category.id, { categoryField: "id", categoryIndex })
      );

      const highlightLabel = createElement("label", { className: "check-field" });
      const highlight = createElement("input", {
        type: "checkbox",
        dataset: { categoryField: "highlight", categoryIndex }
      });
      highlight.checked = Boolean(category.highlight);
      highlightLabel.append(highlight, createElement("span", { text: "Highlight this category" }));

      const list = createElement("div", { className: "item-editor" });
      (category.items || []).forEach((item, itemIndex) => {
        const row = createElement("div", { className: "item-row" });
        row.append(
          createField("Item Name", item.name, { itemField: "name", categoryIndex, itemIndex }),
          createField("Price", item.price, { itemField: "price", categoryIndex, itemIndex }),
          createElement("button", {
            className: "small-danger",
            text: "Delete",
            type: "button",
            dataset: { removeItem: itemIndex, categoryIndex }
          })
        );
        list.appendChild(row);
      });

      const addItem = createElement("button", {
        className: "button secondary compact",
        text: "Add Item",
        type: "button",
        dataset: { addItem: categoryIndex }
      });

      card.append(top, fields, highlightLabel, list, addItem);
      container.appendChild(card);
    });
  }

  function syncStateFromInputs() {
    document.querySelectorAll("[data-restaurant-field]").forEach((input) => {
      state.restaurant[input.dataset.restaurantField] = input.value.trim();
    });

    document.querySelectorAll("[data-category-field]").forEach((input) => {
      const category = state.categories[Number(input.dataset.categoryIndex)];
      if (!category) return;
      const field = input.dataset.categoryField;
      if (field === "highlight") {
        category.highlight = input.checked;
      } else {
        category[field] = input.value.trim();
      }
    });

    document.querySelectorAll("[data-item-field]").forEach((input) => {
      const category = state.categories[Number(input.dataset.categoryIndex)];
      if (!category) return;
      const item = category.items[Number(input.dataset.itemIndex)];
      if (!item) return;
      item[input.dataset.itemField] = input.value.trim();
    });
  }

  function saveMenu() {
    syncStateFromInputs();
    state.categories.forEach((category) => {
      category.id = slugify(category.id || category.title);
      category.code = String(category.code || category.title || "MN").slice(0, 3).toUpperCase();
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setStatus("Saved. Ab View Menu open karein to isi browser mein updated menu nazar aayega.");
  }

  function downloadDataFile() {
    syncStateFromInputs();
    const source = "window.ZAM_ZAM_MENU_DATA = " + JSON.stringify(state, null, 2) + ";\\n";
    const blob = new Blob([source], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = createElement("a");
    link.href = url;
    link.download = "menu-data.js";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("menu-data.js downloaded. Is file ko hosting/repository mein replace kar dein.");
  }

  function bindEvents() {
    document.getElementById("save-menu").addEventListener("click", saveMenu);
    document.getElementById("download-data").addEventListener("click", downloadDataFile);

    document.getElementById("reset-default").addEventListener("click", () => {
      state = clone(defaultData);
      window.localStorage.removeItem(STORAGE_KEY);
      render();
      setStatus("Default menu restored in this browser.");
    });

    document.getElementById("add-category").addEventListener("click", () => {
      syncStateFromInputs();
      state.categories.push({
        id: "new-category",
        title: "New Category",
        code: "NEW",
        highlight: false,
        items: [{ name: "New Item", price: "Rs. 0" }]
      });
      renderCategoryEditor();
      setStatus("New category added. Save changes when ready.");
    });

    document.getElementById("category-editor").addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.addItem !== undefined) {
        syncStateFromInputs();
        const category = state.categories[Number(target.dataset.addItem)];
        category.items.push({ name: "New Item", price: "Rs. 0" });
        renderCategoryEditor();
        setStatus("New item added.");
      }

      if (target.dataset.removeItem !== undefined) {
        syncStateFromInputs();
        const category = state.categories[Number(target.dataset.categoryIndex)];
        category.items.splice(Number(target.dataset.removeItem), 1);
        renderCategoryEditor();
        setStatus("Item deleted.");
      }

      if (target.dataset.removeCategory !== undefined) {
        syncStateFromInputs();
        state.categories.splice(Number(target.dataset.removeCategory), 1);
        renderCategoryEditor();
        setStatus("Category deleted.");
      }
    });
  }

  function render() {
    renderRestaurantFields();
    renderCategoryEditor();
  }

  render();
  bindEvents();
})();
