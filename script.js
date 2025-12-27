const API_URL = 'http://localhost:3000/students';



async function getStudents() {
  try {
    const res = await fetch(API_URL);
    const students = await res.json();
    renderStudents(students);
  } catch (err) {
    console.error('Ошибка получения студентов', err);
  }
}

function renderStudents(students) {
  const tbody = document.querySelector('#students-table tbody');
  tbody.innerHTML = '';
  students.forEach(s => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.age}</td>
      <td>${s.course}</td>
      <td>${s.skills.join(', ')}</td>
      <td>${s.email}</td>
      <td>${s.isEnrolled ? 'Да' : 'Нет'}</td>
      <td>
        <button onclick="updateStudent(${s.id})">Обновить</button>
        <button onclick="deleteStudent(${s.id})">Удалить</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.querySelector('#name').value,
    age: Number(document.querySelector('#age').value),
    course: document.querySelector('#course').value,
    skills: document.querySelector('#skills').value.split(',').map(s => s.trim()),
    email: document.querySelector('#email').value,
    isEnrolled: document.querySelector('#isEnrolled').checked
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    });

    getStudents();
    document.querySelector('#add-student-form').reset();
  } catch (err) {
    console.error('Ошибка добавления студента', err);
  }
}


async function updateStudent(id) {
  const name = prompt('Введите новое имя:');
  if (!name) return;
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    getStudents();
  } catch (err) {
    console.error('Ошибка обновления студента', err);
  }
}


async function deleteStudent(id) {
  if (!confirm('Удалить студента?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    getStudents();
  } catch (err) {
    console.error('Ошибка удаления студента', err);
  }
}

document.querySelector('#get-students-btn').addEventListener('click', getStudents);
document.querySelector('#add-student-form').addEventListener('submit', addStudent);