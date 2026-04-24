import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {loadCatalog} from "./features/catalog/catalogThunks.js";
import {setCart} from "./features/cart/cartSlice.js";
import {readJson, writeJson} from "./storage/storageClient.js";
import {STORAGE_KEYS} from "./constants/storageKeys.js";
import "./App.css";

function App() {
    const dispatch = useDispatch();
    const catalog = useSelector((state) => state.catalog.items);
    const cart = useSelector((state) => state.cart.items);

    const [sparkleId, setSparkleId] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);


    useEffect(() => {
        dispatch(loadCatalog());
    }, [dispatch]);

    useEffect(() => {
        const savedCart = readJson(STORAGE_KEYS.CART);
        if (savedCart && typeof savedCart === "object") {
            dispatch(setCart(savedCart));
        }
    }, [dispatch]);

    const addBookToCart = (isbn) => {
        const newCart = {...cart};
        newCart[isbn] = (newCart[isbn] || 0) + 1;
        dispatch(setCart(newCart));
        writeJson(STORAGE_KEYS.CART, newCart);

        setSparkleId(isbn);
        setTimeout(() => setSparkleId(null), 500);
    };

    const removeBookFromCart = (isbn) => {
        const newCart = {...cart};
        delete newCart[isbn];
        dispatch(setCart(newCart));
        writeJson(STORAGE_KEYS.CART, newCart);
    };

    const changeQuantity = (isbn, delta) => {
        const newCart = {...cart};
        if (!newCart[isbn]) return;
        newCart[isbn] += delta;
        if (newCart[isbn] < 1) newCart[isbn] = 1;
        dispatch(setCart(newCart));
        writeJson(STORAGE_KEYS.CART, newCart);
    };

    const cartBooks = catalog.filter((book) => cart[book.isbn]);

    return (
        <div className="app-bg flex-center">
            <div className="overlay flex-col-center">
                <h1 className="app-title">Bookshop Catalog</h1>

                {catalog.length === 0 ? (
                    <p className="loading-text">Loading catalog...</p>
                ) : (
                    <div className="grid-container">
                        {catalog.map((book) => (
                            <div key={book.isbn} className={`card ${sparkleId === book.isbn ? "sparkle" : ""}`}>
                                {book.image && <img src={book.image} alt={book.title} className="card-img"/>}
                                <h2 className="card-title title-available">{book.title}</h2>
                                <p className="card-text">Author: {book.author}</p>
                                <p className="card-text">ISBN: {book.isbn}</p>
                                <p className="card-price">${book.price.toFixed(2)}</p>

                                <button
                                    onClick={() => addBookToCart(book.isbn)}
                                    className={`card-btn available-btn ${cart[book.isbn] ? "added" : ""}`}
                                    disabled={!!cart[book.isbn]} // если уже в корзине, блокируем кнопку
                                >
                                    {cart[book.isbn] ? "✔ Added" : "Add to Cart 🛒"}
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="cart-wrapper">
                <div className="cart-link" onClick={() => setCartOpen(!cartOpen)}>
                    <svg
                        className="icon icon-header-cart"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 2h2.27l.94 2.07 3.6 7.59-1.35 2.45C6.98 14.72 7.36 16 8.5 16H19v-2H8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.42 1.73-1.05l3.58-6.49A1 1 0 0 0 21 4H6.21l-.94-2.07A1 1 0 0 0 4.36 1H2zm6 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    </svg>
                    <div className={`cart-qty ${totalQty > 0 ? "cart-qty-active" : ""}`}>
                        {totalQty} </div>
                </div>
            </div>
            {cartOpen && (
                <div className="mini-cart">
                    <button className="close-cart" onClick={() => setCartOpen(false)}>✖</button>

                    {cartBooks.length === 0 ? (
                        <p style={{color: "#fff", textAlign: "center"}}>Cart is empty</p>
                    ) : (
                        <>
                            <div className="mini-cart-items">
                                {cartBooks.map((book) => (
                                    <div key={book.isbn} className="mini-cart-item">
                                        <img src={book.image} alt={book.title} className="mini-cart-img"/>
                                        <div className="mini-cart-info">
                                            <p>{book.title}</p>
                                            <p>${book.price.toFixed(2)}</p>

                                            <div className="quantity-controls">
                                                <button onClick={() => changeQuantity(book.isbn, -1)}>-</button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={cart[book.isbn]}
                                                    onChange={(e) => changeQuantity(book.isbn, Number(e.target.value) - cart[book.isbn])}
                                                    className="quantity-input"
                                                />
                                                <button onClick={() => changeQuantity(book.isbn, 1)}>+</button>
                                            </div>

                                        </div>
                                        <button className="remove-btn"
                                                onClick={() => removeBookFromCart(book.isbn)}>✖
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mini-cart-total">
                                Total:
                                ${cartBooks.reduce((sum, book) => sum + book.price * cart[book.isbn], 0).toFixed(2)}
                            </div>
                            <button className="checkout-btn" onClick={() => alert("Redirect to checkout!")}>
                                Proceed to Checkout 🛒
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
