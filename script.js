// ==========================================
// ELEMENTOS DO DOM
// ==========================================

const heroSection = document.getElementById('heroSection');
const heroButton = document.getElementById('heroButton');
const mainContent = document.getElementById('mainContent');
const finalButton = document.getElementById('finalButton');
const finalContent = document.getElementById('finalContent');
const answerContent = document.getElementById('answerContent');
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
const particlesContainer = document.getElementById('particles');
const heartsAnimation = document.getElementById('heartsAnimation');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

// ==========================================
// VARIÁVEIS DE CONTROLE
// ==========================================

let isMusicPlaying = false;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    setupEventListeners();
    
    // Configura listeners das fotos logo que o DOM carregar
    // (será chamado novamente após mostrar o conteúdo, mas não tem problema)
    console.log('DOM carregado, tentando configurar photo listeners...');
    const allImages = document.querySelectorAll('.photo-item img');
    console.log('Imagens encontradas no DOM:', allImages.length);
});

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Botão hero - mostrar conteúdo principal
    heroButton.addEventListener('click', showMainContent);
    
    // Botão final - mostrar resposta
    finalButton.addEventListener('click', showAnswer);
    
    // Toggle de música
    musicToggle.addEventListener('click', toggleMusic);
    
    // Lightbox - fechar ao clicar no fundo
    lightbox.addEventListener('click', closeLightbox);
    
    // Fechar lightbox com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox({ target: lightbox });
        }
    });
}

// ==========================================
// TRANSIÇÃO: HERO → CONTEÚDO PRINCIPAL
// ==========================================

function showMainContent() {
    // Adiciona animação ao botão
    heroButton.style.transform = 'scale(0.95)';
    
    // Inicia a música
    playMusic();
    
    setTimeout(() => {
        // Esconde hero section
        heroSection.classList.remove('active');
        
        // Mostra conteúdo principal com delay
        setTimeout(() => {
            mainContent.classList.add('active');
            
            // Anima elementos conforme aparecem na tela
            observeElements();
            
            // Adiciona event listeners para as fotos com um pequeno delay
            setTimeout(() => {
                setupPhotoListeners();
            }, 500);
        }, 400);
    }, 200);
}

// ==========================================
// RESPOSTA FINAL
// ==========================================

function showAnswer() {
    // Animação do botão
    finalButton.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // Esconde conteúdo final
        finalContent.classList.add('hidden');
        
        // Mostra resposta
        answerContent.classList.remove('hidden');
        setTimeout(() => {
            answerContent.classList.add('active');
        }, 100);
        
        // Inicia animação de corações
        createHeartsAnimation();
        
        // Reproduz música automaticamente se ainda não estiver tocando
        if (!isMusicPlaying) {
            playMusic();
        }
    }, 200);
}

// ==========================================
// ANIMAÇÃO DE CORAÇÕES
// ==========================================

function createHeartsAnimation() {
    const numberOfHearts = 20;
    
    for (let i = 0; i < numberOfHearts; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 200);
    }
    
    // Continua criando corações
    setInterval(() => {
        createHeart();
    }, 1000);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Posição aleatória horizontal
    const leftPosition = Math.random() * 100;
    heart.style.left = `${leftPosition}%`;
    
    // Delay aleatório para animação
    const animationDelay = Math.random() * 2;
    heart.style.animationDelay = `${animationDelay}s`;
    
    // Tamanho aleatório
    const size = 20 + Math.random() * 20;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    
    // Ajusta pseudo-elementos
    heart.style.setProperty('--heart-size', `${size}px`);
    
    heartsAnimation.appendChild(heart);
    
    // Remove após animação
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// ==========================================
// LIGHTBOX PARA FOTOS
// ==========================================

function setupPhotoListeners() {
    const photoItems = document.querySelectorAll('.photo-item img');
    
    console.log('Configurando listeners para', photoItems.length, 'fotos');
    
    photoItems.forEach((img, index) => {
        // Remove listeners antigos se existirem
        img.removeEventListener('click', handleImageClick);
        
        // Adiciona novo listener
        img.addEventListener('click', handleImageClick);
        
        // Adiciona cursor pointer
        img.style.cursor = 'pointer';
        
        console.log('Listener adicionado para foto', index + 1);
    });
    
    // Também adiciona delegação de eventos no container
    const gallery = document.querySelector('.photo-gallery');
    if (gallery) {
        gallery.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG' && e.target.closest('.photo-item')) {
                console.log('Foto clicada via delegação');
                openLightbox(e.target.src, e.target.alt);
            }
        });
    }
}

function handleImageClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Foto clicada diretamente');
    openLightbox(this.src, this.alt);
}

function openLightbox(src, alt) {
    console.log('Abrindo lightbox com:', src);
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    
    // Pequeno delay para garantir que a imagem carregou
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 50);
    
    // Previne scroll do body
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    console.log('Tentando fechar lightbox, target:', e.target.id || e.target.className);
    
    // Fecha se clicar no fundo do lightbox (não na imagem)
    if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox')) {
        console.log('Fechando lightbox');
        lightbox.classList.remove('active');
        
        // Restaura scroll do body
        document.body.style.overflow = '';
        
        // Limpa a imagem após a transição
        setTimeout(() => {
            lightboxImg.src = '';
        }, 400);
    }
}

// Previne que o clique na imagem do lightbox feche o lightbox
if (lightboxImg) {
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Clique na imagem do lightbox - não fecha');
    });
}

// ==========================================
// SISTEMA DE MÚSICA
// ==========================================

function toggleMusic() {
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
    }).catch(error => {
        console.log('Erro ao reproduzir música:', error);
    });
}

function pauseMusic() {
    backgroundMusic.pause();
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
}

// ==========================================
// PARTÍCULAS DE FUNDO
// ==========================================

function initializeParticles() {
    const numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Posição inicial aleatória
    const leftPosition = Math.random() * 100;
    particle.style.left = `${leftPosition}%`;
    
    // Posição vertical inicial
    const topPosition = Math.random() * 100;
    particle.style.top = `${topPosition}%`;
    
    // Delay aleatório
    const animationDelay = Math.random() * 20;
    particle.style.animationDelay = `${animationDelay}s`;
    
    // Duração aleatória
    const animationDuration = 15 + Math.random() * 10;
    particle.style.animationDuration = `${animationDuration}s`;
    
    particlesContainer.appendChild(particle);
}

// ==========================================
// OBSERVADOR DE INTERSEÇÃO (Animações ao scroll)
// ==========================================

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa elementos que devem animar ao aparecer
    const animatedElements = document.querySelectorAll('.photo-item, .emotional-content, .final-content');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// ==========================================
// EFEITOS ADICIONAIS
// ==========================================

// Efeito parallax suave no scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDiff = scrollTop - lastScrollTop;
    
    // Move partículas levemente com o scroll
    particlesContainer.style.transform = `translateY(${scrollTop * 0.5}px)`;
    
    lastScrollTop = scrollTop;
}, { passive: true });

// Efeito de cursor personalizado (opcional)
document.addEventListener('mousemove', (e) => {
    // Cria pequeno efeito de brilho ao mover o mouse
    if (Math.random() > 0.95) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#c9a227';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 600);
}

// Adiciona animação de sparkle ao CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0);
        }
        100% {
            opacity: 0;
            transform: scale(1);
        }
    }
    
    .heart::before,
    .heart::after {
        width: var(--heart-size, 30px);
        height: var(--heart-size, 30px);
    }
`;
document.head.appendChild(style);

// ==========================================
// PREVENÇÃO DE SCROLL INICIAL
// ==========================================

// Previne scroll enquanto a hero section está ativa
function preventScroll(e) {
    if (heroSection.classList.contains('active')) {
        e.preventDefault();
    }
}

window.addEventListener('wheel', preventScroll, { passive: false });
window.addEventListener('touchmove', preventScroll, { passive: false });

// Remove prevenção quando hero section é fechada
heroButton.addEventListener('click', () => {
    setTimeout(() => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
    }, 1000);
});

// ==========================================
// EASTER EGG: CONFETE (ao pressionar uma tecla secreta)
// ==========================================

let secretCode = '';
const secretSequence = 'amor';

document.addEventListener('keypress', (e) => {
    secretCode += e.key.toLowerCase();
    
    if (secretCode.includes(secretSequence)) {
        createConfetti();
        secretCode = '';
    }
    
    // Limita o tamanho do código secreto
    if (secretCode.length > 10) {
        secretCode = secretCode.slice(-10);
    }
});

function createConfetti() {
    const colors = ['#c9a227', '#5a0e1a', '#f5f5f5'];
    const numberOfPieces = 100;
    
    for (let i = 0; i < numberOfPieces; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = '0.8';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// Animação de queda do confete
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ==========================================
// LOG DE DESENVOLVIMENTO
// ==========================================

console.log('%c💝 Site Romântico - 14 de Fevereiro', 'color: #c9a227; font-size: 20px; font-weight: bold;');
console.log('%c✨ Easter Egg: Digite "amor" para ver uma surpresa!', 'color: #5a0e1a; font-size: 14px;');
