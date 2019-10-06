import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReportConsumer } from './ReportContext'

export default function FormDialog() {
  const [readyRevals, setReadyRevals] = useState({});

  const useStyles = makeStyles(theme => ({
    textField: {
      color: 'white',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    root: {
      backgroundColor: '#4e5366',
      overflow: 'auto',
      maxHeight: 300,
      margin: 'auto',
      marginTop: '5%',
      width: '60%',
      padding: '10px'
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    listItem: {
      color: 'white'
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  }));

  const handleTextChange = name => event => {
    const temp = readyRevals;
    temp[name] = event.target.value;
    setReadyRevals(temp);
  }

  const classes = useStyles();
  return (
    <ReportConsumer>
    { props => {
      const [_, __, ___, ____, revals, revalOpen, handleRevalClose, handleContinueReport] = props;
      return (
        <div>
          <Dialog open={revalOpen} onClose={handleRevalClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Re-evaulate the following stocks:</DialogTitle>
            <DialogContent>
              <List className={classes.root}>
                { revals.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText className={classes.listItem} primary={`${item}`} />
                    <TextField
                      margin="dense"
                      id={item + index}
                      type="number"
                      onChange={handleTextChange(item)}
                      value={revals[item]}
                      fullWidth
                    />
                  </ListItem>
                )) }
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleRevalClose} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleContinueReport(readyRevals)} color="secondary">
                Continue Report
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    }}
    </ReportConsumer>
  )
}