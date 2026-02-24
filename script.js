
const hamburgerBtn = document.getElementById('hamburgerBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

if (hamburgerBtn && dropdownMenu) {

  /* Toggle menu when hamburger is clicked */
  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = dropdownMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });

  /* Close menu when user clicks anywhere else on the page */
  document.addEventListener('click', function () {
    dropdownMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });

  /* Prevent clicks inside dropdown from closing it */
  dropdownMenu.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}


/* =============================================
   LOCAL STORAGE HELPERS
   ============================================= */

/* Save students array as JSON string */
function saveToStorage(students) {
  localStorage.setItem('studentRecords', JSON.stringify(students));
}

/* Load students from localStorage, return [] if empty */
function loadFromStorage() {
  const data = localStorage.getItem('studentRecords');
  return data ? JSON.parse(data) : [];
}


function showToast(message) {
  var toast = document.getElementById('srsToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'srsToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  /* Auto-hide after 2.5 seconds */
  setTimeout(function () {
    toast.classList.remove('show');
  }, 2500);
}


/* Name: letters and spaces only */
function validateName(value) {
  if (!value.trim()) return 'Student name is required.';
  if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name must contain letters only.';
  return '';
}

/* Student ID: digits only */
function validateId(value) {
  if (!value.trim()) return 'Student ID is required.';
  if (!/^\d+$/.test(value.trim())) return 'Student ID must be numeric.';
  return '';
}

/* Email: standard format */
function validateEmail(value) {
  if (!value.trim()) return 'Email ID is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address.';
  return '';
}

/* Contact: digits only, min 10 digits */
function validateContact(value) {
  if (!value.trim()) return 'Contact number is required.';
  if (!/^\d+$/.test(value.trim())) return 'Contact must contain digits only.';
  if (value.trim().length < 10) return 'Contact must be at least 10 digits.';
  return '';
}

/* Mark input as error and show message */
function showError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.add('input-error');
}

/* Clear error state from input */
function clearError(input, errorEl) {
  errorEl.textContent = '';
  input.classList.remove('input-error');
}


const registrationForm = document.getElementById('registrationForm');

if (registrationForm) {

  /* Input fields */
  const nameInput = document.getElementById('studentName');
  const idInput = document.getElementById('studentId');
  const emailInput = document.getElementById('emailId');
  const contactInput = document.getElementById('contactNo');

  /* Error spans */
  const nameError = document.getElementById('nameError');
  const idError = document.getElementById('idError');
  const emailError = document.getElementById('emailError');
  const contactError = document.getElementById('contactError');

  /* Buttons */
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  let editIndex = -1;
  let students = loadFromStorage();

  /* Run all validations and return true if all pass */
  function validateAll() {
    const nMsg = validateName(nameInput.value);
    const iMsg = validateId(idInput.value);
    const eMsg = validateEmail(emailInput.value);
    const cMsg = validateContact(contactInput.value);

    nMsg ? showError(nameInput, nameError, nMsg) : clearError(nameInput, nameError);
    iMsg ? showError(idInput, idError, iMsg) : clearError(idInput, idError);
    eMsg ? showError(emailInput, emailError, eMsg) : clearError(emailInput, emailError);
    cMsg ? showError(contactInput, contactError, cMsg) : clearError(contactInput, contactError);

    return !nMsg && !iMsg && !eMsg && !cMsg;
  }

  /* Clear all form fields and errors */
  function clearForm() {
    nameInput.value = '';
    idInput.value = '';
    emailInput.value = '';
    contactInput.value = '';
    clearError(nameInput, nameError);
    clearError(idInput, idError);
    clearError(emailInput, emailError);
    clearError(contactInput, contactError);
  }

  /* Reset button: clears fields, exits edit mode */
  resetBtn.addEventListener('click', function () {
    clearForm();
    if (editIndex !== -1) {
      editIndex = -1;
      submitBtn.textContent = '+ Add';
      cancelBtn.style.display = 'none';
    }
  });

  /* Cancel edit button: exit edit mode, clear form */
  cancelBtn.addEventListener('click', function () {
    editIndex = -1;
    submitBtn.textContent = '+ Add';
    cancelBtn.style.display = 'none';
    clearForm();
  });

  /* Form submit: Add or Update */
  registrationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll()) return;

    const student = {
      name: nameInput.value.trim(),
      id: idInput.value.trim(),
      email: emailInput.value.trim(),
      contact: contactInput.value.trim(),
    };

    if (editIndex === -1) {
      /* ADD mode */
      students.push(student);
    } else {
      /* EDIT mode: update record at editIndex */
      students[editIndex] = student;
      editIndex = -1;
      submitBtn.textContent = '+ Add';
      cancelBtn.style.display = 'none';
    }

    saveToStorage(students);
    clearForm();

    /* Show a friendly toast notification */
    if (editIndex === -1) {
      showToast('Student record saved!');
    } else {
      showToast('Record updated successfully!');
    }
  });

  /* Live validation: clear errors as user types */
  nameInput.addEventListener('input', function () { clearError(nameInput, nameError); });
  idInput.addEventListener('input', function () { clearError(idInput, idError); });
  emailInput.addEventListener('input', function () { clearError(emailInput, emailError); });
  contactInput.addEventListener('input', function () { clearError(contactInput, contactError); });

  /* Check if user came back from records page to edit a record.
     We use sessionStorage to pass the edit index between pages. */
  var pendingEdit = sessionStorage.getItem('editIndex');
  if (pendingEdit !== null) {
    var idx = parseInt(pendingEdit);
    sessionStorage.removeItem('editIndex');

    if (students[idx]) {
      var s = students[idx];
      nameInput.value = s.name;
      idInput.value = s.id;
      emailInput.value = s.email;
      contactInput.value = s.contact;

      editIndex = idx;
      submitBtn.textContent = 'Update';
      cancelBtn.style.display = 'block';
    }
  }
}



