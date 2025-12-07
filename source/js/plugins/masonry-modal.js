export function initMasonryModal() {
  console.log('[MasonryModal] initMasonryModal() called');
  function showMasonryModal(data) {
    const oldModal = document.getElementById("masonry-modal");
    if (oldModal) oldModal.remove();

    let displayDate = data.date;
    try {
      const dateObj = new Date(data.date);
      if (!isNaN(dateObj)) {
        displayDate = dateObj.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    } catch (e) {}

    const modal = document.createElement("div");
    modal.id = "masonry-modal";
    modal.className = "masonry-modal";
    modal.style.zIndex = "999999";
    modal.innerHTML = `
      <div class="masonry-modal-content">
        <button class="masonry-modal-close">&times;</button>
        <div class="masonry-modal-body">
          <div class="masonry-modal-image">
            <img src="${data.image}" alt="${data.title}">
          </div>
          <div class="masonry-modal-info">
            <h2>${data.title}</h2>
            <div class="masonry-modal-meta">
              <div class="meta-item">
                <span class="meta-label">拍摄时间:</span>
                <span class="meta-value">${displayDate}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">拍摄地点:</span>
                <span class="meta-value">${data.location}</span>
              </div>
            </div>
            <div class="masonry-modal-description">
              <p>${data.description}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const modalImg = modal.querySelector(".masonry-modal-image img");
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 3;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let translateX = 0;
    let translateY = 0;

    const imageContainer = modal.querySelector(".masonry-modal-image");
    imageContainer.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.max(minScale, Math.min(maxScale, scale * delta));
      updateImageTransform();
    });

    imageContainer.addEventListener("mousedown", (e) => {
      if (scale > 1) {
        isDragging = true;
        dragStartX = e.clientX - translateX;
        dragStartY = e.clientY - translateY;
        imageContainer.style.cursor = "grabbing";
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const containerRect = imageContainer.getBoundingClientRect();
        const maxTranslateX = (containerRect.width * (scale - 1)) / 2;
        const maxTranslateY = (containerRect.height * (scale - 1)) / 2;

        translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, e.clientX - dragStartX));
        translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, e.clientY - dragStartY));
        updateImageTransform();
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      imageContainer.style.cursor = "grab";
    });

    let lastDistance = 0;
    imageContainer.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDistance = Math.sqrt(dx * dx + dy * dy);
      }
    });

    imageContainer.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delta = distance / lastDistance;
        scale = Math.max(minScale, Math.min(maxScale, scale * delta));
        lastDistance = distance;
        updateImageTransform();
      }
    });

    function updateImageTransform() {
      if (scale === 1) {
        translateX = 0;
        translateY = 0;
      }
      modalImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
    }

    imageContainer.addEventListener("dblclick", () => {
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateImageTransform();
    });

    imageContainer.style.cursor = "grab";
    imageContainer.style.overflow = "hidden";
    imageContainer.style.userSelect = "none";

    modal.querySelector(".masonry-modal-close").addEventListener("click", () => {
      modal.remove();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  }

  function initMasonryClickHandlers() {
    console.log('[MasonryModal] initMasonryClickHandlers() binding .masonry-item click handlers');
    // 使用 requestAnimationFrame 确保 DOM 已经完全渲染
    requestAnimationFrame(() => {
      // 清除所有 masonry-item 的 hasListener 标记，以便重新绑定（处理 swup 切换后的新 DOM）
      document.querySelectorAll(".masonry-item").forEach((item) => {
        // 移除旧的监听器（如果存在）
        if (item.hasListener && item._masonryClickHandler) {
          item.removeEventListener("click", item._masonryClickHandler, true);
        }
        item.hasListener = false;
      });
      
      // 重新绑定所有 masonry-item 的点击事件
      document.querySelectorAll(".masonry-item").forEach((item) => {
        if (!item.hasListener) {
          item.hasListener = true;
          // 创建事件处理函数并保存引用，以便后续移除
          item._masonryClickHandler = function (e) {
            if (e.target.tagName === "IMG" || e.target.closest("img")) {
              e.preventDefault();
              e.stopImmediatePropagation();
            }

            showMasonryModal({
              title: this.dataset.title,
              description: this.dataset.description,
              date: this.dataset.date,
              location: this.dataset.location,
              image: this.querySelector("img").src,
            });
          };
          item.addEventListener("click", item._masonryClickHandler, true);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMasonryClickHandlers);
  } else {
    initMasonryClickHandlers();
  }
}

export default function initMasonryModalPlugin() {
  if (document.querySelector("#masonry-container")) {
    initMasonryModal();
  }
}

