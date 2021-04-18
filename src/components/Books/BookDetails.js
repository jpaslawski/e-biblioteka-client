import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Books.css';
import { getUserPermissions } from '../../HelperMethods';
import { USER_PERMISSIONS } from '../../Constants';

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
            isModalOpen: false,
            isBookModalOpen: false,
            message: undefined
        }

        this.addReservation = this.addReservation.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.setModalStatus = this.setModalStatus.bind(this);

        this.addCategoryToBook = this.addCategoryToBook.bind(this);
        this.deleteCategoryFromBook = this.deleteCategoryFromBook.bind(this);
    }

    addReservation() {
        axios.post("/api/reservations/" + this.state.bookId)
            .then(response => {
                this.setState({
                    isModalOpen: true,
                    message: "Rezerwacja się powiodła!\n Masz 2 dni na odbiór książki."
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isModalOpen: true,
                        message: "Network Error!"
                    });
                } else {
                    this.setState({
                        isModalOpen: true,
                        message: error.response.data.message
                    })
                }
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

        axios.put("/api/admin/books/" + this.state.bookId, updatedBook)
            .then(response => {
                const updatedBookData = response.data;
                this.setState({
                    book: updatedBookData,
                    bookName: updatedBookData.name,
                    bookAuthor: updatedBookData.author,
                    bookImage: updatedBookData.image,
                    bookQuantity: updatedBookData.quantity,
                    bookCategories: updatedBookData.categories.map(({ name }) => name),
                    isBookModalOpen: false
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        errorMessage: "Network Error!"
                    });
                } else {
                    this.setState({
                        errorMessage: error
                    });
                }
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
        let updatedBookCategories = this.state.bookCategories;
        updatedBookCategories.push(category);
        let updatedDisplayedCategories = this.state.displayedCategories;
        updatedDisplayedCategories.splice(updatedDisplayedCategories.indexOf(category), 1);

        this.setState({
            bookCategories: updatedBookCategories,
            displayedCategories: updatedDisplayedCategories
        })
    }

    deleteCategoryFromBook(category) {
        let updatedBookCategories = this.state.bookCategories;
        updatedBookCategories.splice(updatedBookCategories.indexOf(category), 1);
        let updatedDisplayedCategories = this.state.displayedCategories;
        updatedDisplayedCategories.push(category);

        this.setState({
            bookCategories: updatedBookCategories,
            displayedCategories: updatedDisplayedCategories
        })
    }

    componentDidMount() {
        axios.get("/api/books/" + this.state.bookId)
            .then(response => {
                const bookData = response.data;
                this.setState({
                    book: bookData,
                    bookName: bookData.name,
                    bookAuthor: bookData.author,
                    bookImage: bookData.image,
                    bookQuantity: bookData.quantity,
                    bookCategories: bookData.categories.map(({ name }) => name)
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isModalOpen: true,
                        message: "Network Error!"
                    });
                } else {
                    this.setState({
                        isModalOpen: true,
                        message: error.response.data.message
                    });
                }
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
                if (!error.response) {
                    this.setState({
                        errorMessage: "Network Error!"
                    });
                } else {
                    this.setState({
                        errorMessage: error
                    });
                }
            });
    }

    render() {

        // Objects and form variables
        let { book, bookName, bookAuthor, bookImage, bookQuantity, bookCategories, displayedCategories } = this.state;

        // Handlers and messages
        let { isModalOpen, isBookModalOpen, message } = this.state;

        const token = sessionStorage.getItem("token");
        const userPermissions = getUserPermissions();

        return (
            <div className="content">
                {isModalOpen && <div className="modal" id="filter">
                    <div className="modal-container">
                        <i className=" fas fa-times" onClick={() => this.setModalStatus(false)}></i>
                        <div>{message}</div>
                    </div>
                </div>}
                { isBookModalOpen && <div className="modal">
                    <div className="modal-container">
                        <i className="fas fa-times" onClick={() => this.setBookModalStatus(false)}></i>
                        <div className="sign-form">
                            <h2>Edycja danych książki</h2>
                            <input name="bookName" value={bookName} placeholder="TYTUŁ KSIĄŻKI" onChange={this.handleOnChange} />
                            <input name="bookAuthor" value={bookAuthor} placeholder="AUTOR" onChange={this.handleOnChange} />
                            <input name="bookImage" value={bookImage} placeholder="OKŁADKA (URL)" onChange={this.handleOnChange} />
                            <input name="bookQuantity" value={bookQuantity} placeholder="ILOŚĆ EGZEMPLARZY" onChange={this.handleOnChange} />
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
                <div className="book-container">
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
                        <div className="book-detail">Ilość dostępnych sztuk: {book.quantity}</div>
                        <div className="book-reservation">
                            <button onClick={this.addReservation} disabled={token === null || book.quantity < 1}>Zarezerwuj</button>
                            {(userPermissions === USER_PERMISSIONS.admin || userPermissions === USER_PERMISSIONS.librarian) &&
                                <button className="orange" onClick={() => this.setBookModalStatus(true)}>Edytuj dane książki</button>}
                            {!token && <div className="message">
                                Aby zarezerwować książkę, konieczne jest posiadanie konta w systemie. <Link to={{ pathname: "/sign-in", state: { prevPath: window.location.pathname } }} >Zaloguj się</Link> lub <a href="/sign-up">Załóż konto</a>.
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookDetails;