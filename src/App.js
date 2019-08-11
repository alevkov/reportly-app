import React, { useState, useRef, useEffect } from "react";
import { ReportProvider } from './ReportContext';
import TxnDialog from './TxnDialog';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import uuid from "uuid";
import logo from './logo.svg';
import convertDateToSimpleFormat from './utils';
import './App.css';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
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

const useForceUpdate = () => useState()[1];

export default function App() {
  useEffect(() => console.log('mounted'), []);

  const [selectedDate, setSelectedDate] = useState(new Date('Jan 1 2017'));
  const [stocks, setStocks] = useState([]);
  const [txns, setTxns] = useState([]);
  const [sessionId, setSessionId] = useState(uuid.v4());
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const fileInput = useRef(null);
  const forceUpdate = useForceUpdate();
  const classes = useStyles();
  const dateFormat = 'MM/dd/yyyy';

  async function onSubmit(e) {
    e.preventDefault();

    if (fileInput.current.files.length === 0) {
      return;
    }

    if (stocks.length === 0) {
      const csv = await fileInput.current.files[0].text();
      const body = { csv: csv, boy: convertDateToSimpleFormat(selectedDate) };
      const response = await axios.post(`http://127.0.0.1:5000/load/${sessionId}`, body)

      setStocks(response.data.stocks);
    }
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  const handleTxnAdd = txn => {
    setTxns(txns.concat([txn]));
  }

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  async function handleRunReport() {
    const body = {
      'txin': txns
    };

    const response = await axios.post(`http://127.0.0.1:5000/txin/${sessionId}`, body)
    console.log(response);
  }

  function Header() {
    return (
      <header className="App-header">
        <h2>Welcome.</h2>
        <h4>Please upload your .csv to get started.</h4>
      </header>
    )
  }

  return (
    <ReportProvider value={[stocks, dialogOpen, handleDialogClose, handleTxnAdd]}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="App">
          <TxnDialog />
          <Header />
          <div className="initial">
            <form onSubmit={onSubmit}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format={dateFormat}
                id="date-picker-inline"
                label="Beginning of year"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <input
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                ref={fileInput}
                onChange={forceUpdate}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span" className={classes.button}>
                  Upload .csv
                </Button>
              </label>
              <Button variant="contained" color="primary" className={classes.button} type="submit">
                Add Txn
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleRunReport}>
                Run Report
              </Button>
            </form>
          <List className={classes.root}>
            { txns.map((item, index) => (
              <ListItem key={index}>
                <ListItemText className={classes.listItem} primary={`\u2630 ${item.type === 0 ? "Buy" : "Sell"} | ${item.name} | $${item.price} | ${item.amount}`} />
              </ListItem>
            )) }
          </List>
          </div>
        </div>
      </MuiPickersUtilsProvider>
    </ReportProvider>
  );
}
