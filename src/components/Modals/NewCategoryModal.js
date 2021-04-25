import { Component } from "react";
import axios from 'axios';
import { handleErrorResponse } from '../../HelperMethods';

class NewCategoryModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categoryName: undefined,
            errorMessage: undefined
        }

        this.addCategory = this.addCategory.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value,
            errorMessage: undefined
        })
    }

    addCategory() {
        const newCategory = { 
            name: this.state.categoryName 
        }

        if (!this.props.categories.includes(this.state.categoryName)) {
            axios.post("/api/library/categories", newCategory)
                .then(() => {

                    this.props.updateCategories(this.state.categoryName)

                    this.setState({
                        categoryName: undefined
                    })

                    this.props.setCategoryModalStatus(false)
                })
                .catch(error => {
                    this.setState({
                        errorMessage: handleErrorResponse(error.response)
                    })
                });
        } else {
            this.setState({
                errorMessage: "Ta kategoria już istnieje."
            });
        }
    }

    render() {

        let { categoryName, errorMessage } = this.state;

        return (
            <div className="modal">
                <div className="modal-container">
                    <i className=" fas fa-times" onClick={() => this.props.setCategoryModalStatus(false)}></i>
                    <div className="sign-form">
                        <h2>Dodanie nowej kategorii</h2>
                        <input type="text" name="categoryName" placeholder="NAZWA KATEGORII" autoComplete="off" onChange={this.handleOnChange} />
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button disabled={!categoryName} onClick={this.addCategory}>Dodaj</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default NewCategoryModal;