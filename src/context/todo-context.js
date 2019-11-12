import React from 'react'
import {useAsync} from 'react-async'
import axios from 'axios'

const backendUrl = 'http://localhost:3010/api/todos'

const TodoStateContext = React.createContext()
const TodoDispatchContext = React.createContext()

const todos = []

const initialState = {
  todos,
  itemsLeft: 0
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'list': {
      return action.list
    }
    case 'add': {
      debugger
      return {
        todos: [...state.todos, action.todo],
        itemsLeft: state.itemsLeft + 1
      }
    }
    case 'remove': {
      let value = 0
      return {
        todos: state.todos.filter(li => {
          if ((li.id === action.id) && !li.checked) value = value + 1
          return li.id !== action.id
        }),
        itemsLeft: state.itemsLeft - value
      }
    }
    case 'update': {
      return {
        todos: state.todos.map(li => {
          if (li.id === action.todo.id) {
            return {...li, ...action.todo}
          }
          return li
        }),
        itemsLeft: state.itemsLeft
      }
    }
    case 'check': {
      let value = 0
      return {
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            value = (todo.checked) ? 1 : -1
            todo.checked = !todo.checked;
          }
          return todo;   
        }),
        itemsLeft: state.itemsLeft + value
      }
    }
    case 'checkAll': {
      let value = 0
      return {
        todos: state.todos.map((todo) => {
          if (action.select) {
            todo.checked = true;
            value = 0
          } else {
            todo.checked = false;
            value = state.todos.length
          }
          return todo  
        }),
        itemsLeft: value
      }
    }
    case 'clear': {
      let value = 0
      return {
        todos: state.todos.filter(li => {
          if (!li.checked){
            value = value +1 
            return li
          }
        }),
        itemsLeft: state.itemsLeft
      }
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function getAllTodos({dispatch}) {
  return getTodos(dispatch)
}

function TodoProvider({children}) {
  const [state, dispatch] = React.useReducer(todoReducer, initialState)
  const {error, isRejected, isPending, isSettled} = useAsync({
    promiseFn: getAllTodos,
    dispatch,
  })
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  )
}

function useTodoDispatch() {
  const context = React.useContext(TodoDispatchContext)
  if (context === undefined) {
    throw new Error(`useTodoDispatch must be used within a TodoProvider`)
  }
  return context
}

function useTodoState() {
  const context = React.useContext(TodoStateContext)
  if (context === undefined) {
    throw new Error(`useTodoState must be used withi}n a TodoProvider`)
  }
  return context
}

function getTodos(dispatch, filterAction) {
  return axios.get(`${backendUrl}/`).then(resp => {
    let response = resp.data.todos
    switch (filterAction) {
      case 'active': {
        response = response.filter(li => !li.checked)
        break
      }
      case 'completed': {
        response = response.filter(li => li.checked)
        break
      }
      case 'all':
      case 'default': {
        response = resp.data.todos
        break
      }
    }
    const itemsLeft = response.reduce((accumulator, currenteValue)=>{
      if (!currenteValue.checked) return accumulator + 1
      return accumulator
    }, 0)
    dispatch({type: 'list', list: { todos: response, itemsLeft}})
  })
}

function addTodo(dispatch, text) {
  return axios.post(`${backendUrl}/`, { text }).then(resp => {
    dispatch({type: 'add', todo: resp.data})
  })
}

function removeTodo(dispatch, id) {
  return axios.delete(`${backendUrl}/${id}`).then(resp => {
    dispatch({type: 'remove', id: resp.data.id})
  })
}

function updateTodo(dispatch, id, dataToUpdate) {
  return axios.patch(`${backendUrl}/${id}`, dataToUpdate).then(resp => {
    debugger
    dispatch({type: 'update', todo: resp.data})
  })
}

function clearCompletedTodo(dispatch) {
  dispatch({type: 'clear'})
}

function checkTodo(dispatch, id) {
  dispatch({type: 'check', id})
}

function checkAll(dispatch, select) {
  dispatch({type: 'checkAll', select})
}

export {
  TodoProvider,
  useTodoState,
  useTodoDispatch,
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
  checkTodo,
  checkAll,
  clearCompletedTodo
}