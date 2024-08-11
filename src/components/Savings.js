import React, { useState } from "react";
import { formatAmount, calculateFutureValue } from "../utils/helpers";
import "../styles/Savings.css";

export default function Savings({ currentMonthHighLevel }) {
  function getNonEssential() {
    let highLevelArr = currentMonthHighLevel;
    for (let i = 0; i < highLevelArr.length; i++) {
      if (highLevelArr[i].highLevelCategory === "Non-Essential") {
        let nonEssentialSpending = Math.round(highLevelArr[i].amount);
        return nonEssentialSpending;
      }
    }
  }

  const [calculateFormState, setCalculateFormState] = useState({
    initialAmount: "",
    monthlyContribution: "",
    rate: "",
    frequency: "",
    years: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const nonEssentialSpending = getNonEssential();

  const PMT = formatAmount(Math.round(nonEssentialSpending * 0.1));

  const r = 5;
  const n = 12; //..i.e. monthly
  const t = 10;

  const savings = calculateFutureValue(0, PMT, r, n, t);

  function handleSubmit(e) {
    e.preventDefault();

    const { initialAmount, monthlyContribution, rate, frequency, years } =
      calculateFormState;
    const calculatedSavings = calculateFutureValue(
      initialAmount,
      monthlyContribution,
      rate,
      frequency,
      years
    );
    const result = formatAmount(calculatedSavings.toFixed(0));
    document.getElementById("result").innerHTML = `$${result}`;
    return result;
  }

  function handleChange(e) {
    setCalculateFormState({
      ...calculateFormState,
      [e.target.name]: e.target.value,
    });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const currentMonthYear = month + " " + year;

  return (
    <div className="savings-container">
      <div className="savings-info">
        <h2>Save More!</h2>
        <p>
          Your total spending for {currentMonthYear} is{" "}
          <span className="highlight">
            ${formatAmount(nonEssentialSpending)}
          </span>
          .
        </p>
        <p>
          If you were to save 10% of your expenses, that would be{" "}
          <span className="highlight">${formatAmount(PMT)}</span> per month.
        </p>
        <p>
          If you were to invest those savings at an average 5% return over 10
          years, compounded monthly, you would save{" "}
          <span className="highlight">${formatAmount(savings.toFixed(0))}</span>
        </p>
      </div>
      <div className="calculator">
        <h3 className="calculator-heading">Compound Interest Calculator</h3>
        <p>Find out how much you could save over the long term!</p>
        <form className="calculator-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="initialAmount">Initial Amount:</label>
            <input
              className="form-control"
              id="initialAmount"
              name="initialAmount"
              type="number"
              value={calculateFormState.initialAmount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="monthlyContribution">
              Monthly Contribution Amount:
            </label>
            <input
              className="form-control"
              id="monthlyContribution"
              name="monthlyContribution"
              type="number"
              value={calculateFormState.monthlyContribution}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rate">
              Annual Rate of Return (example: enter 5 for 5%):
            </label>
            <input
              className="form-control"
              id="rate"
              name="rate"
              type="number"
              value={calculateFormState.rate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="frequency">Compounding Frequency:</label>
            <select
              className="form-control"
              id="frequency"
              name="frequency"
              value={calculateFormState.frequency}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Frequency
              </option>
              <option value="1">Annually</option>
              <option value="2">Semi-Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="years">Investment Term (in years):</label>
            <input
              className="form-control"
              id="years"
              name="years"
              type="number"
              value={calculateFormState.years}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn calculate-btn">
            Calculate
          </button>
        </form>
      </div>
      <div className="result">
        You would save: <span id="result" className="highlight"></span>
      </div>
    </div>
  );
}
