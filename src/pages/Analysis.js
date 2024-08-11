import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Chart, ArcElement } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import "../styles/Analysis.css";
import Savings from "../components/Savings";
import Dropdown from "../components/Dropdown";
import { formatAmount } from "../utils/helpers";

export default function Analysis({ transactions, setTransactions }) {
  const [selectedOption, setSelectedOption] = useState('CurrentMTD');

  Chart.register(ArcElement);
  const { data, loading } = useQuery(QUERY_ME);

  useEffect(() => {
    if (data?.me?.transactions) {
      setTransactions(data?.me?.transactions);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const priorMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const priorYear = currentYear - 1;

  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(parseInt(transaction.date));
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const currentMonthToDateSum = currentMonthTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const currentYearTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(parseInt(transaction.date));
    return transactionDate.getFullYear() === currentYear;
  });

  const currentYearToDateSum = currentYearTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const priorMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(parseInt(transaction.date));
    return transactionDate.getMonth() === priorMonth && transactionDate.getFullYear() === currentYear;
  });

  const priorMonthToDateSum = priorMonthTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const priorYearTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(parseInt(transaction.date));
    return transactionDate.getFullYear() === priorYear;
  });

  const priorYearToDateSum = priorYearTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  let selectedTransactions = [];
  let selectedTimePeriod = "";
  let selectedTotal;

  switch(selectedOption) {
    case "CurrentMTD":
      selectedTransactions = currentMonthTransactions;
      selectedTimePeriod = "Current Month to Date Spending";
      selectedTotal = currentMonthToDateSum;
      break;
    case "CurrentYTD":
      selectedTransactions = currentYearTransactions;
      selectedTimePeriod = "Current Year to Date Spending";
      selectedTotal = currentYearToDateSum;
      break;
    case "PriorMTD":
      selectedTransactions = priorMonthTransactions;
      selectedTimePeriod = "Prior Month to Date Spending";
      selectedTotal = priorMonthToDateSum;
      break;
    case "PriorYTD":
      selectedTransactions = priorYearTransactions;
      selectedTimePeriod = "Prior Year to Date Spending";
      selectedTotal = priorYearToDateSum;
      break;
    default:
      selectedTransactions = currentMonthTransactions;
      selectedTimePeriod = "Current Month to Date Spending";
      selectedTotal = currentMonthToDateSum;
  }

  const calcHighLevelCategory = (transactions) =>
    transactions.reduce((acc, cur) => {
      const { highLevelCategory, amount } = cur;
      const item = acc.find((it) => it.highLevelCategory === highLevelCategory);
      item ? (item.amount += amount) : acc.push({ highLevelCategory, amount });
      return acc;
    }, []);

  let sumHighLevel = calcHighLevelCategory(selectedTransactions);
  let currentMonthHighLevel = calcHighLevelCategory(currentMonthTransactions);

  const calcCategory = (transactions) =>
    transactions.reduce((acc, cur) => {
      const { category, amount } = cur;
      const item = acc.find((it) => it.category === category);
      item ? (item.amount += amount) : acc.push({ category, amount });
      return acc;
    }, []);

  let sumCategory = calcCategory(selectedTransactions);

  const categoryData = {
    labels: [
      "Salary",
      "Tax Return",
      "Food-Groceries",
      "Restaurant/Fast-Food",
      "Transportation",
      "Utilities - Gas, Electric, Water",
      "Cable/Streaming Services",
      "Insurance",
      "Medical/Health",
      "Entertainment",
      "Vacations",
      "Charity",
    ],
    datasets: [
      {
        label: "Amount by Category",
        data: [
          sumCategory.find((x) => x.category === "Salary")?.amount || 0,
          sumCategory.find((x) => x.category === "Tax return")?.amount || 0,
          sumCategory.find((x) => x.category === "Food-Groceries")?.amount || 0,
          sumCategory.find((x) => x.category === "Restaurant/Fast-Food")?.amount || 0,
          sumCategory.find((x) => x.category === "Transportation")?.amount || 0,
          sumCategory.find((x) => x.category === "Utilities - Gas, Electric, Water")?.amount || 0,
          sumCategory.find((x) => x.category === "Cable/Streaming Services")?.amount || 0,
          sumCategory.find((x) => x.category === "Insurance")?.amount || 0,
          sumCategory.find((x) => x.category === "Medical/Health")?.amount || 0,
          sumCategory.find((x) => x.category === "Entertainment")?.amount || 0,
          sumCategory.find((x) => x.category === "Vacations")?.amount || 0,
          sumCategory.find((x) => x.category === "Charity")?.amount || 0,
        ],
        backgroundColor: [
          "#4a90e2", "#50e3c2", "#ff7f50", "#87cefa", "#ffa07a", "#ffffff", "#9370db", "#ffd700", "#90ee90", "#4169e1", "#ff4500", "#32cd32", "#b22222"
        ],
        hoverOffset: 4,
      },
    ],
    options: {
      responsive: true,
    },
  };

  const highLevelCategoryData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Spending by Income/Expense",
        data: [
          sumHighLevel.find((x) => x.highLevelCategory === "Income")?.amount || 0,
          sumHighLevel.find((x) => x.highLevelCategory === "Expense")?.amount || 0,
        ],
        backgroundColor: ["#7583a7", "#FF4D4D"],
        hoverOffset: 4,
      },
    ],
    options: {
      responsive: true,
    },
  };

  return (
    <div className="analysis-container">
      <h1 className="charts-title">Your Spending Charts</h1>
      <Dropdown onOptionChange={handleOptionChange} />
      <div className="charts-row">
        <div className="chart-container">
          <div className="card card-chart">
            <div className="card-header card-chart-header">
              <h3 className="chart-title">{selectedTimePeriod}</h3>
              <h4>Total: ${formatAmount(selectedTotal)}</h4>
              <h3 className="chart-title">
                <span className="blue-text">Income</span> vs <span className="red-text">Expense</span>
              </h3>
            </div>
            <div className="card-body card-chart-body">
              <Pie
                className="chart"
                data={highLevelCategoryData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "black", wordWrap: true, maxWidth: 150 },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="card card-chart">
            <div className="card-header card-chart-header">
              <h3 className="chart-title">{selectedTimePeriod}</h3>
              <h4>Total: ${formatAmount(selectedTotal)}</h4>
              <h4 className="chart-title">by Category</h4>
            </div>
            <div className="card-body card-chart-body">
              <Pie
                className="chart"
                data={categoryData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "black", wordWrap: true, maxWidth: 150, fontSize: 10 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="savings-container">
          <Savings currentMonthHighLevel={currentMonthHighLevel} />
        </div>
      </div>
    </div>
  );
}
