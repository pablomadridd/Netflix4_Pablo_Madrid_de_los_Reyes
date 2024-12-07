document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de SwiperJS
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        keyboard: {
            enabled: true,
        },
    });

    // Manejo de navegación a través del menú
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const slideIndex = parseInt(event.target.dataset.slide, 10);
            swiper.slideTo(slideIndex);
        });
    });

    // Evento para inicializar la lógica al cambiar de sección
    swiper.on('slideChange', () => {
        const activeIndex = swiper.activeIndex;

        // Lógica adicional para cada sección
        const activeSlide = document.querySelectorAll('.swiper-slide')[activeIndex];
        const sectionId = activeSlide.querySelector('section')?.id;

        if (sectionId === 'movies') {
            // Inicializa la vista principal de Movies
            indexContr();
        }
    });

    // Opcional: Mostrar en consola la sección activa
    swiper.on('slideChangeTransitionEnd', () => {
        console.log(`Sección activa: ${swiper.activeIndex}`);
    });
});


