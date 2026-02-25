import { supabase } from './supabaseClient.js';

const $ = (id) => document.getElementById(id);

// Função para toggle dropdown
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  const trigger = dropdown.previousElementSibling;
  
  // Fecha outros dropdowns
  document.querySelectorAll('.dropdown-content').forEach(dd => {
    if (dd.id !== id) {
      dd.style.display = 'none';
      dd.previousElementSibling.classList.remove('active');
    }
  });
  
  // Abre/fecha o dropdown atual
  if (dropdown.style.display === 'none') {
    dropdown.style.display = 'block';
    trigger.classList.add('active');
  } else {
    dropdown.style.display = 'none';
    trigger.classList.remove('active');
  }
}

// Disponibiliza a função globalmente para uso com onclick
window.toggleDropdown = toggleDropdown;

// Fecha dropdowns ao clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-dropdown')) {
    document.querySelectorAll('.dropdown-content').forEach(dd => {
      dd.style.display = 'none';
      dd.previousElementSibling.classList.remove('active');
    });
  }
});

// Funcionalidade das abas de autenticação
document.addEventListener('DOMContentLoaded', () => {
  const authTabs = document.querySelectorAll('.auth-tab-simple');
  const formPanels = document.querySelectorAll('.form-panel-simple');
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Remove active de todas as abas e painéis
      authTabs.forEach(t => t.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));
      
      // Adiciona active na aba e painel correspondentes
      tab.classList.add('active');
      const targetPanel = document.getElementById(`${targetTab}Panel`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // Limpa mensagens ao trocar de aba
      const authMsg = $('authMsg');
      if (authMsg) {
        authMsg.textContent = '';
        authMsg.className = 'auth-message-simple';
      }
    });
  });
  
  // Validação de confirmação de senha
  const signupForm = $('signupForm');
  const confirmPassword = $('confirmPassword');
  
  if (signupForm && confirmPassword) {
    confirmPassword.addEventListener('input', () => {
      const password = $('signupPassword').value;
      if (confirmPassword.value && password !== confirmPassword.value) {
        confirmPassword.setCustomValidity('As senhas não coincidem');
      } else {
        confirmPassword.setCustomValidity('');
      }
    });
  }
  
  // Melhorias de UX para inputs com floating labels
  const inputs = document.querySelectorAll('.input-group input');
  inputs.forEach(input => {
    // Adiciona estado focused se já tiver valor
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });
});

const authView = $('authView');
const adminView = $('adminView');
const authMsg = $('authMsg');
const userEmailEl = $('userEmail');
const logoutBtn = $('logoutBtn');

// Navegação (sidebar)
const navButtons = document.querySelectorAll('.nav-item');
const tabAudios = $('tab-audios');
const tabTreinos = $('tab-treinos');
const tabHome = $('tab-home');
const tabProgramacao = $('tab-programacao');
const viewTitle = $('viewTitle');

// Áudios
const audioForm = $('audioForm');
const audioFormTitle = $('audioFormTitle');
const audioMsg = $('audioMsg');
const audiosTbody = $('audiosTbody');
const reloadAudios = $('reloadAudios');
const audioCancel = $('audioCancel');

// Treinos
const treinoForm = $('treinoForm');
const treinoFormTitle = $('treinoFormTitle');
const treinoMsg = $('treinoMsg');
const treinosTbody = $('treinosTbody');
const reloadTreinos = $('reloadTreinos');
const treinoCancel = $('treinoCancel');

const treinoCategoriaSelect = $('treinoCategoriaSelect');
const treinoCategoriaNovaWrap = $('treinoCategoriaNovaWrap');
const treinoCategoriaNova = $('treinoCategoriaNova');

// Home Cards
const homeCardForm = $('homeCardForm');
const homeCardFormTitle = $('homeCardFormTitle');
const homeMsg = $('homeMsg');
const homeCardsTbody = $('homeCardsTbody');
const reloadHomeCards = $('reloadHomeCards');
const homeCancel = $('homeCancel');

// Programação (Treinos)
const programacaoForm = $('programacaoForm');
const programacaoMsg = $('programacaoMsg');
const reloadProgramacao = $('reloadProgramacao');

