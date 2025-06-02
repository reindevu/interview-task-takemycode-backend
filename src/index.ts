import cors from "cors";
import express from "express";
import multer from "multer";
import { Item } from "./shared/types";
import { moveItem } from "./shared/helpers";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1000mb" }));
app.use(multer().any());

let items: Item[] = Array.from({ length: 1000000 }, (_, i) => ({
  id: i+1,
  name: `Элемент ${i + 1}`,
  order: i + 1,
}));

const state: {
  list: Item[];
  sortOrder: string;
  checkedIds: Set<number>
} = {
  list: items,
  sortOrder: "asc",
  checkedIds: new Set<number>([]),
};

app.get("/", (_, res) => {
  res.json({
    ok: 1,
  });
});

app.get("/getList", (req, res) => {
  try {
    const { start = 0, limit = 20, search = ""} = req.query;

    let filteredItems = state.list.filter((item) =>
      item.name.includes(search as string)
    );

    filteredItems.sort((a, b) =>
      state.sortOrder === "asc" ? a.order - b.order : b.order - a.order
    );

    res.json({
      sortOrder: state.sortOrder,
      records: filteredItems.slice(
        Number(start),
        Number(start) + Number(limit)
      ),
      totalRecords: filteredItems.length,
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/getListChecked", (_, res) => {
  try {
    res.json({ checkedIds: Array.from(state.checkedIds) });
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
})

app.post("/updateSortRow", (req, res) => {
  try {
    const {id, targetOrder} = req.body;

    const update = moveItem(state.list, Number(id), Number(targetOrder));
    state.list = update;
    
    res.status(200).json({});
  } catch (e) {
    console.log(e);
  }
});

app.post("/updateSortOrder", (req, res) => {
  try {
    const {sortOrder} = req.body;

    state.sortOrder = sortOrder;
  
    res.status(200).json({});
  } catch (e) {
    console.log(e);
  }
});

app.post("/checkRow", (req, res) => {
  try {
    const { id } = req.body as { id: number };

    state.checkedIds.has(id) ? state.checkedIds.delete(id) : state.checkedIds.add(id);

    res.status(200).json({ checkedIds: Array.from(state.checkedIds) });
  } catch (e) {
    console.log(e);
  }
});


app.listen(3000, () => console.log("Сервер запущен на порту 3000"));
