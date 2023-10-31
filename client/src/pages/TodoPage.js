import React, {useState, useEffect} from 'react';
import TodoList from '../components/TodoList';
// import { getTasks, createTask, deleteTask } from '../api/taskApi';
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/TodoForm';
import { getTaskRequest, createTaskRequest, deleteTaskRequest, logOutRequest } from '../actions/actionCreator';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import QRCode from "react-qr-code";
import CONSTANTS from '../constants';

Modal.setAppElement('#root');

const TodoPage = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(props.user) {
            props.getTaskRequest();
        }
    }, [props.user]);

    const getNewTd = (data) => {
        props.createTaskRequest({
            status: 'new',
            ...data
        })
    }

    const delTask = (id) => {
        props.deleteTaskRequest(id);
    }

    const logOutHandler = () => {
        props.logOutRequest();
    }

    const switchIsModalOpen = () => {
        setIsModalOpen(!isModalOpen);
    }

    const generateLink = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        return `http://${CONSTANTS.IPv4_ADDRESS}:3000/authByQR?refresh=${refreshToken}`;
    }

    return (
        <div>
            <button onClick={logOutHandler}>LOG OUT</button>
            <h1>Todo List</h1>
            <button onClick={switchIsModalOpen}>Generate QR code to authenticate other devices</button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={switchIsModalOpen}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                    }
                }}
            >
                <h1>Scan this QR code for authenticate</h1>

                <div style={{ height: "auto", margin: "0 auto", maxWidth: 100, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={generateLink()}
                        viewBox={`0 0 256 256`}
                    />
                </div>

                <button onClick={switchIsModalOpen}>Close</button>
            </Modal>

            <TodoForm sendData={getNewTd} />
            <TodoList todos={props.tasks} delCallback={delTask} />
        </div>
    );
}

const mapStateToProps = (state) => (state);

const mapDispatchToProps = {
    getTaskRequest,
    createTaskRequest,
    deleteTaskRequest,
    logOutRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoPage);
