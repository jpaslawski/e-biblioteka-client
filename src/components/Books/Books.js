import React, { Component } from 'react';
import axios from 'axios';
import './Books.css';
import { getUserPermissions } from '../../HelperMethods';
import { USER_PERMISSIONS } from '../../Constants';

class Books extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categoryName: undefined,
            bookName: undefined,
            bookAuthor: undefined,
            bookQuantity: undefined,
            bookImage: undefined,
            bookCategories: [],
            books: [],
            displayedBooks: [],
            selectedCategory: undefined,
            categories: [],
            chosenCategories: [],
            displayedCategories: [],
            isCategoryModalOpen: false,
            isBookModalOpen: false,
            errorMessage: undefined
        }

        this.addCategory = this.addCategory.bind(this);
        this.addBook = this.addBook.bind(this);

        this.addCategoryToBook = this.addCategoryToBook.bind(this);
        this.deleteCategoryFromBook = this.deleteCategoryFromBook.bind(this);
        this.setCategoryModalStatus = this.setCategoryModalStatus.bind(this);
        this.setBookModalStatus = this.setBookModalStatus.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleFilter(category) {
        let categoryFilter = this.state.chosenCategories;
        categoryFilter.includes(category) ? categoryFilter.pop(category) : categoryFilter.push(category);
        if (categoryFilter.length > 0) {
            this.setState({
                chosenCategories: categoryFilter,
                displayedBooks: this.state.books.filter((book) => {
                    return book.categories.find(({ name }) => categoryFilter.includes(name))
                })
            })
        } else {
            this.setState({
                displayedBooks: this.state.books
            })
        }
    }

    clearFilter() {
        this.setState({
            chosenCategories: [],
            displayedBooks: this.state.books
        })
    }

    setCategoryModalStatus(status) {
        this.setState({
            isCategoryModalOpen: status
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

    addCategory() {
        const newCategory = { name: this.state.categoryName }

        if (!this.state.categories.includes(this.state.categoryName)) {
            axios.post("/api/admin/categories", newCategory)
                .then(response => {
                    let updatedCategories = this.state.categories;
                    updatedCategories.push(this.state.categoryName);
                    this.setState({
                        categories: updatedCategories,
                        categoryName: undefined,
                        isCategoryModalOpen: false
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
        } else {
            this.setState({
                errorMessage: "Ta kategoria już istnieje."
            });
        }
    }

    addBook() {
        const newBook = {
            name: this.state.bookName,
            author: this.state.bookAuthor,
            image: this.state.bookImage,
            quantity: this.state.bookQuantity,
            categories: this.state.bookCategories
        }

        axios.post("/api/admin/books", newBook)
            .then(response => {
                let updatedBooks = this.state.books;
                updatedBooks.push(response.data);
                this.setState({
                    books: updatedBooks,
                    isBookModalOpen: false,
                    bookName: undefined,
                    bookAuthor: undefined,
                    bookImage: undefined,
                    bookQuantity: undefined,
                    bookCategories: []
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

    componentDidMount() {
        axios.get("/api/books")
            .then(response => {
                this.setState({
                    books: response.data,
                    displayedBooks: response.data
                })

                const params = new URLSearchParams(this.props.location.search);
                const category = params.get('category');
                if (category != null) this.handleFilter(category)
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

        // Form variables
        let { categoryName, bookName, bookAuthor, bookQuantity, bookImage, bookCategories } = this.state;

        // API response objects and modal handlers
        let { displayedBooks, categories, chosenCategories, displayedCategories, isCategoryModalOpen, isBookModalOpen, errorMessage } = this.state;

        const userPermissions = getUserPermissions();

        return (
            <div className="content">
                { isCategoryModalOpen && <div className="modal">
                    <div className="modal-container">
                        <i className=" fas fa-times" onClick={() => this.setCategoryModalStatus(false)}></i>
                        <div className="sign-form">
                            <h2>Dodanie nowej kategorii</h2>
                            <input name="categoryName" placeholder="NAZWA KATEGORII" onChange={this.handleOnChange} />
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <button disabled={!categoryName} onClick={this.addCategory}>Dodaj</button>
                        </div>
                    </div>
                </div>}
                { isBookModalOpen && <div className="modal">
                    <div className="modal-container">
                        <i className="fas fa-times" onClick={() => this.setBookModalStatus(false)}></i>
                        <div className="sign-form">
                            <h2>Dodanie nowej książki</h2>
                            <input name="bookName" placeholder="TYTUŁ KSIĄŻKI" onChange={this.handleOnChange} />
                            <input name="bookAuthor" placeholder="AUTOR" onChange={this.handleOnChange} />
                            <input name="bookImage" placeholder="OKŁADKA (URL)" onChange={this.handleOnChange} />
                            <input name="bookQuantity" placeholder="ILOŚĆ EGZEMPLARZY" onChange={this.handleOnChange} />
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
                </div>}
                <div className="filter">
                    <span>Kategorie:</span>
                    <div className="category-container">
                        {categories && categories.map((category) => (
                            <div className="category-item" key={category}>
                                <input type="checkbox" name={category} onChange={() => this.handleFilter(category)} checked={chosenCategories.includes(category)} />
                                <label htmlFor={category}>{category}</label>
                            </div>
                        ))}
                    </div>
                    <div className="button-group">
                        {(userPermissions === USER_PERMISSIONS.admin || userPermissions === USER_PERMISSIONS.librarian) &&
                            <button className="green" onClick={() => this.setCategoryModalStatus(!isCategoryModalOpen)}>Dodaj kategorię</button>}
                        <button onClick={() => this.clearFilter()}>Wyczyść</button>
                    </div>
                </div>
                <div className="card-container">
                    {(userPermissions === USER_PERMISSIONS.admin || userPermissions === USER_PERMISSIONS.librarian) &&
                        <div className="card add-book" onClick={() => this.setBookModalStatus(true)}>
                            <i className="far fa-plus-square"></i>
                            <div className="card-info">
                                <h3>Dodaj książkę</h3>
                            </div>
                        </div>
                    }
                    {displayedBooks && displayedBooks.map(({ id, name, author, image }) => (
                        <div key={id} className="card">
                            <a href={"/books/" + id}>
                                <img key={image} src={image} alt={name} />
                                <div className="card-info">
                                    <h3 key={name}>{name}</h3>
                                    <div key={author}>{author}</div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
                { displayedBooks.length === 0 && <div className="no-content">Nie znaleziono żadnych książek.</div>}
            </div>
        )
    }
}

export default Books;