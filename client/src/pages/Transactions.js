import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_TRANSACTIONS } from "../utils/queries";
import { DELETE_TRANSACTION, ADD_TRANSACTION } from "../utils/mutations";
import TransactionForm from "../components/TransactionForm";
import moment from "moment";
import { Modal } from "react-bootstrap";
import TransactionTable from "../components/TransactionTable";
import Auth from "../utils/auth";
import styled from 'styled-components';
import "../styles/Transactions.css";

const TransactionsContainer = styled.div`
  padding: 2rem;
  background-color: #f4f6f8;
  min-height: 100vh;
`;

const Header = styled.h1`
  text-align: center;
  margin: 2rem 0;
  color: #4a90e2;
`;

const SpendingCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const SpendingCard = styled.div`
  flex: 1;
  margin: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 250px;
`;

const SpendingTitle = styled.h4`
  color: #333;
  margin-bottom: 1rem;
`;

const SpendingAmount = styled.p`
  color: #e74c3c;
  font-size: 1.25rem;
  font-weight: bold;
`;

const AddTransactionButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #357ab7;
  }
`;

const Transactions = ({ transactions, setTransactions }) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionFormState, setTransactionFormState] = useState({
    date: "",
    amount: "",
    highLevelCategory: "Income",
    category: "Salary",
    description: "",
  });

  const [startDate, setStartDate] = useState(
    moment().startOf("week").format("L")
  );

  const [endDate, setEndDate] = useState(moment().endOf("week").format("L"));

  const { data, loading, refetch } = useQuery(QUERY_ME);

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    update(cache, { data: { deleteTransaction } }) {
      try {
        const { transactions } = cache.readQuery({
          query: QUERY_TRANSACTIONS,
        }) ?? { transactions: [] };
  
        const updatedTransactions = transactions.filter(
          (transaction) => transaction._id !== deleteTransaction._id
        );
  
        cache.writeQuery({
          query: QUERY_TRANSACTIONS,
          data: { transactions: updatedTransactions },
        });
  
        const { me } = cache.readQuery({ query: QUERY_ME });
  
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              transactions: updatedTransactions,
            },
          },
        });
      } catch (e) {
        console.error("error with mutation!", e);
      }
      
      refetch();
    },
  });

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    update(cache, { data: { addTransaction } }) {
      try {
        const { transactions } = cache.readQuery({
          query: QUERY_TRANSACTIONS,
        }) ?? { transactions: [] };

        cache.writeQuery({
          query: QUERY_TRANSACTIONS,
          data: { transactions: [addTransaction, ...transactions] },
        });

        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: { 
              ...me, 
              transactions: [addTransaction, ...me.transactions ],
            },
          },
        });
      } catch (e) {
        console.error("error with mutation!", e);
      }
    },
    variables: {
      date: transactionFormState.date,
      amount: parseFloat(transactionFormState.amount),
      highLevelCategory: transactionFormState.highLevelCategory,
      category: transactionFormState.category,
      description: transactionFormState.description,
      username: Auth.getProfile().data.username,
    },
  });

  useEffect(() => {
    if (data?.me?.transactions) {
      setTransactions(data?.me?.transactions);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const transactionsData =
    data?.me.transactions.map((transaction) => ({
      ...transaction,
      date: moment.unix(transaction.date / 1000).format("MM/DD/YYYY"),
    })) || [];

  const currentDate = moment().format("L");
  const currentMonth = moment().format("M");

  const todaySpending = transactionsData
    .reduce((acc, transaction) => {
      if (moment(transaction.date).format("L") === currentDate) {
        return acc + transaction.amount;
      }
      return acc;
    }, 0)
    .toLocaleString("en-US", { style: "currency", currency: "CAD" });

  const currentWeekSpending = transactionsData
    .reduce((acc, transaction) => {
      const transactionDate = moment(transaction.date).format("L");
      if (transactionDate >= startDate && transactionDate <= endDate) {
        return acc + transaction.amount;
      }
      return acc;
    }, 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" });

  const currentMonthSpending = transactionsData
    .reduce((acc, transaction) => {
      if (moment(transaction.date).format("M") === currentMonth) {
        return acc + transaction.amount;
      }
      return acc;
    }, 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <TransactionsContainer>
      <Header>Welcome to your Expense Tracker!</Header>

      <SpendingCardContainer>
        <SpendingCard>
          <SpendingTitle>Spending for {currentDate}:</SpendingTitle>
          <SpendingAmount>{todaySpending}</SpendingAmount>
        </SpendingCard>

        <SpendingCard>
          <SpendingTitle>
            Expenditure for Current Week ({startDate} - {endDate}):
          </SpendingTitle>
          <SpendingAmount>{currentWeekSpending}</SpendingAmount>
        </SpendingCard>

        <SpendingCard>
          <SpendingTitle>Expenditure for Current Month:</SpendingTitle>
          <SpendingAmount>{currentMonthSpending}</SpendingAmount>
        </SpendingCard>
      </SpendingCardContainer>

      <AddTransactionButton
        onClick={() => setShowTransactionForm(!showTransactionForm)}
      >
        Add Transaction
      </AddTransactionButton>

      {showTransactionForm && (
        <Modal show={true} onHide={() => setShowTransactionForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {transactionFormState._id ? "Edit Transaction" : "Add Transaction"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TransactionForm
              setShowTransactionForm={setShowTransactionForm}
              addTransaction={addTransaction}
              transactions={transactions}
              setTransactions={setTransactions}
              transactionFormState={transactionFormState}
              setTransactionFormState={setTransactionFormState}
            />
          </Modal.Body>
        </Modal>
      )}

      <div className="mt-4 d-flex justify-content-center">
        <TransactionTable
          data={data}
          loading={loading}
          deleteTransaction={deleteTransaction}
          transactions={transactions}
          setTransactions={setTransactions}
          setShowTransactionForm={setShowTransactionForm}
          setTransactionFormState={setTransactionFormState}
        />
      </div>
    </TransactionsContainer>
  );
};

export default Transactions;
