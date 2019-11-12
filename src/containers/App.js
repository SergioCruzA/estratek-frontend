import React from 'react'

import Todo from '../components/Todo'
import { TodoProvider } from '../context/todo-context'

function App() {
  return (
   <>
    <TodoProvider>
      <Todo/>
    </TodoProvider>
   </>
  )
}

export default App;
