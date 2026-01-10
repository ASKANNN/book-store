import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {loadCatalog} from "./features/catalog/catalogThunks.js";
import {setCatalog} from "./features/catalog/catalogSlice.js";
import { saveCatalogToStorage } from "./features/catalog/catalogStorage.js";

import './App.css';

function App() {
    const dispatch = useDispatch();
    const catalog = useSelector((state) => state.catalog.items);
    const [sparkleId, setSparkleId] = useState(null);

    useEffect(() => {
        dispatch(loadCatalog());
    }, [dispatch]);

    const toggleStock = (isbn) => {
        const updated = catalog.map((book) =>
            book.isbn === isbn
                ? {...book, flagOutOfStock: !book.flagOutOfStock}
                : book
        );
        dispatch(setCatalog(updated));
        saveCatalogToStorage(updated);
        localStorage.setItem("bookshop.catalog.v1", JSON.stringify(updated));

        const toggledBook = updated.find(book => book.isbn === isbn);
        if (!toggledBook.flagOutOfStock) {
            setSparkleId(isbn);
            setTimeout(() => setSparkleId(null), 2000);
        }
    };

    return (
        <div className="app-bg flex-center">
            <div className="overlay flex-col-center">
                <h1 className="app-title">Bookshop Catalog</h1>

                {catalog.length === 0 ? (
                    <p className="loading-text">Loading catalog...</p>
                ) : (
                    <div className="grid-container">
                        {catalog.map((book) => (
                            <div
                                key={book.isbn}
                                className={`card ${sparkleId === book.isbn ? "sparkle" : ""}`}
                            >
                                {book.image && (
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="card-img"
                                    />
                                )}
                                <h2 className={`card-title ${book.flagOutOfStock ? "title-out" : "title-available"}`}>
                                    {book.title}
                                </h2>
                                <p className="card-text">Author: {book.author}</p>
                                <p className="card-text">ISBN: {book.isbn}</p>
                                <p className="card-price">${book.price.toFixed(2)}</p>
                                <p className={`card-status ${book.flagOutOfStock ? "out" : "available"}`}>
                                    {book.flagOutOfStock ? "Out of Stock" : "Available"}
                                </p>
                                <button
                                    onClick={() => toggleStock(book.isbn)}
                                    className={`card-btn ${book.flagOutOfStock ? "available-btn" : "out-btn"}`}
                                >
                                    {book.flagOutOfStock ? "Available" : "Out of Stock"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/*Проект Книжный магазин
    Сценарий:
    1. Каталог - хранится в LocalStorage
     при начальной загрузке - грузится из хранилища, если хранилище пустое, то грузится из js -JSON (10 книг)
     1.1. Книга содержит title, author, isbn, price, flagOutOfStock
     1.2. В каталоге нужно предусмотреть возможность добавлять / снимать книги из продажи с сохранением в LocalStorage
     1.3. При добавлении книги проверки.
     1.3.1. title, author, isbn, price не пустые
     1.3.2. title, author - String
     1.3.3. isbn - уникальный, String (consist between 10 - 12 symbols).
     1.3.4. price - Number, 99.99
     1.4. Снять книгу с продажи / вернуть книгу.
     1.4.1. isbn - ключ
     1.5. Обновлять price


     2. Корзина (Cart)
     Для формирования заказа из книг, присутствующих в каталоге и доступных к продаже
     2.1. Добавить из каталога книгу в корзину. Мин кол-во - 1.
     2.1.1. При добавлении книги с isbn из корзины мы увеличиваем количество
     2.2. Удалить книгу из корзины.
     2.3. Уменьшить количество. Если уменьшаем и = 0, то 2.2.
     2.4. Увеличение количества до 99.
     2.5. Очистить
     2.6. В результате - Общее кол-во книг по каждому isbn, price, totalUnIsbn, totalQty, totalPrice
     2.7. Пользователь может сделать заказ из корзины.
     2.7.1. Формируется заказ (см. 3)
     2.7.2. После формирования заказа корзина очищается.

     3. Заказ. (Order)
     3.1. Если все позиции доступны, то заказ отправляется (пока в LocalStorage).
     3.1.1. Недоступные позиции удаляются (с нотификацией)
     3.2. По результату 3.1 или 3.1.1 считаем заказ успешен
     3.3. Если заказ не отправляется - нотификация об ошибке.  */

export default App;
