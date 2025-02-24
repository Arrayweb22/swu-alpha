import { db } from "../../prisma/schema";

export default async function handler(req, res) {
  const { action } = req.query;

  if (action === "getUser") {
    // Fetch user data
    const user = await db.user.findUnique({ where: { id: req.user.id } });
    const transactions = await db.transaction.findMany({ where: { userId: req.user.id } });
    const notifications = await db.notification.findMany({ where: { userId: req.user.id } });

    return res.json({ user, balance: user.balance, transactions, notifications, isAdmin: user.isAdmin });
  }

  if (action === "sendMoney") {
    const { recipient, amount } = req.body;
    await db.transaction.create({ data: { senderId: req.user.id, receiverId: recipient, amount } });
    return res.json({ message: "Money sent!" });
  }

  if (action === "getAdminData" && req.user.isAdmin) {
    const loans = await db.loan.findMany({ where: { status: "pending" } });
    const reports = await db.report.findMany();
    return res.json({ loans, reports });
  }

  if (action === "manageLoan" && req.user.isAdmin) {
    const { loanId, action } = req.body;
    await db.loan.update({ where: { id: loanId }, data: { status: action === "approve" ? "approved" : "rejected" } });
    return res.json({ message: `Loan ${action}d!` });
  }

  if (action === "resolveReport" && req.user.isAdmin) {
    const { reportId } = req.body;
    await db.report.delete({ where: { id: reportId } });
    return res.json({ message: "Report resolved!" });
  }

  return res.status(400).json({ message: "Invalid request" });
}
