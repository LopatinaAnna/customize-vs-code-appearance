(() => {
  const vscode = acquireVsCodeApi();
  console.log('sidebar.js loaded in webview');

  // apply a theme class to <body> (light, dark, high-contrast)
  function setThemeClass(themeClass) {
    document.body.classList.remove('vscode-light', 'vscode-dark', 'vscode-high-contrast');
    if (themeClass) {
      document.body.classList.add(themeClass);
    }
  }

  // Utility to add event listeners to a NodeList
  function addListeners(selector, event, handler) {
    document.querySelectorAll(selector).forEach(el => el.addEventListener(event, handler));
  }


  // Expand/collapse element groups
  addListeners('.element-header', 'click', handleExpandCollapse);
  addListeners('.element-header', 'keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') handleExpandCollapse(e);
  });
  // per-element reset buttons
  addListeners('.reset-element', 'click', handleElementReset);

  function handleExpandCollapse(event) {
    // don't expand/collapse if clicking on reset icon area
    if (event.target.closest('.reset-element')) {
      return;
    }
    const header = event.currentTarget;
    const group = header.closest('.element-group');
    const settings = group.querySelector('.element-settings');
    const icon = header.querySelector('.expand-icon');
    const expanded = settings.style.display !== 'none';
    settings.style.display = expanded ? 'none' : 'block';
    icon.innerHTML = expanded ? '&#9654;' : '&#9660;';
  }

  function handleElementReset(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Reset element clicked');
    const resetIcon = event.currentTarget;
    const header = resetIcon.closest('.element-header');
    const group = header.closest('.element-group');
    const keys = group?.getAttribute('data-keys')?.split(',').filter(k => k.trim()) || [];
    console.log('Resetting group with keys:', keys);
    if (keys.length > 0) {
      console.log('Sending resetGroup message with keys:', keys);
      vscode.postMessage({ type: 'resetGroup', keys });
    } else {
      console.warn('No keys found for group reset');
    }
  }

  // scope reset handler
  function handleScopeReset(event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget.getAttribute('data-target');
    console.log('Scope reset clicked for target', target);
    if (target === 'Global' || target === 'Workspace') {
      vscode.postMessage({ type: 'resetScope', target });
    }
  }

  // Hover/leave for group and settings
  addListeners('.element-header', 'mouseenter', handleGroupHover);
  addListeners('.element-header', 'mouseleave', handleGroupLeave);
  addListeners('.setting-item', 'mouseenter', handleHover);
  addListeners('.setting-item', 'mouseleave', handleLeave);

    // Handle position select dropdowns
  addListeners('.position-select', 'change', handlePositionChange);

  function handlePositionChange(event) {
    const select = event.currentTarget;
    const key = select.getAttribute('data-key');
    vscode.postMessage({ type: 'setString', key, value: select.value });
  }

  function handleGroupHover(event) {
    // Optionally highlight all settings in the group
    // Could also highlight the first setting or a representative key
    // For now, highlight the first setting
    const group = event.currentTarget.closest('.element-group');
    const firstSetting = group.querySelector('.setting-item');
    if (firstSetting) {
      const key = firstSetting.getAttribute('data-key');
      vscode.postMessage({ type: 'hover', key });
    }
  }
  function handleGroupLeave(event) {
    const group = event.currentTarget.closest('.element-group');
    const firstSetting = group.querySelector('.setting-item');
    if (firstSetting) {
      const key = firstSetting.getAttribute('data-key');
      vscode.postMessage({ type: 'leave', key });
    }
  }
  function handleHover(event) {
    const key = event.currentTarget.getAttribute('data-key');
    vscode.postMessage({ type: 'hover', key });
  }
  function handleLeave(event) {
    const key = event.currentTarget.getAttribute('data-key');
    vscode.postMessage({ type: 'leave', key });
  }

  // Handle all input types
  addListeners('.picker', 'input', handleColorChange);
  addListeners('.picker', 'change', handleColorChange);
  addListeners('.number-input', 'input', handleNumberChange);
  addListeners('.string-input', 'input', handleStringChange);

  function handleColorChange(event) {
    const input = event.currentTarget;
    const key = input.getAttribute('data-key');
    vscode.postMessage({ type: 'setColor', key, color: input.value });
  }

  function handleNumberChange(event) {
    const input = event.currentTarget;
    const key = input.getAttribute('data-key');
    vscode.postMessage({ type: 'setNumber', key, value: input.value });
  }

  function handleStringChange(event) {
    const input = event.currentTarget;
    const key = input.getAttribute('data-key');
    vscode.postMessage({ type: 'setString', key, value: input.value });
  }

  // Config target buttons
  const btnGlobal = document.getElementById('btn-global');
  const btnWorkspace = document.getElementById('btn-workspace');
  addListeners('.scope-reset', 'click', handleScopeReset);

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
        const icon = document.querySelector('.scope-control .scope-reset[data-target="Global"]');
        if (icon) icon.classList.toggle('disabled', btnGlobal.disabled);
      }
      if (btnWorkspace) {
        btnWorkspace.disabled = !msg.available;
        btnWorkspace.title = !msg.available ? 'No workspace available' : '';
        const icon = document.querySelector('.scope-control .scope-reset[data-target="Workspace"]');
        if (icon) icon.classList.toggle('disabled', btnWorkspace.disabled);
      }
      // Set active button based on config target
      if (msg.configTarget) setActiveConfigButton(msg.configTarget);
    } else if (msg.type === 'setTheme') {
      setThemeClass(msg.theme);
    }
  });

  // Request state from backend when sidebar is shown
  document.addEventListener('DOMContentLoaded', () => {
    vscode.postMessage({ type: 'requestState' });
  });
})();
