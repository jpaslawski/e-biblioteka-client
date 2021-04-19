import React, { Component } from 'react';
import axios from 'axios';
import './Books.css';
import { getUserPermissions, handleErrorResponse, sortAlphabetically } from '../../HelperMethods';
import { USER_PERMISSIONS } from '../../Constants';
import NewCategoryModal from '../Modals/NewCategoryModal';
import NewBookModal from '../Modals/NewBookModal';

class Books extends Component {

    constructor(props) {
        super(props);

        this.state = {
            books: [],
            displayedBooks: [],
            selectedCategory: undefined,
            categories: [],
            chosenCategories: [],
            isCategoryModalOpen: false,
            isBookModalOpen: false,
            errorMessage: undefined
        }

        this.updateBooks = this.updateBooks.bind(this);
        this.updateCategories = this.updateCategories.bind(this);

        this.setCategoryModalStatus = this.setCategoryModalStatus.bind(this);
        this.setBookModalStatus = this.setBookModalStatus.bind(this);
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

    updateBooks(newBook) {
        let updatedBooks = this.state.books;
        updatedBooks.push(newBook);

        this.setState({
            books: updatedBooks
        })
    }

    updateCategories(newCategory) {
        let updatedCategories = this.state.categories;
        updatedCategories.push(newCategory);

        this.setState({
            categories: sortAlphabetically(updatedCategories).slice(),
            displayedCategories: sortAlphabetically(updatedCategories).slice(),
        })
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
                this.setState({
                    errorMessage: handleErrorResponse(error.response)
                })
            });

        axios.get("/api/categories")
            .then(response => {
                let categorySet = response.data.map(({ name }) => name)

                this.setState({
                    categories: sortAlphabetically(categorySet).slice(),
                    displayedCategories: sortAlphabetically(categorySet).slice()
                })
            })
            .catch(error => {
                this.setState({
                    errorMessage: handleErrorResponse(error.response)
                })
            });
    }

    render() {

        let { displayedBooks, categories, chosenCategories, isCategoryModalOpen, isBookModalOpen } = this.state;

        const userPermissions = getUserPermissions();

        return (
            <div className="content">
                { isCategoryModalOpen && <NewCategoryModal 
                                            categories={ categories }
                                            setCategoryModalStatus={ this.setCategoryModalStatus }
                                            updateCategories={ this.updateCategories } /> }
                { isBookModalOpen && <NewBookModal
                                            categories={ categories }
                                            setBookModalStatus={ this.setBookModalStatus }
                                            updateBooks={ this.updateBooks } />}
                <div className="filter">
                    <span>Kategorie:</span>
                    <div className="filter-container">
                        {categories && categories.map((category) => (
                            <div className="filter-item" key={category}>
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