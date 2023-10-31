import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { authUser } from '../../api/userApi';
import TodoPage from '../../pages/TodoPage';

const Dashboard = (props) => {
    const [todo, setTodo] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(!props.user) {
            const token = localStorage.getItem('token');
            if(token) {
                authUser(token)
                .then(userData => {
                    props.sendUser(userData.data)
                })
                .catch(error => {
                    navigate('/');
                })
            } else {
                navigate('/');
            }
        } else {
            setTodo(true);
        }
    }, [props.user]);

    return (
        <>
            {todo ? <TodoPage /> : null}
        </>
    );
}

export default Dashboard;
