const MessageModal = ({ message, setModalStatus }) => {

    return (
        <div className="modal">
            <div className="modal-container">
                <i className=" fas fa-times" onClick={() => setModalStatus(false)}></i>
                <div>{message}</div>
            </div>
        </div>)
}

export default MessageModal;