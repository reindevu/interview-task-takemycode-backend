import { Item } from "../types";
import { fractionalOrder } from "./fractional-order";

export const moveItem = (items: Item[], itemId: number, newIndex: number) => {
    let updatedItems: Item[] = [...items];

    // Находим элемент
    const item = updatedItems.find(i => i.id === itemId);
    if (!item) {
        throw new Error("Элемент с таким id не найден");
    }

    // Удаляем элемент из массива
    updatedItems = updatedItems.filter(i => i.id !== itemId);

    // Проверяем, что newIndex находится в допустимых пределах
    if (newIndex < 0) {
        newIndex = 0;
    } else if (newIndex > updatedItems.length) {
        newIndex = updatedItems.length;
    }

    // Определяем соседние порядковые номера
    const prevOrder = newIndex > 0 ? updatedItems[newIndex - 1]?.order : null;
    const nextOrder = newIndex < updatedItems.length ? updatedItems[newIndex]?.order : null;

    // Вычисляем новый order
    item.order = fractionalOrder(prevOrder, nextOrder);

    // Вставляем элемент на новую позицию
    updatedItems.splice(newIndex, 0, item);

    // Сортируем
    updatedItems.sort((a, b) => a.order - b.order);

    return updatedItems;
}