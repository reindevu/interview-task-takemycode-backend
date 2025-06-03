import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppState } from "./shared/types";
import { moveItem } from "./shared/helpers";
import { z } from "zod";

const PORT = 3000;

const PaginationSchema = z.object({
  sortOrder: z.enum(["asc", "desc"]),
  start: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(1000).default(20),
  search: z.string().default(""),
});

const UpdateSortRowSchema = z.object({
  id: z.number().positive(),
  targetOrder: z.number().positive(),
});

const CheckRowSchema = z.object({
  id: z.number().positive(),
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "1000mb" }));
app.use(multer().any());

const initializeState = (): AppState => {
  return {
    list: Array.from({ length: 1000000 }, (_, i) => ({
    id: i + 1,
    name: `Элемент ${i + 1}`,
    order: i + 1,
  })),
  sortOrder: "asc",
  checkedIds: [],
  }
}

const state: AppState = initializeState();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

app.get(
  "/getList",
  asyncHandler((req: Request, res: Response) => {
    const validation = PaginationSchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { start, limit, search, sortOrder } = validation.data;

    state.sortOrder = sortOrder;

    let filteredItems = state.list.filter((item) =>
      item.name.includes(search as string)
    );

    filteredItems.sort((a, b) =>
      sortOrder === "asc" ? a.order - b.order : b.order - a.order
    );

    const paginatedItems = filteredItems.slice(start, start + limit);
    
    res.json({
      sortOrder: state.sortOrder,
      records: paginatedItems,
      totalRecords: filteredItems.length,
    });
  })
);

app.get(
  "/getListChecked",
  asyncHandler((_: Request, res: Response) => {
    res.json({ checkedIds: state.checkedIds });
  })
);

app.get(
  "/getSort",
  asyncHandler((_: Request, res: Response) => {
    res.json({ sortOrder: state.sortOrder });
  })
);


app.post(
  "/updateSortRow",
  asyncHandler(async (req: Request, res: Response) => {
    const validation = UpdateSortRowSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const parsedData = validation.data;
    const { id, targetOrder } = parsedData;

    state.list = moveItem(state.list, Number(id), Number(targetOrder));

    res.json({});
  })
);

app.post(
  "/checkRow",
  asyncHandler((req: Request, res: Response) => {
    const validation = CheckRowSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const parsedData = validation.data;
    const { id } = parsedData;

    if (state.checkedIds.includes(id)) {
      state.checkedIds = state.checkedIds.filter((item) => item !== id);
    } else {
      state.checkedIds.push(id);
    }

    res.status(200).json({ checkedIds: state.checkedIds });
  })
);

app.listen(PORT, () => console.log("Сервер запущен на порту 3000"));
