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

// src/shared/helpers/fractional-order.ts
var fractionalOrder = (prev, next) => {
  if (prev === null && next === null) return 1;
  if (prev === null) return next / 2;
  if (next === null) return prev + 1;
  return (prev + next) / 2;
};

// src/shared/helpers/move-items.ts
var moveItem = (items2, itemId, newIndex) => {
  let updatedItems = [...items2];
  const item = updatedItems.find((i) => i.id === itemId);
  if (!item) {
    throw new Error("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0442\u0430\u043A\u0438\u043C id \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  }
  updatedItems = updatedItems.filter((i) => i.id !== itemId);
  if (newIndex < 0) {
    newIndex = 0;
  } else if (newIndex > updatedItems.length) {
    newIndex = updatedItems.length;
  }
  const prevOrder = newIndex > 0 ? updatedItems[newIndex - 1]?.order : null;
  const nextOrder = newIndex < updatedItems.length ? updatedItems[newIndex]?.order : null;
  item.order = fractionalOrder(prevOrder, nextOrder);
  updatedItems.splice(newIndex, 0, item);
  updatedItems.sort((a, b) => a.order - b.order);
  return updatedItems;
};

// src/index.ts
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.use(import_express.default.json({ limit: "1000mb" }));
app.use((0, import_multer.default)().any());
var items = Array.from({ length: 1e3 }, (_, i) => ({
  id: i,
  name: `\u042D\u043B\u0435\u043C\u0435\u043D\u0442 ${i + 1}`,
  order: i + 1
}));
app.get("/items", (req, res) => {
  const { start = 0, limit = 20, search = "", sortOrder = "asc" } = req.query;
  let filteredItems = items.filter(
    (item) => item.name.includes(search)
  );
  filteredItems.sort(
    (a, b) => sortOrder === "asc" ? a.order - b.order : b.order - a.order
  );
  res.json({
    items: filteredItems.slice(Number(start), Number(start) + Number(limit)),
    totalCount: filteredItems.length
  });
});
app.get("/", (_, res) => {
  res.json({
    ok: 1
  });
});
app.post("/sort-dnd", (req, res) => {
  const id = req.body.id;
  const toIndex = req.body.toIndex;
  const update = moveItem(items, Number(id), Number(toIndex));
  items = update;
  res.json({ update });
});
app.listen(3e3, () => console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D \u043D\u0430 \u043F\u043E\u0440\u0442\u0443 3001"));
