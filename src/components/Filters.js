import React, { memo } from "react";
import {useAsync} from 'react-async'
import { Grid, Typography } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles'

import { useTodoDispatch, useTodoState, getTodos, clearCompletedTodo } from '../context/todo-context'

function submitFilter([action], {dispatch}) {
  return getTodos(dispatch, action)
}

function submitClear([], {dispatch}) {
  return clearCompletedTodo(dispatch)
}

const useStyles = makeStyles(theme => ({
  text: {
    fontSize: '12px',
    margin: 4
  },
}))


const FilterTodo = memo(props => {
  const classes = useStyles()
  const {todos, itemsLeft} = useTodoState()
  const dispatch = useTodoDispatch()

  const {run} = useAsync({
    deferFn: submitFilter,
    dispatch,
  })

  const {run: runClear} = useAsync({
    deferFn: submitClear,
    dispatch,
  })

  const onClickFilter = (action) => run(action)
  const onClickClear = () => runClear()

  return (
    <Grid container spacing={5}>
      <Grid xs={3} md={3} item>
        <Typography variant="h6" className={classes.text}>
          {`${itemsLeft} items left`}
        </Typography>
      </Grid>
      <Grid xs={5} md={5} item>
        <Grid container >
          <Typography variant="h6" className={classes.text} onClick={() => onClickFilter('all')}>
            {'All'}
          </Typography>
          <Typography variant="h6" className={classes.text} onClick={() => onClickFilter('active')}>
            {'Active'}
          </Typography>
          <Typography variant="h6" style={{border: "2px ridge"}} className={classes.text} onClick={() => onClickFilter('completed')}>
            {'Completed'}
          </Typography>
        </Grid>
      </Grid>
      <Grid xs={3} md={4} item>
        <Typography variant="h6" className={classes.text} onClick={() => { onClickClear()}}>
        {`clear completed (${(todos.length - itemsLeft)})`}
        </Typography>
      </Grid>
    </Grid>
  )
})

export default FilterTodo;
