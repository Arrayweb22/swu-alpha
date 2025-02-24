export default function handler(req, res) {
  if (req.method === "GET") {
    // Handle Dashboard Data
    res.json({
      balance: 100.50,
      transactions: ["Sent $50 to Alice", "Received $20 from Bob"],
      notifications: ["Loan approved!", "New feature update!"],
    });
  } 
  
  else if (req.method === "POST") {
    const { type, amount } = req.body;

    if (type === "transaction") {
      res.json({ success: true, message: `Transaction of $${amount} completed!` });
    } 
    
    else if (type === "report") {
      res.json({ success: true, message: "Report submitted successfully!" });
    } 
    
    else {
      res.status(400).json({ success: false, error: "Invalid request type" });
    }
  } 
  
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
