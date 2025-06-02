import { Item } from "../types";

export const moveItem = (items: Item[], movingId: number, targetId: number) => {
  const updatedItems = [...items];

  const movingItem = updatedItems.find((i) => i.id === movingId);
  if (!movingItem) {
    throw new Error(`Элемент с id ${movingId} не найден`);
  }

  const targetItem = updatedItems.find((i) => i.id === targetId);

  if (!targetItem) {
    throw new Error(`targetId=${targetId} не найден`);
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
