// Reveal animations on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".animate-up").forEach(el => observer.observe(el));

// Form submission
document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("🎉 Thank you for registering! We’ll contact you soon.");
  this.reset();
});
document.getElementById("regForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  var options = {
    "key": "YOUR_RAZORPAY_KEY",
    "amount": 50, // in paise (₹500)
    "currency": "INR",
    "name": "LuMInA Fest",
    "description": "Event Registration",
    "handler": function (response){
        // Call backend API to save user data + payment success
        fetch("/api/save-registration", {
          method: "POST",
          body: new FormData(document.getElementById("regForm"))
        });
        alert("Payment Successful!");
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
});
const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.post("/api/save-registration", (req, res) => {
  const { name, roll, phone, email, branch, year, event } = req.body;
  const fileName = `data/${event}.xlsx`;

  let workbook, worksheet;

  if (fs.existsSync(fileName)) {
    workbook = XLSX.readFile(fileName);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
  }

  const data = XLSX.utils.sheet_to_json(worksheet);
  data.push({ Name: name, Roll: roll, Phone: phone, Email: email, Branch: branch, Year: year });

  const newSheet = XLSX.utils.json_to_sheet(data);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;

  XLSX.writeFile(workbook, fileName);

  res.send("Saved");
});

app.listen(3000, () => console.log("Server running..."));


