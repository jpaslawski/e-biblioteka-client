import { Component } from "react";
import { handleErrorResponse } from '../../HelperMethods';
import axios from 'axios';

class NewBookModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayedCategories: this.props.categories,
            bookName: undefined,
            bookAuthor: undefined,
            bookQuantity: undefined,
            bookImage: undefined,
            bookCategories: [],
            errorMessage: undefined
        }

        this.addBook = this.addBook.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.addCategoryToBook = this.addCategoryToBook.bind(this);
        this.deleteCategoryFromBook = this.deleteCategoryFromBook.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value,
            errorMessage: undefined
        })
    }

    addBook() {
        const newBook = {
            name: this.state.bookName,
            author: this.state.bookAuthor,
            image: this.state.bookImage,
            quantity: this.state.bookQuantity,
            categories: this.state.bookCategories
        }

        axios.post("/api/library/books", newBook)
            .then(response => {
                this.props.updateBooks(response.data)

                this.setState({
                    bookName: undefined,
                    bookAuthor: undefined,
                    bookImage: undefined,
                    bookQuantity: undefined,
                    bookCategories: [],
                    displayedCategories: []
                })

                this.props.setBookModalStatus(false)
            })
            .catch(error => {
                this.setState({
                    errorMessage: handleErrorResponse(error.response)
                })
            });
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

    render() {

        let { bookName, bookAuthor, bookQuantity, bookImage, bookCategories, displayedCategories, errorMessage } = this.state;

        return (
            <div className="modal">
                <div className="modal-container">
                    <i className="fas fa-times" onClick={() => this.props.setBookModalStatus(false)}></i>
                    <div className="sign-form">
                        <h2>Dodanie nowej książki</h2>
                        <input type="text" name="bookName" placeholder="TYTUŁ KSIĄŻKI" autoComplete="off1" onChange={this.handleOnChange} />
                        <input type="text" name="bookAuthor" placeholder="AUTOR" autoComplete="off2" onChange={this.handleOnChange} />
                        <input type="text" name="bookImage" placeholder="OKŁADKA (URL)" autoComplete="off3" onChange={this.handleOnChange} />
                        <input type="number" name="bookQuantity" placeholder="ILOŚĆ EGZEMPLARZY" autoComplete="off4" onChange={this.handleOnChange} />
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
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button disabled={!bookName || !bookAuthor || !bookImage || !bookQuantity} onClick={this.addBook}>Dodaj</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewBookModal;