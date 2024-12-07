import interact from 'interactjs';

// Configurar elementos arrastrables
const setupDraggableItems = () => {
  interact('#main').draggable({
    listeners: {
      start(event) {
        const target = event.target;
        target.classList.add('dragging'); // Añadir clase para estilo
        target.style.zIndex = '1000'; // Traer al frente
      },
      move(event) {
        const target = event.target;

        // Calcular nuevas posiciones
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // Aplicar transformaciones
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event) {
        const target = event.target;
        target.classList.remove('dragging'); // Quitar clase
        resetTransform(target); // Resetear transformaciones
      },
    },
  });
};

// Configurar el contenedor principal como zona de drop
const setupDropzone = () => {
  interact('#main').dropzone({
    accept: '.movie',
    overlap: 0.5,
    ondragenter(event) {
      event.target.classList.add('active-dropzone'); // Estilo al entrar
    },
    ondragleave(event) {
      event.target.classList.remove('active-dropzone'); // Estilo al salir
    },
    ondrop(event) {
      const droppedItem = event.relatedTarget;

      // Mover el contenedor al final del contenedor padre
      const mainContainer = document.getElementById('main');
      mainContainer.appendChild(droppedItem);

      updateMovieOrder(); // Actualizar orden lógico
    },
  });
};

// Resetea las transformaciones aplicadas
const resetTransform = (element) => {
  element.style.transform = '';
  element.setAttribute('data-x', 0);
  element.setAttribute('data-y', 0);
};

// Actualiza el orden en localStorage
const updateMovieOrder = () => {
  const movies = Array.from(document.querySelectorAll('.movie-container')).map((container, index) => ({
    id: container.getAttribute('data-my-id'),
    title: container.querySelector('.title').textContent,
    order: index,
  }));

  localStorage.setItem('movies', JSON.stringify(movies));
  console.log('Nuevo orden guardado:', movies);
};

// Inicializa Drag and Drop al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  setupDraggableItems();
  setupDropzone();
});
