import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Books.css';
import { getUserPermissions, handleErrorResponse } from '../../HelperMethods';
import { USER_PERMISSIONS } from '../../Constants';
import MessageModal from '../Modals/MessageModal';

class BookDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookId: this.props.match.params.bookId,
            book: {},
            bookName: undefined,
            bookAuthor: undefined,
            bookImage: undefined,
            bookQuantity: undefined,
            bookCategories: [],
            availableCopies: undefined,
            isModalOpen: false,
            isBookModalOpen: false,
            message: undefined
        }

        // API call functions
        this.addReservation = this.addReservation.bind(this);
        this.updateBook = this.updateBook.bind(this);

        // Handlers
        this.addCategoryToBook = this.addCategoryToBook.bind(this);
        this.deleteCategoryFromBook = this.deleteCategoryFromBook.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.setModalStatus = this.setModalStatus.bind(this);
    }

    addReservation() {
        axios.post("/api/reservations/" + this.state.bookId)
            .then(response => {
                this.setState({
                    isModalOpen: true,
                    message: "Rezerwacja się powiodła! Masz 2 dni na odbiór książki."
                })
            })
            .catch(error => {
                this.setState({
                    isModalOpen: true,
                    message: handleErrorResponse(error.response)
                });
            });
    }

    updateBook() {
        const updatedBook = {
            name: this.state.bookName,
            author: this.state.bookAuthor,
            image: this.state.bookImage,
            quantity: this.state.bookQuantity,
            categories: this.state.bookCategories
        }

        axios.put("/api/library/books/" + this.state.bookId, updatedBook)
            .then(response => {
                const updatedBookData = response.data.book;
                this.setState({
                    book: updatedBookData,
                    bookName: updatedBookData.name,
                    bookAuthor: updatedBookData.author,
                    bookImage: updatedBookData.image,
                    bookQuantity: updatedBookData.quantity,
                    bookCategories: updatedBookData.categories.map(({ name }) => name),
                    availableCopies: response.data.availableCopies,
                    isBookModalOpen: false
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    errorMessage: handleErrorResponse(error.response)
                });
            });
    }

    setModalStatus(status) {
        this.setState({
            isModalOpen: status
        })
    }

    setBookModalStatus(status) {
        this.setState({
            isBookModalOpen: status
        })
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value,
            errorMessage: undefined
        })
    }

    addCategoryToBook(element) {
        const category = element.target.value;
        let { bookCategories, displayedCategories } = this.state;
        bookCategories.push(category);
        displayedCategories.splice(displayedCategories.indexOf(category), 1);

        this.setState({
            bookCategories: bookCategories,
            displayedCategories: displayedCategories
        })
    }

    deleteCategoryFromBook(category) {
        let { bookCategories, displayedCategories } = this.state;
        bookCategories.splice(bookCategories.indexOf(category), 1);
        displayedCategories.push(category);

        this.setState({
            bookCategories: bookCategories,
            displayedCategories: displayedCategories
        })
    }

    componentDidMount() {
        axios.get("/api/books/" + this.state.bookId)
            .then(response => {
                const bookData = response.data.book;
                this.setState({
                    book: bookData,
                    bookName: bookData.name,
                    bookAuthor: bookData.author,
                    bookImage: bookData.image,
                    bookQuantity: bookData.quantity,
                    bookCategories: bookData.categories.map(({ name }) => name),
                    availableCopies: response.data.availableCopies
                })
            })
            .catch(error => {
                this.setState({
                    isModalOpen: true,
                    message: handleErrorResponse(error.response)
                });
            });

        axios.get("/api/categories")
            .then(response => {
                let categorySet = response.data.map(({ name }) => name)
                categorySet = categorySet.sort(function (a, b) {
                    if (a < b) { return -1; }
                    if (a > b) { return 1; }
                    return 0;
                })

                this.setState({
                    categories: categorySet.slice(),
                    displayedCategories: categorySet.slice()
                })
            })
            .catch(error => {
                this.setState({
                    errorMessage: handleErrorResponse(error.response)
                });
            });
    }

    render() {

        // Objects and form variables
        let { book, bookName, bookAuthor, bookImage, bookQuantity, bookCategories, displayedCategories, availableCopies } = this.state;

        // Handlers and messages
        let { isModalOpen, isBookModalOpen, message } = this.state;

        const token = sessionStorage.getItem("token");
        const userPermissions = getUserPermissions();

        return (
            <div className="content">
                { isModalOpen && <MessageModal message={message} setModalStatus={this.setModalStatus} />}
                { isBookModalOpen && <div className="modal">
                    <div className="modal-container">
                        <i className="fas fa-times" onClick={() => this.setBookModalStatus(false)}></i>
                        <div className="sign-form">
                            <h2>Edycja danych książki</h2>
                            <input type="text" name="bookName" value={bookName} placeholder="TYTUŁ KSIĄŻKI" autoComplete="off1" onChange={this.handleOnChange} />
                            <input type="text" name="bookAuthor" value={bookAuthor} placeholder="AUTOR" autoComplete="off2" onChange={this.handleOnChange} />
                            <input type="text" name="bookImage" value={bookImage} placeholder="OKŁADKA (URL)" autoComplete="off3" onChange={this.handleOnChange} />
                            <input type="number" name="bookQuantity" value={bookQuantity} placeholder="ILOŚĆ EGZEMPLARZY" autoComplete="off4" onChange={this.handleOnChange} />
                            <div className="category-container">
                                {bookCategories !== [] && bookCategories.map((category) => (
                                    <div key={category} className="book-category" onClick={() => this.deleteCategoryFromBook(category)}>
                                        {category}<i className="fas fa-times-circle"></i>
                                    </div>
                                ))}
                            </div>

                            <select name="selectedCategory" selected="Wybierz kategorie:" onChange={this.addCategoryToBook}>
                                <option>Wybierz kategorie:</option>
                                {displayedCategories && displayedCategories.map((category) => (
                                    <option key={category}>{category}</option>
                                ))}
                            </select>
                            {message && <div className="error-message">{message}</div>}
                            <button disabled={!bookName || !bookAuthor || !bookImage || !bookQuantity} onClick={this.updateBook}>Zapisz</button>
                        </div>
                    </div>
                </div>}
                {Object.keys(book).length > 0 ? <div className="book-container">
                    <div className="book-image">
                        <img src={book.image} alt={book.name} />
                    </div>
                    <div className="book-info">
                        <h2>{book.name}</h2>
                        <div className="book-detail">{book.author}</div>
                        <div className="category-container">
                            {book.categories && book.categories.map(({ id, name }) => (
                                <div key={id} className="book-category" onClick={() => window.location.href = "/books?category=" + name}>{name}</div>
                            ))}
                        </div>
                        <div className="book-detail">Ilość dostępnych sztuk: { availableCopies }</div>
                        <div className="book-reservation">
                            {userPermissions === USER_PERMISSIONS.student &&
                                <button onClick={this.addReservation} disabled={token === null || availableCopies < 1}>Zarezerwuj</button>}
                            {(userPermissions === USER_PERMISSIONS.admin || userPermissions === USER_PERMISSIONS.librarian) &&
                                <button className="orange" onClick={() => this.setBookModalStatus(true)}>Edytuj dane książki</button>}
                            {!token && <div className="message">
                                Aby zarezerwować książkę, konieczne jest posiadanie konta w systemie. <Link to={{ pathname: "/sign-in", state: { prevPath: window.location.pathname } }} >Zaloguj się</Link> lub <a href="/sign-up">Załóż konto</a>.
                            </div>}
                        </div>
                    </div>
                </div>
                    :
                    <h2 style={{ "textAlign": "center" }}>Nie znaleziono książki.</h2>}
            </div>)

    }
}
export default BookDetails;