const progSelects = [1, 2, 3, 4, 5, 6, 7].map((d) => ({
  dia: d,
  el: $(`prog-${d}`),
}));

function setMsg(el, text, isError = false) {
  if (!el) return;
  el.textContent = text || '';
  
  // Remove todas as classes de mensagem
  el.classList.remove('error', 'success');
  
  // Adiciona a classe apropriada se houver texto
  if (text) {
    el.classList.add(isError ? 'error' : 'success');
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// Categorias (Treinos)
let cachedTreinoCategorias = [];

function isNovaCategoriaSelected() {
  return treinoCategoriaSelect && treinoCategoriaSelect.value === '__NOVA__';
}

function setNovaCategoriaVisible(visible) {
  if (!treinoCategoriaNovaWrap) return;
  treinoCategoriaNovaWrap.classList.toggle('hidden', !visible);
  if (treinoCategoriaNova) {
    treinoCategoriaNova.required = Boolean(visible);
    if (!visible) treinoCategoriaNova.value = '';
  }
}

function getSelectedCategoriaValue() {
  if (!treinoCategoriaSelect) return '';
  if (isNovaCategoriaSelected()) return (treinoCategoriaNova?.value || '').trim();
  return (treinoCategoriaSelect.value || '').trim();
}

function fillCategoriaSelect(categories, selectedValue) {
  if (!treinoCategoriaSelect) {
    console.error('[fillCategoriaSelect] treinoCategoriaSelect não encontrado');
    return;
  }
  console.log('[fillCategoriaSelect] categories:', categories, 'selectedValue:', selectedValue);

  const normalized = (categories || [])
    .map((c) => String(c || '').trim())
    .filter(Boolean);

  const unique = Array.from(new Set(normalized)).sort((a, b) => a.localeCompare(b));
  cachedTreinoCategorias = unique;

  treinoCategoriaSelect.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Selecione uma categoria';
  treinoCategoriaSelect.appendChild(placeholder);

  for (const c of unique) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    treinoCategoriaSelect.appendChild(opt);
  }

  const nova = document.createElement('option');
  nova.value = '__NOVA__';
  nova.textContent = 'Nova categoria…';
  treinoCategoriaSelect.appendChild(nova);

  if (selectedValue && unique.includes(selectedValue)) {
    treinoCategoriaSelect.value = selectedValue;
    setNovaCategoriaVisible(false);
  } else if (selectedValue) {
    treinoCategoriaSelect.value = '__NOVA__';
    setNovaCategoriaVisible(true);
    if (treinoCategoriaNova) treinoCategoriaNova.value = selectedValue;
  } else {
    treinoCategoriaSelect.value = '';
    setNovaCategoriaVisible(false);
  }
  console.log('[fillCategoriaSelect] Dropdown preenchido. Opções:', treinoCategoriaSelect.options.length);
}

async function loadTreinoCategorias(selectedValue) {
  if (!treinoCategoriaSelect) {
    console.error('[loadTreinoCategorias] treinoCategoriaSelect não encontrado');
    return;
  }
  console.log('[loadTreinoCategorias] Carregando categorias…');
  const { data, error } = await supabase
    .from('videostreinos')
    .select('categoria')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[loadTreinoCategorias] Erro Supabase:', error);
    fillCategoriaSelect([], selectedValue);
    return;
  }

  const cats = (data || []).map((r) => r?.categoria);
  console.log('[loadTreinoCategorias] Categorias encontradas:', cats);
  fillCategoriaSelect(cats, selectedValue);
}

if (treinoCategoriaSelect) {
  treinoCategoriaSelect.addEventListener('change', () => {
    setNovaCategoriaVisible(isNovaCategoriaSelected());
  });
}

// CRUD - HOME CARDS
function resetHomeCardForm() {
  $('homeCardId').value = '';
  $('homeTitle').value = '';
  $('homeDesc').value = '';
  $('homeIcon').value = '';
  $('homeScreen').value = '';
  $('homeSortOrder').value = '0';
  $('homeIsActive').checked = true;
  homeCardFormTitle.textContent = 'Novo card';
  setMsg(homeMsg, '');
}

if (homeCancel) homeCancel.addEventListener('click', () => resetHomeCardForm());
if (reloadHomeCards) reloadHomeCards.addEventListener('click', () => loadHomeCards());

async function loadHomeCards() {
  if (!homeCardsTbody) return;
  setMsg(homeMsg, '');
  homeCardsTbody.innerHTML = '<tr><td colspan="6" class="muted">Carregando...</td></tr>';

  const { data, error } = await supabase
    .from('home_cards')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    homeCardsTbody.innerHTML = '';
    setMsg(homeMsg, error.message, true);
    return;
  }

  if (!data || data.length === 0) {
    homeCardsTbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhum card cadastrado.</td></tr>';
    return;
  }

  homeCardsTbody.innerHTML = data
    .map((c) => {
      const badge = c.is_active
        ? '<span class="badge on">Ativo</span>'
        : '<span class="badge off">Inativo</span>';

      return `
        <tr>
          <td>${escapeHtml(c.title)}</td>
          <td>${escapeHtml(c.screen)}</td>
          <td>${escapeHtml(c.icon)}</td>
          <td>${escapeHtml(c.sort_order)}</td>
          <td>${badge}</td>
          <td>
            <button class="btn btn-secondary" data-home-edit="${c.id}">Editar</button>
            <button class="btn btn-secondary" data-home-toggle="${c.id}" data-home-active="${c.is_active}">${c.is_active ? 'Desativar' : 'Ativar'}</button>
            <button class="btn btn-secondary" data-home-del="${c.id}">Excluir</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

if (homeCardForm) {
  homeCardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = $('homeCardId').value || null;
    const payload = {
      title: $('homeTitle').value.trim(),
      desc: $('homeDesc').value.trim(),
      icon: $('homeIcon').value.trim(),
      screen: $('homeScreen').value.trim(),
      sort_order: Number($('homeSortOrder').value || 0),
      is_active: Boolean($('homeIsActive').checked),
      updated_at: new Date().toISOString(),
    };

    setMsg(homeMsg, 'Salvando...');

    const query = id
      ? supabase.from('home_cards').update(payload).eq('id', id)
      : supabase.from('home_cards').insert([{ ...payload }]);

    const { error } = await query;
    if (error) {
      setMsg(homeMsg, error.message, true);
      return;
    }

    setMsg(homeMsg, 'Salvo!');
    resetHomeCardForm();
    await loadHomeCards();
  });
}

function showAuth() {
  authView.classList.remove('hidden');
  adminView.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  userEmailEl.textContent = '';
}

function showAdmin(email) {
  authView.classList.add('hidden');
  adminView.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  userEmailEl.textContent = email || '';
}

async function bootstrapSession() {
  const { data } = await supabase.auth.getSession();
  if (data?.session?.user) {
    showAdmin(data.session.user.email);
    await Promise.all([loadAudios(), loadTreinos(), loadHomeCards(), loadProgramacao()]);
  } else {
    showAuth();
  }
}

// AUTH
$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg(authMsg, 'Entrando...');

  const email = $('loginEmail').value.trim();
  const password = $('loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setMsg(authMsg, error.message, true);
    return;
  }

  setMsg(authMsg, 'OK!');
  await bootstrapSession();
});

$('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg(authMsg, 'Criando conta...');

  const email = $('signupEmail').value.trim();
  const password = $('signupPassword').value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    setMsg(authMsg, error.message, true);
    return;
  }

  setMsg(authMsg, 'Conta criada! Se o Supabase exigir confirmação por email, confirme e depois faça login.');
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  showAuth();
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    showAdmin(session.user.email);
    loadAudios();
    loadTreinos();
    loadHomeCards();
    loadProgramacao();
  } else {
    showAuth();
  }
});

// NAVEGAÇÃO
function setActiveView(viewName) {
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
  tabAudios.classList.toggle('hidden', viewName !== 'audios');
  tabTreinos.classList.toggle('hidden', viewName !== 'treinos');
  if (tabHome) tabHome.classList.toggle('hidden', viewName !== 'home');
  if (tabProgramacao) tabProgramacao.classList.toggle('hidden', viewName !== 'programacao');
  if (viewTitle) {
    viewTitle.textContent =
      viewName === 'treinos'
        ? 'Treinos'
        : viewName === 'home'
          ? 'Home (Cards)'
          : viewName === 'programacao'
            ? 'Programação (Treinos)'
            : 'Áudios';
  }
}

// PROGRAMAÇÃO (Treinos)
if (reloadProgramacao) reloadProgramacao.addEventListener('click', () => loadProgramacao());

function buildTreinoOptionLabel(treino) {
  const parts = [treino.titulo];
  if (treino.nivel) parts.push(treino.nivel);
  if (treino.categoria) parts.push(treino.categoria);
  return parts.join(' • ');
}

function fillSelectOptions(selectEl, treinos) {
  if (!selectEl) return;
  const current = selectEl.value;
  selectEl.innerHTML = '';

  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = '— nenhum —';
  selectEl.appendChild(empty);

  console.log('[fillSelectOptions] Treinos para preencher:', treinos);
  console.log('[fillSelectOptions] Select element:', selectEl);

  for (const t of treinos) {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = buildTreinoOptionLabel(t);
    selectEl.appendChild(opt);
    console.log('[fillSelectOptions] Adicionada opção:', opt.textContent);
  }

  console.log('[fillSelectOptions] Total de opções:', selectEl.options.length);

  if (current) selectEl.value = current;
}

async function loadProgramacao() {
  if (!programacaoForm) return;

  setMsg(programacaoMsg, 'Carregando...');

  // 1) carregar treinos
  const { data: treinos, error: treinosError } = await supabase
    .from('treinos')
    .select('id, titulo, categoria, nivel, duracao')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (treinosError) {
    setMsg(programacaoMsg, treinosError.message, true);
    return;
  }

  // preencher selects usando função original
  for (const s of progSelects) {
    if (!s.el) continue;
    fillSelectOptions(s.el, treinos);
  }

  // 2) carregar programação atual
  const { data: progRows, error: progError } = await supabase
    .from('treinos_programacao')
    .select('dia_semana, treino_id, is_active')
    .eq('is_active', true);

  if (progError) {
    setMsg(programacaoMsg, progError.message, true);
    return;
  }

  // selecionar múltiplos treinos por dia
  const treinosPorDia = new Map();
  progRows.forEach(row => {
    if (!treinosPorDia.has(row.dia_semana)) {
      treinosPorDia.set(row.dia_semana, []);
    }
    treinosPorDia.get(row.dia_semana).push(row.treino_id);
  });

  for (const s of progSelects) {
    if (!s.el) continue;
    const treinosDoDia = treinosPorDia.get(s.dia) || [];
    
    // limpar seleção atual
    Array.from(s.el.options).forEach(opt => opt.selected = false);
    
    // selecionar todos os treinos do dia
    treinosDoDia.forEach(treinoId => {
      const option = Array.from(s.el.options).find(opt => opt.value === String(treinoId));
      if (option) option.selected = true;
    });
  }

  setMsg(programacaoMsg, '');
}

if (programacaoForm) {
  programacaoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMsg(programacaoMsg, 'Salvando...');

    // para cada dia da semana
    for (const s of progSelects) {
      if (!s.el) continue;
      
      // obter opções selecionadas
      const selectedOptions = Array.from(s.el.selectedOptions).filter(opt => opt.value);
      const treinoIds = selectedOptions.map(opt => opt.value);
      
      // limpar programação existente do dia
      const { error: deleteError } = await supabase
        .from('treinos_programacao')
        .delete()
        .eq('dia_semana', s.dia);
      
      if (deleteError) {
        setMsg(programacaoMsg, deleteError.message, true);
        return;
      }
      
      // inserir novos treinos do dia
      if (treinoIds.length > 0) {
        const inserts = treinoIds.map(treinoId => ({
          dia_semana: s.dia,
          treino_id: treinoId,
          is_active: true,
        }));

        const { error: insertError } = await supabase
          .from('treinos_programacao')
          .insert(inserts);

        if (insertError) {
          setMsg(programacaoMsg, insertError.message, true);
          return;
        }
      }
    }

    setMsg(programacaoMsg, 'Programação salva!');
    await loadProgramacao();
  });
}

for (const btn of navButtons) {
  btn.addEventListener('click', () => setActiveView(btn.dataset.view));
}

// CRUD - ÁUDIOS
function resetAudioForm() {
  $('audioId').value = '';
  $('audioTitle').value = '';
  $('audioDuration').value = '';
  $('audioCategory').value = '';
  $('audioImageUrl').value = '';
  $('audioUrl').value = '';
  $('audioDescription').value = '';
  audioFormTitle.textContent = 'Novo áudio';
  setMsg(audioMsg, '');
}

audioCancel.addEventListener('click', () => resetAudioForm());
reloadAudios.addEventListener('click', () => loadAudios());

async function loadAudios() {
  setMsg(audioMsg, '');
  audiosTbody.innerHTML = '<tr><td colspan="5" class="muted">Carregando...</td></tr>';

  const { data, error } = await supabase
    .from('audios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    audiosTbody.innerHTML = '';
    setMsg(audioMsg, error.message, true);
    return;
  }

  if (!data || data.length === 0) {
    audiosTbody.innerHTML = '<tr><td colspan="5" class="muted">Nenhum áudio cadastrado.</td></tr>';
    return;
  }

  audiosTbody.innerHTML = data
    .map((a) => {
      const badge = a.is_active
        ? '<span class="badge on">Ativo</span>'
        : '<span class="badge off">Inativo</span>';

      return `
        <tr>
          <td>${escapeHtml(a.title)}</td>
          <td>${escapeHtml(a.category)}</td>
          <td>${escapeHtml(a.duration)}</td>
          <td>${badge}</td>
          <td>
            <button class="btn btn-secondary" data-audio-edit="${a.id}">Editar</button>
            <button class="btn btn-secondary" data-audio-toggle="${a.id}" data-audio-active="${a.is_active}">${a.is_active ? 'Desativar' : 'Ativar'}</button>
            <button class="btn btn-secondary" data-audio-del="${a.id}">Excluir</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

audioForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = $('audioId').value || null;
  const payload = {
    title: $('audioTitle').value.trim(),
    duration: $('audioDuration').value.trim(),
    category: $('audioCategory').value.trim(),
    image_url: $('audioImageUrl').value.trim(),
    audio_url: $('audioUrl').value.trim(),
    description: $('audioDescription').value.trim() || null,
  };

  setMsg(audioMsg, 'Salvando...');

  const query = id
    ? supabase.from('audios').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
    : supabase.from('audios').insert([{ ...payload }]);

  const { error } = await query;
  if (error) {
    setMsg(audioMsg, error.message, true);
    return;
  }

  setMsg(audioMsg, 'Salvo!');
  resetAudioForm();
  await loadAudios();
});

