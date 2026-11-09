const fileInput = document.querySelector('#fileInput');
const dropzone = document.querySelector('#dropzone');
const feedback = document.querySelector('#uploadFeedback');
const documentList = document.querySelector('#documentList');
const messages = document.querySelector('#messages');
const form = document.querySelector('#chatForm');
const input = document.querySelector('#messageInput');
const sendButton = document.querySelector('#sendButton');
let documents = [];
let history = [];
let busy = false;

function setBusy(value) {
  busy = value;
  sendButton.disabled = value;
  document.querySelectorAll('.mode-card').forEach(button => button.disabled = value);
}
function addMessage(role, text, sources = []) {
  const welcome = messages.querySelector('.welcome-message');
  if (welcome) welcome.remove();
  const row = document.createElement('div');
  row.className = `message ${role}`;
  if (role === 'assistant') {
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '✳';
    row.appendChild(avatar);
  }
  const body = document.createElement('div');
  body.className = 'message-body';
  if (role === 'assistant') {
    // Escape source content before adding the small subset of Markdown used in answers.
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    body.innerHTML = escaped.replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  } else {
    body.textContent = text;
  }
  if (sources.length) {
    const source = document.createElement('div');
    source.className = 'sources';
    source.textContent = 'SOURCES  ·  ' + sources.map(s => `${s.name}${s.page ? `, page ${s.page}` : ''}`).filter((s, i, a) => a.indexOf(s) === i).join('  ·  ');
    body.appendChild(source);
  }
  row.appendChild(body);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  return row;
}
function renderDocuments() {
  documentList.replaceChildren();
  documents.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'document';
    const icon = document.createElement('span');
    icon.className = 'document-icon'; icon.textContent = '▤';
    const name = document.createElement('span');
    name.className = 'document-name'; name.textContent = doc.name;
    const meta = document.createElement('small');
    meta.className = 'document-meta'; meta.textContent = `${doc.pages || 1} ${(doc.pages || 1) === 1 ? 'page' : 'pages'} · Ready to study`;
    name.appendChild(meta); item.append(icon, name); documentList.appendChild(item);
  });
}
async function upload(files) {
  if (!files.length) return;
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('files', file));
  feedback.textContent = 'Reading your materials…';
  try {
    const response = await fetch('/api/upload', {method:'POST', body:formData});
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Could not upload these files.');
    documents.push(...data.documents);
    renderDocuments();
    feedback.textContent = `${data.documents.length} ${data.documents.length === 1 ? 'file' : 'files'} ready. Choose a practice type below or ask a question.`;
  } catch (error) {
    feedback.textContent = error.message || 'Something went wrong while uploading. Please try again.';
  }
  fileInput.value = '';
}
fileInput.addEventListener('change', event => upload(event.target.files));
['dragenter','dragover'].forEach(type => dropzone.addEventListener(type, event => {event.preventDefault(); dropzone.classList.add('dragover');}));
['dragleave','drop'].forEach(type => dropzone.addEventListener(type, event => {event.preventDefault(); dropzone.classList.remove('dragover');}));
dropzone.addEventListener('drop', event => upload(event.dataTransfer.files));

async function ask(message, mode = 'chat') {
  if (busy || !message.trim()) return;
  if (!documents.length) {
    feedback.textContent = 'Add a PDF or image first so Notewise can use your material.';
    document.querySelector('#materials').scrollIntoView({behavior:'smooth', block:'center'});
    return;
  }
  addMessage('user', message);
  input.value = '';
  setBusy(true);
  const loading = addMessage('assistant', 'Looking through your notes…');
  document.querySelector('#chat').scrollIntoView({behavior:'smooth', block:'nearest'});
  try {
    const response = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message, mode, document_ids:documents.map(doc => doc.id), history})});
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Could not generate an answer.');
    loading.remove();
    addMessage('assistant', data.answer, data.sources || []);
    history.push({role:'user', content:message}, {role:'assistant', content:data.answer});
    history = history.slice(-12);
  } catch (error) {
    loading.remove();
    addMessage('assistant', error.message || 'Something went wrong. Please try again.');
  } finally { setBusy(false); }
}
form.addEventListener('submit', event => {event.preventDefault(); ask(input.value);});
const prompts = {
  mcq: 'Create exam-style multiple choice questions from my notes, with answers and explanations.',
  theory: 'Create exam-style theory questions from my notes, with model answers.',
  numerical: 'Create exam-style numerical problems from my notes, with step-by-step solutions where the material supports them.',
  topics: 'Identify the most important topics in my notes and explain what I should focus on for an exam.'
};
document.querySelectorAll('.mode-card').forEach(button => button.addEventListener('click', () => ask(prompts[button.dataset.mode], button.dataset.mode)));
