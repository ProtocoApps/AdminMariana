import { supabase } from './supabaseClient.js';

const $ = (id) => document.getElementById(id);

// Elements
const authView = $('authView');
const dashboardView = $('dashboardView');
const userEmailEl = $('userEmail');
const logoutBtn = $('logoutBtn');

// Forms
const loginForm = $('loginForm');
const signupForm = $('signupForm');
const addUserForm = $('addUserForm');

// Table and pagination
const usersTableBody = $('usersTableBody');
const searchUsers = $('searchUsers');
const filterRole = $('filterRole');
const prevPage = $('prevPage');
const nextPage = $('nextPage');
const pageInfo = $('pageInfo');

// Stats
const totalUsers = $('totalUsers');
const activeToday = $('activeToday');
const newThisWeek = $('newThisWeek');

// Toast
const toast = $('toast');

// State
let currentPage = 1;
let usersPerPage = 10;
let allUsers = [];
let filteredUsers = [];

// Toast notification
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Auth functions
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    showToast(error.message, 'error');
    return false;
  }
  
  return true;
}

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    showToast(error.message, 'error');
    return false;
  }
  
  showToast('Conta criada! Verifique seu email para confirmar.', 'success');
  return true;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    showToast(error.message, 'error');
  } else {
    showAuthView();
  }
}

// View management
function showAuthView() {
  authView.classList.remove('hidden');
  dashboardView.classList.add('hidden');
  userEmailEl.textContent = '';
  logoutBtn.classList.add('hidden');
}

function showDashboardView() {
  authView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  loadDashboard();
}

// User management
async function loadUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    allUsers = data || [];
    filterUsers();
  } catch (error) {
    showToast('Erro ao carregar usuários: ' + error.message, 'error');
  }
}

function filterUsers() {
  const searchTerm = searchUsers.value.toLowerCase();
  const roleFilter = filterRole.value;
  
  filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  
  currentPage = 1;
  renderUsers();
}

function renderUsers() {
  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const pageUsers = filteredUsers.slice(start, end);
  
  usersTableBody.innerHTML = pageUsers.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>
        <select class="role-select" data-user-id="${user.id}">
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </td>
      <td>${new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
      <td>${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'}</td>
      <td>
        <button class="btn btn-secondary" onclick="deleteUser('${user.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
  
  // Add event listeners to role selects
  document.querySelectorAll('.role-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const userId = e.target.dataset.userId;
      const newRole = e.target.value;
      await updateUserRole(userId, newRole);
    });
  });
  
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

async function updateUserRole(userId, role) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);
    
    if (error) throw error;
    
    showToast('Papel do usuário atualizado com sucesso', 'success');
    loadUsers();
  } catch (error) {
    showToast('Erro ao atualizar papel: ' + error.message, 'error');
  }
}

async function deleteUser(userId) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
  
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    
    showToast('Usuário excluído com sucesso', 'success');
    loadUsers();
  } catch (error) {
    showToast('Erro ao excluir usuário: ' + error.message, 'error');
  }
}

async function addUser(email, password, role) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    
    if (authError) throw authError;
    
    // Add to users table
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        role,
        created_at: new Date().toISOString(),
      });
    
    if (dbError) throw dbError;
    
    showToast('Usuário adicionado com sucesso', 'success');
    addUserForm.reset();
    loadUsers();
  } catch (error) {
    showToast('Erro ao adicionar usuário: ' + error.message, 'error');
  }
}

// Dashboard stats
async function loadDashboard() {
  await loadUsers();
  await loadStats();
}

async function loadStats() {
  try {
    // Total users
    const { count: total } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // Active today (users who signed in today)
    const today = new Date().toISOString().split('T')[0];
    const { count: active } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', today);
    
    // New this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: newUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());
    
    totalUsers.textContent = total || 0;
    activeToday.textContent = active || 0;
    newThisWeek.textContent = newUsers || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Event listeners
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (await signIn(email, password)) {
    const { data: { user } } = await supabase.auth.getUser();
    userEmailEl.textContent = user.email;
    showDashboardView();
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  await signUp(email, password);
});

addUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('newUserEmail').value;
  const password = document.getElementById('newUserPassword').value;
  const role = document.getElementById('newUserRole').value;
  
  await addUser(email, password, role);
});

logoutBtn.addEventListener('click', signOut);

searchUsers.addEventListener('input', filterUsers);
filterRole.addEventListener('change', filterUsers);

prevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderUsers();
  }
});

nextPage.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderUsers();
  }
});

// Check auth state on load
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    userEmailEl.textContent = session.user.email;
    showDashboardView();
  } else {
    showAuthView();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  showAuthView();
});