// CRUD - TREINOS
function resetTreinoForm() {
  $('treinoId').value = '';
  $('treinoTitulo').value = '';
  if (treinoCategoriaSelect) treinoCategoriaSelect.value = '';
  if (treinoCategoriaNova) treinoCategoriaNova.value = '';
  setNovaCategoriaVisible(false);
  $('treinoNivel').value = '';
  $('treinoDuracao').value = '';
  $('treinoVideoFile').value = '';
  $('treinoThumbUrl').value = '';
  
  // Esconder barra de progresso
  const progressEl = $('uploadProgress');
  if (progressEl) {
    progressEl.classList.add('hidden');
    const progressFill = progressEl.querySelector('.progress-fill');
    const progressText = progressEl.querySelector('.progress-text');
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = '0%';
  }
  
  treinoFormTitle.textContent = 'Novo treino';
  setMsg(treinoMsg, '');
}

treinoCancel.addEventListener('click', () => resetTreinoForm());
reloadTreinos.addEventListener('click', () => loadTreinos());

async function loadTreinos() {
  setMsg(treinoMsg, '');
  treinosTbody.innerHTML = '<tr><td colspan="5" class="muted">Carregando...</td></tr>';

  await loadTreinoCategorias();

  const { data, error } = await supabase
    .from('videostreinos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    treinosTbody.innerHTML = '';
    setMsg(treinoMsg, error.message, true);
    return;
  }

  if (!data || data.length === 0) {
    treinosTbody.innerHTML = '<tr><td colspan="5" class="muted">Nenhum treino cadastrado.</td></tr>';
    return;
  }

  treinosTbody.innerHTML = data
    .map((t) => {
      return `
        <tr>
          <td>${escapeHtml(t.titulo)}</td>
          <td>${escapeHtml(t.nivel)}</td>
          <td>${escapeHtml(t.categoria)}</td>
          <td>${escapeHtml(t.duracao)}</td>
          <td>
            <button class="btn btn-secondary" data-treino-edit="${t.id}">Editar</button>
            <button class="btn btn-secondary" data-treino-del="${t.id}">Excluir</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

treinoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = $('treinoId').value || null;
  const categoriaValue = getSelectedCategoriaValue();
  if (!categoriaValue) {
    setMsg(treinoMsg, 'Selecione uma categoria ou digite uma nova categoria.', true);
    return;
  }

  // Obter o arquivo de vídeo
  const videoFile = $('treinoVideoFile').files[0];
  
  setMsg(treinoMsg, 'Salvando...');

  try {
    let videoUrl;
    
    if (videoFile) {
      // Se há novo arquivo, fazer upload
      setMsg(treinoMsg, 'Fazendo upload do vídeo...');
      console.log('[Upload] Iniciando upload do arquivo:', videoFile.name, 'Tamanho:', videoFile.size);
      
      // Mostrar barra de progresso
      const progressEl = $('uploadProgress');
      const progressFill = progressEl.querySelector('.progress-fill');
      const progressText = progressEl.querySelector('.progress-text');
      progressEl.classList.remove('hidden');
      
      const fileName = `treinos/${Date.now()}-${videoFile.name}`;
      console.log('[Upload] Nome do arquivo no storage:', fileName);
      
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, videoFile, {
            onProgress: (progress) => {
              const percent = Math.round((progress.bytesTransferred / progress.totalBytes) * 100);
              console.log('[Upload] Progresso:', percent + '%', 'Transferidos:', progress.bytesTransferred, 'Total:', progress.totalBytes);
              progressFill.style.width = `${percent}%`;
              progressText.textContent = `${percent}%`;
            }
          });

        console.log('[Upload] Upload concluído. Data:', uploadData, 'Error:', uploadError);

        if (uploadError) {
          console.error('[Upload] Erro no upload:', uploadError);
          progressEl.classList.add('hidden');
          setMsg(treinoMsg, `Erro no upload: ${uploadError.message}`, true);
          return;
        }

        // Obter URL pública do vídeo
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);
        
        console.log('[Upload] URL pública gerada:', publicUrl);
        videoUrl = publicUrl;
        progressEl.classList.add('hidden');
      } catch (uploadException) {
        console.error('[Upload] Exceção durante upload:', uploadException);
        progressEl.classList.add('hidden');
        setMsg(treinoMsg, `Erro excepcional no upload: ${uploadException.message}`, true);
        return;
      }
    } else if (id) {
      // Se está editando e não há novo arquivo, buscar URL atual
      const { data: currentData } = await supabase.from('videostreinos')
        .select('video_url')
        .eq('id', id)
        .single();
      
      videoUrl = currentData?.video_url;
    } else {
      // Se é novo treino e não há arquivo, erro
      setMsg(treinoMsg, 'Por favor, selecione um arquivo de vídeo.', true);
      return;
    }

    const payload = {
      titulo: $('treinoTitulo').value.trim(),
      categoria: categoriaValue,
      nivel: $('treinoNivel').value.trim(),
      duracao: $('treinoDuracao').value.trim(),
      video_url: videoUrl,
      thumbnail_url: $('treinoThumbUrl').value.trim(),
    };

    setMsg(treinoMsg, 'Salvando informações...');

    const query = id
      ? supabase.from('videostreinos').update({ ...payload }).eq('id', id)
      : supabase.from('videostreinos').insert([{ ...payload }]);

    const { error } = await query;
    if (error) {
      setMsg(treinoMsg, error.message, true);
      return;
    }

    setMsg(treinoMsg, 'Vídeo salvo com sucesso!');
    resetTreinoForm();
    await loadTreinos();
  } catch (error) {
    setMsg(treinoMsg, `Erro: ${error.message}`, true);
  }
});

// AÇÕES - Delegation
adminView.addEventListener('click', async (e) => {
  const el = e.target;
  if (!(el instanceof HTMLElement)) return;

  // Áudios: editar
  const audioEditId = el.getAttribute('data-audio-edit');
  if (audioEditId) {
    const { data, error } = await supabase.from('audios').select('*').eq('id', audioEditId).single();
    if (error) {
      setMsg(audioMsg, error.message, true);
      return;
    }
    $('audioId').value = data.id;
    $('audioTitle').value = data.title || '';
    $('audioDuration').value = data.duration || '';
    $('audioCategory').value = data.category || '';
    $('audioImageUrl').value = data.image_url || '';
    $('audioUrl').value = data.audio_url || '';
    $('audioDescription').value = data.description || '';
    audioFormTitle.textContent = 'Editar áudio';
    setActiveView('audios');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Áudios: ativar/desativar
  const audioToggleId = el.getAttribute('data-audio-toggle');
  if (audioToggleId) {
    const current = el.getAttribute('data-audio-active') === 'true';
    const next = !current;
    const { error } = await supabase.from('audios').update({ is_active: next }).eq('id', audioToggleId);
    if (error) {
      setMsg(audioMsg, error.message, true);
      return;
    }
    await loadAudios();
    return;
  }

  // Áudios: excluir
  const audioDelId = el.getAttribute('data-audio-del');
  if (audioDelId) {
    const ok = confirm('Excluir este áudio?');
    if (!ok) return;
    const { error } = await supabase.from('audios').delete().eq('id', audioDelId);
    if (error) {
      setMsg(audioMsg, error.message, true);
      return;
    }
    await loadAudios();
    return;
  }

  // Treinos: editar
  const treinoEditId = el.getAttribute('data-treino-edit');
  if (treinoEditId) {
    const { data, error } = await supabase.from('videostreinos').select('*').eq('id', treinoEditId).single();
    if (error) {
      setMsg(treinoMsg, error.message, true);
      return;
    }
    $('treinoId').value = data.id;
    $('treinoTitulo').value = data.titulo || '';
    await loadTreinoCategorias(data.categoria || '');
    $('treinoNivel').value = data.nivel || '';
    $('treinoDuracao').value = data.duracao || '';
    $('treinoThumbUrl').value = data.thumbnail_url || '';
    treinoFormTitle.textContent = 'Editar treino (mantenha o vídeo atual ou selecione novo)';
    setActiveView('treinos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Treinos: excluir
  const treinoDelId = el.getAttribute('data-treino-del');
  if (treinoDelId) {
    const ok = confirm('Excluir este treino?');
    if (!ok) return;
    const { error } = await supabase.from('videostreinos').delete().eq('id', treinoDelId);
    if (error) {
      setMsg(treinoMsg, error.message, true);
      return;
    }
    await loadTreinos();
    await loadTreinoCategorias();
  }

  // Home Cards: editar
  const homeEditId = el.getAttribute('data-home-edit');
  if (homeEditId) {
    const { data, error } = await supabase.from('home_cards').select('*').eq('id', homeEditId).single();
    if (error) {
      setMsg(homeMsg, error.message, true);
      return;
    }
    $('homeCardId').value = data.id;
    $('homeTitle').value = data.title || '';
    $('homeDesc').value = data.desc || '';
    $('homeIcon').value = data.icon || '';
    $('homeScreen').value = data.screen || '';
    $('homeSortOrder').value = String(data.sort_order ?? 0);
    $('homeIsActive').checked = Boolean(data.is_active);
    homeCardFormTitle.textContent = 'Editar card';
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Home Cards: ativar/desativar
  const homeToggleId = el.getAttribute('data-home-toggle');
  if (homeToggleId) {
    const current = el.getAttribute('data-home-active') === 'true';
    const next = !current;
    const { error } = await supabase.from('home_cards').update({ is_active: next, updated_at: new Date().toISOString() }).eq('id', homeToggleId);
    if (error) {
      setMsg(homeMsg, error.message, true);
      return;
    }
    await loadHomeCards();
    return;
  }

  // Home Cards: excluir
  const homeDelId = el.getAttribute('data-home-del');
  if (homeDelId) {
    const ok = confirm('Excluir este card?');
    if (!ok) return;
    const { error } = await supabase.from('home_cards').delete().eq('id', homeDelId);
    if (error) {
      setMsg(homeMsg, error.message, true);
      return;
    }
    await loadHomeCards();
  }
});

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Init
resetAudioForm();
resetTreinoForm();
resetHomeCardForm();
setActiveView('audios');
bootstrapSession();
