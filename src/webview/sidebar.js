(() => {
  const vscode = acquireVsCodeApi();

  // Utility to add event listeners to a NodeList
  function addListeners(selector, event, handler) {
    document.querySelectorAll(selector).forEach(el => el.addEventListener(event, handler));
  }

  // Color item hover/leave
  addListeners('.item', 'mouseenter', handleHover);
  addListeners('.item', 'mouseleave', handleLeave);
  addListeners('.picker', 'input', handleColorChange);

  function handleHover(event) {
    const key = event.currentTarget.getAttribute('data-key');
    vscode.postMessage({ type: 'hover', key });
  }

  function handleLeave(event) {
    const key = event.currentTarget.getAttribute('data-key');
    vscode.postMessage({ type: 'leave', key });
  }

  function handleColorChange(event) {
    const input = event.currentTarget;
    const key = input.getAttribute('data-key');
    vscode.postMessage({ type: 'setColor', key, color: input.value });
  }

  // Config target buttons
  const btnGlobal = document.getElementById('btn-global');
  const btnWorkspace = document.getElementById('btn-workspace');

  if (btnGlobal) {
    btnGlobal.addEventListener('click', () => {
      vscode.postMessage({ type: 'setConfigTarget', target: 'Global' });
      setActiveConfigButton('Global');
    });
  }
  if (btnWorkspace) {
    btnWorkspace.addEventListener('click', () => {
      vscode.postMessage({ type: 'setConfigTarget', target: 'Workspace' });
      setActiveConfigButton('Workspace');
    });
  }

  function setActiveConfigButton(target) {
    [btnGlobal, btnWorkspace].forEach(btn => btn?.classList.remove('active'));
    if (target === 'Global') btnGlobal?.classList.add('active');
    if (target === 'Workspace') btnWorkspace?.classList.add('active');
  }

  // Listen for workspace availability
  window.addEventListener('message', event => {
    const msg = event.data;
    if (msg.type === 'workspaceAvailability') {
      // Disable Global button if workspace is open
      if (btnGlobal) {
        btnGlobal.disabled = !!msg.available;
        btnGlobal.title = msg.available ? 'Global config is not available in workspace' : '';
      }
      if (btnWorkspace) {
        btnWorkspace.disabled = !msg.available;
        btnWorkspace.title = !msg.available ? 'No workspace available' : '';
      }
      // Set active button based on config target
      if (msg.configTarget) setActiveConfigButton(msg.configTarget);
    }
  });

  // Request state from backend when sidebar is shown
  document.addEventListener('DOMContentLoaded', () => {
    vscode.postMessage({ type: 'requestState' });
  });
})();
