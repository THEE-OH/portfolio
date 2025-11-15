function openModal(filename) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');

  modal.style.display = 'flex';
  modalImg.src = '/uploads/' + filename;
}

function closeModal(event) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');

  if (event.target === modal || event.target.classList.contains('close')) {
    modal.style.display = 'none';
    modalImg.src = '';
  }
}
