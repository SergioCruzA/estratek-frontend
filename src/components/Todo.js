import React from 'react';

import AddTodo from './AddTodo'
import TodoList from './TodoList'

export default function Todo() {

  return (
    <div>
      <div align='center' style={{ padding: '80px', fontSize: 'xx-large'}}>
        TODOS
      </div>
      <TodoList />
    </div>
  )
}