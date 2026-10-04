import { commandText, commands, installSteps, project, providers } from './catalog.js';

const providerList = document.querySelector('[data-provider-list]');
const selectedProvider = document.querySelector('[data-selected-provider]');
const installCode = document.querySelector('[data-install-code]');
const commandList = document.querySelector('[data-command-list]');
const commandCount = document.querySelector('[data-command-count]');
const search = document.querySelector('[data-command-search]');
const category = document.querySelector('[data-command-category]');
const copyStatus = document.querySelector('[data-copy-status]');

let activeProvider = providers[0].id;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderProviders() {
  providerList.innerHTML = providers.map((provider) => `
    <button class="provider-pill${provider.id === activeProvider ? ' is-active' : ''}"
      type="button" data-provider="${provider.id}" aria-pressed="${provider.id === activeProvider}">
      <span>${escapeHtml(provider.name)}</span>
      <small>${escapeHtml(provider.config)}</small>
    </button>
  `).join('');
}

function renderInstall() {
  const provider = providers.find((item) => item.id === activeProvider);
  selectedProvider.textContent = provider.name;
  const steps = installSteps(activeProvider);
  installCode.innerHTML = steps.map((step, index) => `
    <span class="code-line"><b>${index + 1}</b><code>${escapeHtml(step)}</code></span>
  `).join('');
  installCode.dataset.copyValue = steps.join('\n');
}

function renderCommands() {
  const query = search.value.trim().toLocaleLowerCase('zh-CN');
  const selectedCategory = category.value;
  const filtered = commands.filter((command) => {
    const haystack = `${command.name} ${command.title} ${command.description} ${command.category}`.toLocaleLowerCase('zh-CN');
    return (!query || haystack.includes(query)) && (!selectedCategory || command.category === selectedCategory);
  });
  commandCount.textContent = `显示 ${filtered.length} / ${commands.length} 条命令`;
  commandList.innerHTML = filtered.length ? filtered.map((command) => {
    const value = commandText(command);
    return `
      <article class="command-card">
        <div class="command-card__meta"><span>${escapeHtml(command.category)}</span><code>${escapeHtml(command.name)}</code></div>
        <h3>${escapeHtml(command.title)}</h3>
        <p>${escapeHtml(command.description)}</p>
        <button class="copy-command" type="button" data-copy-value="${escapeHtml(value)}" aria-label="复制 ${escapeHtml(command.name)} 命令">
          <code>${escapeHtml(value)}</code><span>复制</span>
        </button>
      </article>
    `;
  }).join('') : '<p class="empty-state">没有匹配的命令，试试“排版”“审计”或清除筛选。</p>';
}

async function copy(value, label = '命令') {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  copyStatus.textContent = `${label}已复制`;
  window.setTimeout(() => { copyStatus.textContent = ''; }, 1800);
}

providerList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-provider]');
  if (!button) return;
  activeProvider = button.dataset.provider;
  renderProviders();
  renderInstall();
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-copy-value], [data-copy-target]');
  if (!button) return;
  const target = button.dataset.copyTarget && document.querySelector(button.dataset.copyTarget);
  copy(button.dataset.copyValue || target?.dataset.copyValue || '', button.dataset.copyLabel || '命令');
});

search.addEventListener('input', renderCommands);
category.addEventListener('change', renderCommands);

document.querySelectorAll('[data-project-value]').forEach((node) => {
  node.textContent = project[node.dataset.projectValue];
});

const categories = [...new Set(commands.map((command) => command.category))];
category.insertAdjacentHTML('beforeend', categories.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join(''));
renderProviders();
renderInstall();
renderCommands();
