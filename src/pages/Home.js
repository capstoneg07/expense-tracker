import React from "react";
import "../styles/Home.css";
import trend from "../images/trend.png";
import transactions from "../images/transactions.png";
import chart from "../images/chart-cat.png";
import calcform from "../images/calcform.png";

const Home = () => {
  return (
    <div className="home-body mb-5">
      <div className="text-center">
        <h1 className="home-title">Expense Tracker</h1>
        <p className="home-subtitle">
          Keep your finances in check and reach your financial goals
        </p>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
          <div className="card card-features">
            <div className="card-header card-header-features">
              Track Expenses
            </div>
            <div className="card-body">
              <img
                className="budget-image img-fluid"
                src={transactions}
                alt="Track Expenses"
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
          <div className="card card-features">
            <div className="card-header card-header-features">View Trends</div>
            <div className="card-body">
              <img
                className="budget-image img-fluid"
                src={trend}
                alt="View Trends"
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
          <div className="card card-features">
            <div className="card-header card-header-features">
              Chart Expenses
            </div>
            <div className="card-body">
              <img
                className="budget-image img-fluid"
                src={chart}
                alt="Chart Expenses"
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
          <div className="card card-features">
            <div className="card-header card-header-features">
              Calculate Savings
            </div>
            <div className="card-body">
              <img
                className="budget-image img-fluid"
                src={calcform}
                alt="Calculate Savings"
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="testimonials-title text-center mb-5 mt-5">
        User Testimonials
      </h2>

      <div className="container">
        <div className="row text-center d-flex justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card card-testimonials">
              <div className="card-body">
                <p className="card-text">
                  "I love using Expense Tracker! It's so easy to use and helps
                  me keep track of my spending."
                </p>
                <p className="card-text"><strong>- Sarah J.</strong></p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card card-testimonials">
              <div className="card-body">
                <p className="card-text">
                  "This app has been a game-changer for me. I've been able to
                  save more money and reach my financial goals faster."
                </p>
                <p className="card-text"><strong>- Michael T.</strong></p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card card-testimonials">
              <div className="card-body">
                <p className="card-text">
                  "Expense Tracker has helped me identify areas where I can cut
                  back and save more money. It's a must-have for anyone looking
                  to get their finances in order."
                </p>
                <p className="card-text"><strong>- John D.</strong></p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card card-testimonials">
              <div className="card-body">
                <p className="card-text">
                  "I've tried other budgeting apps, but Expense Tracker is by
                  far the best. It's intuitive, user-friendly, and has all the
                  features I need."
                </p>
                <p className="card-text"><strong>- Mary R.</strong></p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card card-testimonials">
              <div className="card-body">
                <p className="card-text">
                  "Expense Tracker has helped me identify my spending patterns
                  and make smarter financial decisions. I highly recommend it!"
                </p>
                <p className="card-text"><strong>- David L.</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
