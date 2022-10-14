REDEFINE.initCodeCopy = () => {

  HTMLElement.prototype.wrap = function (wrapper) {
    this.parentNode.insertBefore(wrapper, this);
    this.parentNode.removeChild(this);
    wrapper.appendChild(this);
  };

  document.querySelectorAll('figure.highlight').forEach(element => {
    const box = document.createElement('div');
    element.wrap(box);
    box.classList.add('highlight-container');
    box.insertAdjacentHTML('beforeend', '<div class="copy-btn"><i class="fas fa-copy"></i></div>');
    const button = element.parentNode.querySelector('.copy-btn');
    button.addEventListener('click', event => {
      const target = event.currentTarget;
      const code = [...target.parentNode.querySelectorAll('.code .line')].map(line => line.innerText).join('\n');
      const ta = document.createElement('textarea');
      ta.style.top = window.scrollY + 'px'; // Prevent page scrolling
      ta.style.position = 'absolute';
      ta.style.opacity = '0';
      ta.readOnly = true;
      ta.value = code;
      document.body.append(ta);
      const selection = document.getSelection();
      const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
      ta.select();
      ta.setSelectionRange(0, code.length);
      ta.readOnly = false;
      const result = document.execCommand('copy');
      target.querySelector('i').className = result ? 'fas fa-check' : 'fas fa-times';
      ta.blur(); // For iOS
      target.blur();
      if (selected) {
        selection.removeAllRanges();
        selection.addRange(selected);
      }
      document.body.removeChild(ta);
    });
    button.addEventListener('mouseleave', event => {
      setTimeout(() => {
        event.target.querySelector('i').className = 'fas fa-copy';
      }, 300);
    });
  });
}
