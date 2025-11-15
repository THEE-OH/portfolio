function openModal(src, title) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const captionBox = document.getElementById("caption");

  modal.style.display = "flex";
  modalImg.src = src;

  captionBox.innerText = title || "";
}

function closeModal(event) {
  const modal = document.getElementById("modal");

  if (event.target === modal || event.target.classList.contains("close")) {
    modal.style.display = "none";
  }
}
