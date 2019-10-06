import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'; 
import { ReportConsumer } from './ReportContext'
import Select from 'react-select';
import convertDateToSimpleFormat from './utils';

export default function FormDialog() {

  const [selectedStock, setSelectedStock] = useState({value: 'AAPL', label: 'e.g. AAPL'});
  const [selectedPrice, setSelectedPrice] = useState(0.0);
  const [selectedAmount, setSelectedAmount] = useState(0.0);
  const [selectedDate, setSelectedDate] = useState(new Date('Jan 1 2017'));
  const [value, setValue] = React.useState('buy');

  const dateFormat = 'MM/dd/yyyy';

  function handleRadioChange(event) {
    setValue(event.target.value);
  }

  const handleSelectChange = name => option => {
    switch (name) {
      case 'dialog.stock': {
        setSelectedStock(option);
        break;
      }
    }
  }

  const handleTextChange = name => event => {
    switch (name) {
      case 'dialog.amount': {
        setSelectedAmount(event.target.value);
        break;
      }
      case 'dialog.price': {
        setSelectedPrice(event.target.value);
        break;
      }
    }
  }

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  return (
    <ReportConsumer>
      { props => {
        const [stocks, open, handleClose, handleTxnAdd, _, __, ___, ____] = props;
        const stockOptions = stocks.map(s => {
          return { value: s, label: s };
        })
        return (
          <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add Transcation.</DialogTitle>
              <DialogContent>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="position" name="position" value={value} onChange={handleRadioChange} row>
                    <FormControlLabel
                      value="buy"
                      control={<Radio color="primary" />}
                      label="Buy"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="sell"
                      control={<Radio color="secondary" />}
                      label="Sell"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </FormControl>
                <Select 
                className='TxnDialog-stock-select'
                placeholder='Stock...'
                value={selectedStock}
                options={stockOptions}
                onChange={handleSelectChange('dialog.stock')} />
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Price"
                  type="number"
                  onChange={handleTextChange('dialog.price')}
                  value={selectedPrice}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Amount"
                  type="number"
                  onChange={handleTextChange('dialog.amount')}
                  value={selectedAmount}
                  fullWidth
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format={dateFormat}
                  id="txn-date-picker-inline"
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={() => { handleTxnAdd({
                    "name": selectedStock.value, 
                    "type": (value === 'buy' ? 0 : 1), 
                    "price": selectedPrice, 
                    "amount": selectedAmount, 
                    "ts": convertDateToSimpleFormat(selectedDate)
                  })}} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
      }}
    </ReportConsumer>
  );
}