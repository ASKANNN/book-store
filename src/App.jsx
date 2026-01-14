import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadCatalog } from "./features/catalog/catalogThunks.js";
import { setCatalog } from "./features/catalog/catalogSlice.js";
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
                ? { ...book, flagOutOfStock: !book.flagOutOfStock }
                : book
        );
        dispatch(setCatalog(updated));
        localStorage.setItem("bookshop.catalog.v1", JSON.stringify(updated));

        const toggledBook = updated.find(book => book.isbn === isbn);
        if (!toggledBook.flagOutOfStock) {
            setSparkleId(isbn);
            setTimeout(() => setSparkleId(null), 3000);
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
                                    {book.flagOutOfStock ? "Mark Available" : "Mark Out of Stock"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
