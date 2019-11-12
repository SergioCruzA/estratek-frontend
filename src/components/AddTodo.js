import React, { memo } from "react";
import {useAsync} from 'react-async'
import { TextField, Button, Grid, IconButton } from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";

import {useTodoDispatch, addTodo, checkAll} from '../context/todo-context'

const submit = ([text], {dispatch}) => {
  return addTodo(dispatch, text)
}

const submitSelectAll = ([inputs], {dispatch}) => {
  return checkAll(dispatch, inputs)
}

const AddTodo = memo(props => {
  const [inputValue, setInputValue] = React.useState('')
  const [select, setSelect] = React.useState(false)
  const dispatch = useTodoDispatch()

  const {run} = useAsync({
    deferFn: submit,
    dispatch,
  })

  const {run: runSelect} = useAsync({
    deferFn: submitSelectAll,
    dispatch,
  })
  const onInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const onInputKeyPress = (e) => {
    e.preventDefault()
    run(inputValue)
    setInputValue('')
  }

  const onButtonSelectClick = () => {
    setSelect(!select)
    runSelect(!select)
  }
  return (
    <Grid container >
      <Grid xs={2} md={2} item>
        <Button
          fullWidth
          color="secondary"
          onClick={onButtonSelectClick}
        >
          <IconButton aria-label="Delete Todo" size= "small">
            <ExpandMore />
          </IconButton>
        </Button>
      </Grid>
      <Grid xs={10} md={10} item >
        <form onSubmit={onInputKeyPress}>
          <TextField
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={onInputChange}
            // onKeyPress={onInputKeyPress}
            fullWidth
          />
        </form>
      </Grid>
    </Grid>
  )
})

export default AddTodo;
