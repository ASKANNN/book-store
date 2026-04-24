import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, setCart } from "./features/cart/cartSlice.js";
import { readJson, writeJson } from "./storage/storageClient.js";
import { STORAGE_KEYS } from "./constants/storageKeys.js";
import { useEffect } from "react";

export default function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.items);
    const catalog = useSelector(state => state.catalog.items);

    useEffect(() => {
        const saved = readJson(STORAGE_KEYS.CART);
        if (Array.isArray(saved)) {
            dispatch(setCart(saved));
        }
    }, [dispatch]);

    const itemsInCart = catalog.filter(book =>
        cart.includes(book.isbn)
    );

    const total = itemsInCart.reduce(
        (sum, book) => sum + book.price,
        0
    );

    const removeItem = (isbn) => {
        const updated = cart.filter(id => id !== isbn);
        dispatch(removeFromCart(isbn));
        writeJson(STORAGE_KEYS.CART, updated);
    };

    return (
        <div className="app-bg flex-center">
            <div className="overlay flex-col-center">
                <h1 className="app-title">Your Cart 🛒</h1>

                {itemsInCart.length === 0 ? (
                    <p className="loading-text">Your cart is empty</p>
                ) : (
                    <>
                        <div className="grid-container">
                            {itemsInCart.map(book => (
                                <div key={book.isbn} className="card">
                                    <img src={book.image} alt={book.title} className="card-img" />
                                    <h2 className="card-title title-available">
                                        {book.title}
                                    </h2>
                                    <p className="card-price">${book.price.toFixed(2)}</p>

                                    <button
                                        className="card-btn out-btn"
                                        onClick={() => removeItem(book.isbn)}
                                    >
                                        Remove from Cart ❌
                                    </button>
                                </div>
                            ))}
                        </div>

                        <h2 style={{ color: "white", marginTop: "20px" }}>
                            Total: ${total.toFixed(2)}
                        </h2>
                    </>
                )}

                <a href="/" style={{ color: "cyan", marginTop: "20px" }}>
                    ← Back to catalog
                </a>
            </div>
        </div>
    );
}
