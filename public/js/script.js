function openModal(filename, title) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const caption = document.getElementById('caption');

  modal.style.display = 'flex';
  modalImg.src = '/uploads/' + filename;

  // Hide caption text in modal
  caption.style.display = 'none';
}

function closeModal(event) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const caption = document.getElementById('caption');

  // Close modal if click is on modal background or X button
  if (event.target === modal || event.target.classList.contains('close')) {
    modal.style.display = 'none';
    modalImg.src = '';
  }
}
