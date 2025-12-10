// script.js
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

// Validation rules
const validators = {
  name: (value) => (value.trim() !== "" ? "" : "Name is required."),
  email: (value) =>
    /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(value.trim())
      ? ""
      : "Enter a valid email.",
  phone: (value) =>
    /^[0-9]{10}$/.test(value.trim())
      ? ""
      : "Enter a valid 10-digit phone number.",
  message: (value) => (value.trim() !== "" ? "" : "Message cannot be empty."),
};

// Live validation with visual cues
Object.keys(validators).forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    const error = validators[id](input.value);
    const errorMessage = input.nextElementSibling;

    if (error) {
      errorMessage.textContent = error;
      input.style.borderColor = "red";
    } else {
      errorMessage.textContent = "";
      input.style.borderColor = "green";
    }
  });
});

// On form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  successMessage.textContent = "";
  successMessage.classList.remove("fade-in");

  Object.keys(validators).forEach((id) => {
    const input = document.getElementById(id);
    const error = validators[id](input.value);
    const errorMessage = input.nextElementSibling;

    if (error) {
      errorMessage.textContent = error;
      input.style.borderColor = "red";
      input.classList.add("shake");

      // Remove shake class after animation ends
      setTimeout(() => input.classList.remove("shake"), 300);

      isValid = false;
    } else {
      errorMessage.textContent = "";
      input.style.borderColor = "green";
    }
  });

  if (isValid) {
    // Send data to Formspree
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          successMessage.textContent = "Form submitted successfully!";
          successMessage.classList.add("fade-in"); // trigger fade-in animation
          form.reset();

          // Reset borders after submission
          document.querySelectorAll("input, textarea").forEach((el) => {
            el.style.borderColor = "#ccc";
          });
        } else {
          successMessage.textContent = "Error submitting form.";
          successMessage.style.color = "red";
        }
      })
      .catch(() => {
        successMessage.textContent = "Submission failed. Please try again.";
        successMessage.style.color = "red";
      });
  }
});
