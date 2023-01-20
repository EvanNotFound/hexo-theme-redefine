REDEFINE.initCopyCode = () => {
  HTMLElement.prototype.wrap = function (wrapper) {
    this.parentNode.insertBefore(wrapper, this);
    this.parentNode.removeChild(this);
    wrapper.appendChild(this);
  };

  document.querySelectorAll('figure.highlight').forEach(element => {
    const container = document.createElement('div');
    element.wrap(container);
    container.classList.add('highlight-container');
    container.insertAdjacentHTML('beforeend', '<div class="copy-button"><i class="fa-regular fa-copy"></i></div>');
    const button = container.querySelector('.copy-button');
    button.addEventListener('click', () => {
      const codeLines = [...container.querySelectorAll('.code .line')];
      const code = codeLines.map(line => line.innerText).join('\n');
      
      // Copy code to clipboard
      navigator.clipboard.writeText(code);

      // Display 'copied' icon
      button.querySelector('i').className = 'fa-regular fa-check';

      // Reset icon after a while
      setTimeout(() => {
        button.querySelector('i').className = 'fa-regular fa-copy';
      }, 300);
    });
  });
}
