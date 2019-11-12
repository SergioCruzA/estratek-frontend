import React, { memo } from "react";
import { List, Paper, ListItem } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles'

import TodoListItem from "./TodoListItem";
import AddTodo from "./AddTodo"
import FilterTodo from "./Filters"

import { useTodoState } from '../context/todo-context'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    margin: 'auto',
    maxWidth: 450,
  },
}))

const TodoList = memo(props => {
  const classes = useStyles();
  const {todos} = useTodoState()
  return (
    <>
        <Paper className={classes.paper}>
          <List >
            <ListItem>
              <AddTodo/>
            </ListItem>
            {todos.length > 0 && (
              <>
                {todos.map((todo) => (
                  <TodoListItem
                    {...todo}
                    key={`TodoItem.${todo.id}`}
                    disabled={todo.checked}
                  />))
                }
              </>
            )}
            <FilterTodo/>
          </List>
        </Paper>
    </>
  )
})

export default TodoList;