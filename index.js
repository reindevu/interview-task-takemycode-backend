"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var import_multer = __toESM(require("multer"));

// src/shared/helpers/move-items.ts
var moveItem = (items2, movingId, targetId) => {
  const updatedItems = [...items2];
  const movingItem = updatedItems.find((i) => i.id === movingId);
  if (!movingItem) {
    throw new Error(`\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 id ${movingId} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D`);
  }
  const targetItem = updatedItems.find((i) => i.id === targetId);
  if (!targetItem) {
    throw new Error(`targetId=${targetId} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D`);
  }
  const itemsWithoutMoving = updatedItems.filter((i) => i.id !== movingId);
  let newOrder;
  if (movingItem.order > targetItem.order) {
    const sortedItems = itemsWithoutMoving.sort((a, b) => a.order - b.order);
    const targetIndex = sortedItems.findIndex((i) => i.id === targetId);
    if (targetIndex === 0) {
      newOrder = targetItem.order / 2;
    } else {
      const prevOrder = sortedItems[targetIndex - 1].order;
      newOrder = (prevOrder + targetItem.order) / 2;
    }
  } else if (movingItem.order < targetItem.order) {
    const sortedItems = itemsWithoutMoving.sort((a, b) => a.order - b.order);
    const targetIndex = sortedItems.findIndex((i) => i.id === targetId);
    if (targetIndex === sortedItems.length - 1) {
      newOrder = targetItem.order + 1;
    } else {
      const nextOrder = sortedItems[targetIndex + 1].order;
      newOrder = (targetItem.order + nextOrder) / 2;
    }
  } else {
    newOrder = targetItem.order;
  }
  movingItem.order = newOrder;
  const result = [...itemsWithoutMoving, movingItem].sort(
    (a, b) => a.order - b.order
  );
  return result;
};

// src/index.ts
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.use(import_express.default.json({ limit: "1000mb" }));
app.use((0, import_multer.default)().any());
var items = Array.from({ length: 1e6 }, (_, i) => ({
  id: i + 1,
  name: `\u042D\u043B\u0435\u043C\u0435\u043D\u0442 ${i + 1}`,
  order: i + 1
}));
var state = {
  list: items,
  sortOrder: "asc",
  checkedIds: []
};
app.get("/", (_, res) => {
  res.json({
    ok: 1
  });
});
app.get("/getList", (req, res) => {
  try {
    const { start = 0, limit = 20, search = "" } = req.query;
    let filteredItems = state.list.filter(
      (item) => item.name.includes(search)
    );
    filteredItems.sort(
      (a, b) => state.sortOrder === "asc" ? a.order - b.order : b.order - a.order
    );
    res.json({
      sortOrder: state.sortOrder,
      records: filteredItems.slice(
        Number(start),
        Number(start) + Number(limit)
      ),
      totalRecords: filteredItems.length
    });
  } catch (e) {
    console.log(e);
  }
});
app.get("/getListChecked", (_, res) => {
  try {
    res.json({ checkedIds: state.checkedIds });
  } catch (e) {
    console.log(e);
  }
});
app.get("/getSort", (_, res) => {
  try {
    res.json({ sortOrder: state.sortOrder });
  } catch (e) {
    console.log(e);
  }
});
app.post("/updateSortRow", (req, res) => {
  try {
    const { id, targetOrder } = req.body;
    const update = moveItem(state.list, Number(id), Number(targetOrder));
    state.list = update;
    res.status(200).json({});
  } catch (e) {
    console.log(e);
  }
});
app.post("/updateSortOrder", (req, res) => {
  try {
    const { sortOrder } = req.body;
    state.sortOrder = sortOrder;
    res.status(200).json({});
  } catch (e) {
    console.log(e);
  }
});
app.post("/checkRow", (req, res) => {
  try {
    const { id } = req.body;
    if (state.checkedIds.includes(id)) {
      state.checkedIds = state.checkedIds.filter((item) => item !== id);
    } else {
      state.checkedIds.push(id);
    }
    res.status(200).json({ checkedIds: state.checkedIds });
  } catch (e) {
    console.log(e);
  }
});
app.listen(3e3, () => console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D \u043D\u0430 \u043F\u043E\u0440\u0442\u0443 3000"));
