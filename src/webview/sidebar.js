(function () {
  const vscode = acquireVsCodeApi();

  document.querySelectorAll('.item').forEach(el => {
    const key = el.getAttribute('data-key');
    el.addEventListener('mouseenter', () => vscode.postMessage({ type: 'hover', key }));
    el.addEventListener('mouseleave', () => vscode.postMessage({ type: 'leave', key }));
  });

  document.querySelectorAll('.picker').forEach(input => {
    const key = input.getAttribute('data-key');
    input.addEventListener('input', () => {
      vscode.postMessage({ type: 'setColor', key, color: input.value });
    });
  });
})();
