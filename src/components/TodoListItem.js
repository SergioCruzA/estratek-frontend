import React, { memo } from "react";
import {useAsync} from 'react-async'

import {
  ListItem,
  Checkbox,
  Input,
  IconButton,
  ListItemSecondaryAction
} from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import {makeStyles, StylesProvider} from '@material-ui/core/styles'

import {useTodoDispatch, removeTodo, checkTodo, updateTodo} from '../context/todo-context'

const useStyles = makeStyles(theme => ({
  checkedIcon: {
    color: '#2EDC67'
  },
}))

const submit = ([inputs], {dispatch}) => {
  return removeTodo(dispatch, inputs)
}

const submitChecked = ([inputs], {dispatch}) => {
  return checkTodo(dispatch, inputs)
}

const submitEdit = ([id, checked], {dispatch, todoItem}) => {
  debugger
  return updateTodo(dispatch, id, { text: todoItem, checked })
}

const TodoListItem = memo(props => {
  const [hover, setHover] = React.useState(false)
  const [todoItem, setTodoItem] = React.useState(props.text)
  const classes = useStyles();
  const dispatch = useTodoDispatch()

  const handleMouseEnter = () => setHover(true)
  const handleMouseLeave = () => setHover(false)

  const {run} = useAsync({
    deferFn: submit,
    dispatch,
  })

  const {run: runChecked} = useAsync({
    deferFn: submitChecked,
    dispatch,
  })

  const {run: runEdit} = useAsync({
    deferFn: submitEdit,
    dispatch,
    todoItem
  })

  const onDeleteClick = (id) => run(id)
  const onCheckBoxToggle = (id) => runChecked(id)

  const onItemChange = (e) =>{
    setTodoItem(e.target.value)
  }

  const onInputKeyPress = (id, checked) => runEdit(id, checked)

  return (
    <ListItem divider onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Checkbox
        onClick={()=> onCheckBoxToggle(props.id)}
        checked={props.checked}
        disableRipple
        icon={<CircleUnchecked fontSize="large" />}
        checkedIcon={<CircleChecked fontSize="large" className={classes.checkedIcon}/>}
      />
      <form onSubmit={()=> onInputKeyPress(props.id, props.checked)}>
      <Input disabled={props.disabled} fullWidth disableUnderline value={todoItem} onChange={onItemChange} style={{textDecoration: props.checked ? 'line-through' : 'none'}}/>
      </form>
      { hover && (
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={()=> onDeleteClick(props.id)}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
})

export default TodoListItem;
