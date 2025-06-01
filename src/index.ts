import cors from "cors";
import express from "express";
import multer from "multer";
import { Item } from "./shared/types";
import { moveItem } from "./shared/helpers";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1000mb" }));
app.use(multer().any());

let items: Item[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Элемент ${i + 1}`,
  order: i + 1,
}));


app.get("/", (_, res) => {
  res.json({
    ok: 1,
  });
});

app.get("/list-default", (req, res) => {
  try {
    const { start = 0, limit = 20, search = "", sortOrder = "asc" } = req.query;

    let filteredItems = items.filter((item) =>
      item.name.includes(search as string)
    );

    filteredItems.sort((a, b) =>
      sortOrder === "asc" ? a.order - b.order : b.order - a.order
    );

    res.json({
      records: filteredItems.slice(Number(start), Number(start) + Number(limit)),
      totalRecords: filteredItems.length,
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/operation-sort", (req, res) => {
  try {
    const id = req.body.id as string;
    const toIndex = req.body.toIndex as string;
    const update = moveItem(items, Number(id), Number(toIndex));

    items = update;

    res.status(200).json({});
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => console.log("Сервер запущен на порту 3000"));
