// ---------- Setup ----------
const fields = ["name", "matric", "email", "phone", "age", "department", "password"];
const form = document.querySelector("#form");
const rows = document.querySelector("#rows");

// The list of students lives in this array (an array of objects).
let students = [];

// ---------- Validation ----------
// Takes the form values and returns an object of errors, e.g. { email: "Enter a valid email." }
// If the object is empty, everything is valid.
function validate(data) {
  const errors = {};

  // Name: letters, spaces, dots, apostrophes and hyphens, at least 2 characters
  if (!/^[a-zA-Z .'-]{2,}$/.test(data.name)) {
    errors.name = "Enter a valid name (letters only).";
  }

  // Matric number: at least 4 characters
  if (data.matric.length < 4) {
    errors.matric = "Enter a valid matric number.";
  }

  // Email: something@something.something
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  // Phone: 8 to 15 digits, may start with +
  if (!/^\+?[0-9]{8,15}$/.test(data.phone.replace(/[ -]/g, ""))) {
    errors.phone = "Enter a valid phone number (8-15 digits).";
  }

  // Age: must be a whole number between 16 and 100
  const age = Number(data.age);
  if (data.age === "" || !Number.isInteger(age) || age < 16 || age > 100) {
    errors.age = "Age must be a whole number from 16 to 100.";
  }

  // Department: must pick one
  if (data.department === "") {
    errors.department = "Choose a department.";
  }

  // Password: 8+ characters, at least one letter and one number
  if (data.password.length < 8 || !/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)) {
    errors.password = "Use 8+ characters with a letter and a number.";
  }

  // Duplicate checks (only if that field has no other error already)
  const matricTaken = students.some(s => s.matric.toLowerCase() === data.matric.toLowerCase());
  if (!errors.matric && matricTaken) {
    errors.matric = "This matric number is already registered.";
  }
  const emailTaken = students.some(s => s.email.toLowerCase() === data.email.toLowerCase());
  if (!errors.email && emailTaken) {
    errors.email = "This email is already registered.";
  }

  return errors;
}

// ---------- Showing things on the page ----------
function showErrors(errors) {
  fields.forEach(field => {
    document.querySelector("#" + field + "Error").textContent = errors[field] || "";
    document.querySelector("#" + field).classList.toggle("invalid", Boolean(errors[field]));
  });
}

function renderTable() {
  rows.innerHTML = "";
  students.forEach(student => {
    const tr = document.createElement("tr");
    ["name", "matric", "email", "phone", "age", "department"].forEach(key => {
      const td = document.createElement("td");
      td.textContent = student[key];
      tr.appendChild(td);
    });
    rows.appendChild(tr);
  });
  document.querySelector("#count").textContent = students.length;
}

// ---------- Handling the form ----------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  // Collect every field's value into one object
  const data = {};
  fields.forEach(field => {
    data[field] = document.querySelector("#" + field).value.trim();
  });

  const errors = validate(data);
  showErrors(errors);
  const message = document.querySelector("#message");

  if (Object.keys(errors).length > 0) {
    message.textContent = "";
    return; // stop here, there are errors
  }

  // Save everything EXCEPT the password (never store passwords in plain text)
  delete data.password;
  students.push(data);
  renderTable();
  form.reset();
  message.textContent = "Registration successful!";
});

renderTable();
