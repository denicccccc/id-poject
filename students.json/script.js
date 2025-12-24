const API_URL = 'http://localhost:3000/students';

const getBtn = document.getElementById('get-students-btn');
const tableBody = document.querySelector('#students-table tbody');
const form = document.getElementById('add-student-form');


async function getStudents() {
  try {
    const res = await fetch(API_URL);
    const students = await res.json();
    renderStudents(students);
  } catch (error) {
    console.error('Помилка GET:', error);
  }
}

function renderStudents(students) {
  tableBody.innerHTML = '';

  students.forEach(student => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
      <td>${student.skills.join(', ')}</td>
      <td>${student.email}</td>
      <td>${student.isEnrolled ? '✅' : '❌'}</td>
      <td>
        <button onclick="updateStudent(${student.id})">Оновити</button>
        <button onclick="deleteStudent(${student.id})">Видалити</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

async function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.getElementById('name').value,
    age: Number(document.getElementById('age').value),
    course: document.getElementById('course').value,
    skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
    email: document.getElementById('email').value,
    isEnrolled: document.getElementById('isEnrolled').checked
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    });

    form.reset();
    getStudents();
  } catch (error) {
    console.error('Помилка POST:', error);
  }
}


async function updateStudent(id) {
  const newName = prompt('Нове імʼя:');
  if (!newName) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });

    getStudents();
  } catch (error) {
    console.error('Помилка PATCH:', error);
  }
}


async function deleteStudent(id) {
  if (!confirm('Ви впевнені?')) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    getStudents();
  } catch (error) {
    console.error('Помилка DELETE:', error);
  }
}

getBtn.addEventListener('click', getStudents);
form.addEventListener('submit', addStudent);
