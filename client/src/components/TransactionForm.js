import React, {useEffect , useState, useRef } from "react";
import "../styles/Transactions.css";
import dollar from "../images/dollar.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import {UPDATE_TRANSACTION } from "../utils/mutations";

export default function TransactionForm({
  setShowTransactionForm,
  addTransaction,
  transactions,
  setTransactions,
  transactionFormState,
  setTransactionFormState
}) {
  
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const inputRef = useRef(null);

 useEffect(() => {
    if (transactionFormState.date) {
      setStartDate(new Date(transactionFormState.date));
    }
  }, [transactionFormState.date]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(transactionFormState);
    try {
      if (transactionFormState._id) {
        // If _id exists, update the transaction
        const { data } = await updateTransaction({
          variables: {
            transactionId: transactionFormState._id,
            date: transactionFormState.date,
            amount: parseFloat(transactionFormState.amount),
            highLevelCategory: transactionFormState.highLevelCategory,
            category: transactionFormState.category,
            description: transactionFormState.description,
          },
        });
        setTransactions(
          transactions.map((transaction) =>
            transaction._id === transactionFormState._id ? data.updateTransaction : transaction
          )
        );
      } else {
        // If _id does not exist, add a new transaction
        const { data } = await addTransaction({
          variables: {
            date: transactionFormState.date,
            amount: parseFloat(transactionFormState.amount),
            highLevelCategory: transactionFormState.highLevelCategory,
            category: transactionFormState.category,
            description: transactionFormState.description,
          },
        });

        setTransactions([...transactions, data.addTransaction]);
      }
      setTransactionFormState({
        date: "",
        amount: "",
        highLevelCategory: "",
        category: "",
        description: "",
      });
      setShowTransactionForm(false);
      // setTransactions([...transactions, data.addTransaction]);
    } catch (err) {
      console.error(err);
    }
  }

  // handles date selection
  function handleDateSelect(date) {
    setTransactionFormState({
      ...transactionFormState,
      date: date.toISOString(), // formats string MM/DD/YYYY, but 0 doesn't show, not sure how to apply the date formatting helper
    });
  }

  function handleChange(e) {
    if (!e.target.value.length) {
      setErrorMessage(`${e.target.name} is required`);
    } else {
      setErrorMessage("");
    }

    if (!errorMessage) {
      setTransactionFormState({
        ...transactionFormState,
        [e.target.name]: e.target.value,
      });
    }
  }

  // handles when user clicks in transaction date input field
  function handleInputClick() {
    setShowDatePicker(true); // sets date picker to true, so it displays
  }

  // when a user clicks outside of the input field / date picker component
  // only closes date picker if you focus on date input field and focus on another
  // if you click date picker and select another input field, it won't close it
  function handleInputBlur() {
    if (inputRef.current.contains(document.activeElement)) {
      return;
    }
    setShowDatePicker(false);
  }

  return (
    <>
      <div className="transaction-form">
        <div className="transaction-image">
          <img src={dollar} alt="logo pic" className="transaction-pic" />
        </div>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="date">Transaction Date</label>
            <div className="input-group">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  handleDateSelect(date);
                  setStartDate(date);
                }}
                dateFormat="yyyy-MM-dd" // Make sure the format matches the state
                className="form-control"
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  <FaCalendarAlt />
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Transaction Amount (CAD):</label>
            <input
              className="form-control"
              id="amount"
              name="amount"
              value={transactionFormState.amount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="highLevelCategory">Essential/Non-Essential:</label>
            <select
              className="form-control form-select"
              id="highLevelCategory"
              value={transactionFormState.highLevelCategory}
              onChange={handleChange}
              name="highLevelCategory"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Select a Category:</label>
            <select
              className="form-control form-select"
              id="category"
              value={transactionFormState.category}
              onChange={handleChange}
              name="category"
            >
              <option value="Salary">Salary</option>
              <option value="Tax return">Tax Return</option>
              <option value="Food-Groceries">Food-Groceries</option>
              <option value="Restaurant/Fast-Food">Restaurant/Fast-Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities - Gas, Electric, Water">
                Utilities - Gas, Electric, Water
              </option>
              <option value="Cable/Streaming Services">
                Cable/Streaming Services
              </option>
              <option value="Insurance">Insurance</option>
              <option value="Medical/Health">Medical/Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Vacations">Vacations</option>
              <option value="Charity">Charity</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Transaction Description:</label>
            <textarea
              name="description"
              className="form-control"
              id="description"
              rows="3"
              value={transactionFormState.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <Button variant="primary" type="submit">
              {transactionFormState._id ? "Update Transaction" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </div>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    </>
  );
}
