
(() => {
  const vscode = acquireVsCodeApi();

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

  document.querySelectorAll('.item').forEach(el => {
    el.addEventListener('mouseenter', handleHover);
    el.addEventListener('mouseleave', handleLeave);
  });

  document.querySelectorAll('.picker').forEach(input => {
    input.addEventListener('input', handleColorChange);
  });
})();
