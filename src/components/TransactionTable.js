import React, { useState } from "react";
import "../styles/Transactions.css";
import moment from "moment";
import { formatDate, formatAmountDecimal } from "../utils/helpers.js";
import Auth from "../utils/auth.js";
import { GoPencil , GoTrash, GoDownload } from "react-icons/go";
import jsPDF from "jspdf";
import 'jspdf-autotable';

const TransactionTable = ({
  data,
  loading,
  deleteTransaction,
  transactions,
  setTransactions,
  setShowTransactionForm,
  setTransactionFormState,
}) => {
  const [sortOption, setSortOption] = useState("date");

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEditTransaction = (transaction) => {
    setTransactionFormState({
      date: moment(transaction.date).toISOString(),
      amount: transaction.amount,
      highLevelCategory: transaction.highLevelCategory,
      category: transaction.category,
      description: transaction.description,
      _id: transaction._id,
    });
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (e) => {
    e.preventDefault();
    const transactionId = e.currentTarget.id;
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteTransaction({
        variables: { transactionId },
      });

      if (!data) {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      console.error(err);
    }
    setTransactions(
      transactions.filter((transaction) => transaction._id !== transactionId)
    );
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("WellCome to your personalized expense Tracker app ",30,20)
    doc.text("Transaction Report", 14, 30);
    doc.setFontSize(12);
    doc.text(`User: ${Auth.getProfile().data.username}`, 14, 40); // Example: Username from Auth
    doc.text(`Email: ${Auth.getProfile().data.email}`, 14, 45); // Example: Email from Auth
    doc.text(`Date: ${moment().format('MMMM D, YYYY')}`, 14, 50);
    const tableColumn = ["Date", "Essential?", "Category", "Amount", "Description"];
    const tableRows = transactions.map(transaction => [
      formatDate(transaction.date),
      transaction.highLevelCategory,
      transaction.category,
      formatAmountDecimal(transaction.amount),
      transaction.description
    ]);
    doc.autoTable(tableColumn, tableRows, { startY: 60 });
    doc.save("transactions-report.pdf");
  };
  
  if (!transactions.length) {
    return <h3>No Transactions Recorded Yet</h3>;
  }

  let sortedTransactions = [...transactions];

  if (sortOption === "date") {
    sortedTransactions.sort((transactionA, transactionB) => {
      const dateA = new Date(parseInt(transactionA.date));
      const dateB = new Date(parseInt(transactionB.date));
      return dateB - dateA;
    });
  } else if (sortOption === "amount") {
    sortedTransactions.sort((transactionA, transactionB) => {
      return transactionB.amount - transactionA.amount;
    });
  } else if (sortOption === "category") {
    sortedTransactions.sort((transactionA, transactionB) => {
      return transactionA.category.localeCompare(transactionB.category);
    });
  }

  return (
    <div>
      <div className="form-group sort-div d-flex justify-content-center align-items-center">
        <label htmlFor="sort-option-select" className="sort mr-2">
          Sort By:
        </label>
        <select
          className="form-control form-select w-auto"
          id="sort-option-select"
          value={sortOption}
          onChange={handleSortOptionChange}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
        </select>
        <button className="btn btn-primary ml-3" onClick={generatePDF}>
          <GoDownload  /> Generate Report
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-light">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Essential?</th>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Description</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.highLevelCategory}</td>
                <td>{transaction.category}</td>
                <td>{formatAmountDecimal(transaction.amount)}</td>
                <td>{transaction.description}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    id={transaction._id}
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <GoPencil />
                  </button>
                  <button
                    className="btn btn-delete"
                    id={transaction._id}
                    onClick={handleDeleteTransaction}
                  >
                    <GoTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
