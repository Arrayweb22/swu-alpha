import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/api.js?action=getUser");
        setUser(res.data.user);
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
        setNotifications(res.data.notifications);
        setIsAdmin(res.data.isAdmin);
        if (res.data.isAdmin) {
          const adminData = await axios.get("/api/api.js?action=getAdminData");
          setLoanRequests(adminData.data.loans);
          setReports(adminData.data.reports);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name || "User"}!</h1>
      <h2>Balance: ${balance}</h2>

      {/* Send Money Form */}
      <button onClick={() => document.getElementById("sendMoneyForm").style.display = "block"}>
        Send Money
      </button>
      <div id="sendMoneyForm" style={{ display: "none" }}>
        <input type="text" placeholder="Recipient ID" id="recipient" />
        <input type="number" placeholder="Amount" id="amount" />
        <button onClick={sendMoney}>Send</button>
      </div>

      {/* Notifications */}
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>

      {/* Transaction History */}
      <h3>Transaction History</h3>
      <ul>
        {transactions.map((txn, index) => (
          <li key={index}>{txn.details} - ${txn.amount}</li>
        ))}
      </ul>

      {/* Admin Controls */}
      {isAdmin && (
        <div>
          <h2>Admin Panel</h2>

          {/* Loan Requests */}
          <h3>Loan Requests</h3>
          {loanRequests.map((loan) => (
            <div key={loan.id}>
              <p>User: {loan.userId}, Amount: ${loan.amount}</p>
              <button onClick={() => handleLoan(loan.id, "approve")}>Approve</button>
              <button onClick={() => handleLoan(loan.id, "reject")}>Reject</button>
            </div>
          ))}

          {/* Reports Management */}
          <h3>User Reports</h3>
          {reports.map((report) => (
            <div key={report.id}>
              <p>{report.issue}</p>
              <button onClick={() => handleReport(report.id)}>Resolve</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Functions
  async function sendMoney() {
    const recipient = document.getElementById("recipient").value;
    const amount = document.getElementById("amount").value;
    await axios.post("/api/api.js?action=sendMoney", { recipient, amount });
    alert("Money Sent!");
  }

  async function handleLoan(loanId, action) {
    await axios.post("/api/api.js?action=manageLoan", { loanId, action });
    alert(`Loan ${action}d!`);
  }

  async function handleReport(reportId) {
    await axios.post("/api/api.js?action=resolveReport", { reportId });
    alert("Report Resolved!");
  }
}
