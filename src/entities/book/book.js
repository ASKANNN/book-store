/**
 * @typedef {Object} Book
 * @property {string}title
 * @property {string}author
 * @property {string}isbn
 * @property {number}price
 * @property {boolean} flagOutOfStock
 * @property {string} image
 */

/**
 * @param {Book} book
 * @returns {Book}
 */

export function createBook(book) {
    return {
        title: String(book.title ?? "").trim(),
        author: String(book.author ?? "").trim(),
        isbn: String(book.isbn ?? "").trim(),
        price: Number(book.price),
        flagOutOfStock: Boolean(book.flagOutOfStock),
        image: String(book.image ?? ""),
    };
}