const tableBody = document.getElementById('tableBody');

if (tableBody) {

  const tableWrapper = document.getElementById('tableWrapper');
  const emptyState = document.getElementById('emptyState');
  const recordCount = document.getElementById('recordCount');
  const recordsTable = document.getElementById('recordsTable');

  var students = loadFromStorage();

  /* Escape HTML to prevent XSS from user data */
  function escapeHTML(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* Render all students into the table */
  function renderTable() {
    tableBody.innerHTML = '';

    if (students.length === 0) {
      emptyState.style.display = 'block';
      recordsTable.style.display = 'none';
      recordCount.textContent = '0 students';
      tableWrapper.style.maxHeight = '';
      tableWrapper.style.overflowY = '';
      return;
    }

    emptyState.style.display = 'none';
    recordsTable.style.display = 'table';
    recordCount.textContent = students.length + ' student' + (students.length !== 1 ? 's' : '');

    students.forEach(function (student, index) {
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (index + 1) + '</td>' +
        '<td>' + escapeHTML(student.name) + '</td>' +
        '<td>' + escapeHTML(student.id) + '</td>' +
        '<td>' + escapeHTML(student.email) + '</td>' +
        '<td>' + escapeHTML(student.contact) + '</td>' +
        '<td>' +
        '<button class="btn-edit" onclick="handleEdit(' + index + ')" title="Edit">Edit</button>' +
        '<button class="btn-delete" onclick="handleDelete(' + index + ')" title="Delete">Delete</button>' +
        '</td>';
      tableBody.appendChild(row);
    });

    /* Dynamic vertical scrollbar */
    if (students.length > 5) {
      tableWrapper.style.maxHeight = '380px';
      tableWrapper.style.overflowY = 'auto';
    } else {
      tableWrapper.style.maxHeight = '';
      tableWrapper.style.overflowY = '';
    }
  }

  /*store index in sessionStorage and go to index.html */
  window.handleEdit = function (index) {
    sessionStorage.setItem('editIndex', index);
    window.location.href = 'index.html';
  };

  /* Delete */
  window.handleDelete = function (index) {
    var confirmed = confirm('Delete record for "' + students[index].name + '"?');
    if (!confirmed) return;
    students.splice(index, 1);
    saveToStorage(students);
    renderTable();
  };

  /* Render on page load */
  renderTable();
}
