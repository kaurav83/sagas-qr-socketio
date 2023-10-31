import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from './TodoItem.module.css';

const TodoItem = (props) => {
    const {item: {_id, body, deadline, status}} = props;
    const timeAgo = formatDistanceToNow(new Date(deadline), { addSuffix: true });
    
    return (
        <li className={styles.item}>
            <span>{body}</span>
            <span title={new Date(deadline).toLocaleDateString()}>{timeAgo}</span>
            <span>{status}</span>
            <button onClick={() => props.delete(_id)}>Delete</button>
        </li>
    );
}

export default TodoItem;
