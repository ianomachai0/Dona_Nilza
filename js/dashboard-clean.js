// =============================================
// Funções Principais (Atualizadas)
// =============================================

// Função para mostrar seções
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');

    // Atualizar navegação ativa
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('nav-active');
    });
    document.querySelector(`nav a[href="#${sectionId}"]`).classList.add('nav-active');

    // Reinicializar carousel se for a seção de memórias
    if (sectionId === 'memories') {
        setTimeout(initializeCarousel, 100);
    }
}

// Função para abrir modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Adicionar animação de confete se for o modal de aniversário
    if (modalId === 'birthdayModal') {
        startConfetti();
    }
}

// Função para fechar modals
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para abrir modal de foto
function openPhotoModal(title, description, imageSrc) {
    document.getElementById('modalPhotoTitle').textContent = title;
    document.getElementById('modalPhotoDescription').textContent = description;
    document.getElementById('modalPhoto').src = imageSrc;
    openModal('photoModal');
}

// Função para inicializar o carousel
function initializeCarousel() {
    if (typeof $ !== 'undefined' && $('.gallery-carousel').length) {
        // Destruir carousel existente se houver
        if ($('.gallery-carousel').hasClass('slick-initialized')) {
            $('.gallery-carousel').slick('unslick');
        }

        // Inicializar novo carousel
        $('.gallery-carousel').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
}

// Função para animação de confete
function startConfetti() {
    const colors = ['#FFC1CC', '#AED6F1', '#FFF9B1', '#B2E4D5', '#D7BDE2'];
    const confettiContainer = document.querySelector('.confetti');

    if (!confettiContainer) return;

    // Limpar confetes existentes
    confettiContainer.innerHTML = '';

    // Criar novos confetes
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);

            // Remover confete após animação
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 100);
    }
}

// =============================================
// HEADER DESLIZANTE
// =============================================

let lastScrollTop = 0;
let isHeaderHidden = false;

function setupScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100 && !isHeaderHidden) {
            // Scrolling down & header visible - hide it
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease-in-out';
            isHeaderHidden = true;
        } else if (scrollTop < lastScrollTop && isHeaderHidden) {
            // Scrolling up & header hidden - show it
            header.style.transform = 'translateY(0)';
            isHeaderHidden = false;
        }
        
        lastScrollTop = scrollTop;
    });
}

// =============================================
// ÍCONE ANIMADO NO FOOTER
// =============================================

function setupAnimatedFooterIcon() {
    const heartIcon = document.querySelector('footer .fas.fa-heart');
    if (!heartIcon) return;
    
    // Mudar para diferentes ícones com cores
    const icons = [
        { class: 'fa-heart', color: '#e91e63' },
        { class: 'fa-star', color: '#FFD700' },
        { class: 'fa-gem', color: '#9C27B0' },
        { class: 'fa-crown', color: '#FF9800' },
        { class: 'fa-gift', color: '#4CAF50' },
        { class: 'fa-birthday-cake', color: '#F44336' }
    ];
    
    let currentIconIndex = 0;
    
    setInterval(() => {
        const currentIcon = icons[currentIconIndex];
        heartIcon.className = `fas ${currentIcon.class}`;
        heartIcon.style.color = currentIcon.color;
        heartIcon.style.transition = 'all 0.3s ease';
        
        // Pequena animação de pulsação
        heartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            heartIcon.style.transform = 'scale(1)';
        }, 150);
        
        currentIconIndex = (currentIconIndex + 1) % icons.length;
    }, 500);
}

// =============================================
// SISTEMA DE NOTIFICAÇÕES E CRONÔMETRO
// =============================================

// Data do aniversário da Dona Nilza (pode ser alterada)
let birthdayDate = new Date('2025-03-15T00:00:00'); // 15 de março de 2025
let notificationsEnabled = false;
let birthdayNotificationSent = false;

// Solicitar permissão para notificações
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notificationsEnabled = true;
                showMessage('✅ Notificações ativadas! Você será avisado quando chegar o aniversário.', 'success');
            } else {
                showMessage('❌ Permissão para notificações negada.', 'error');
            }
        });
    } else {
        showMessage('❌ Seu navegador não suporta notificações.', 'error');
    }
}

// Mostrar notificação
function showNotification(title, body) {
    if (notificationsEnabled && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/img/mamy.jpg',
            badge: '/img/mamy.jpg',
            tag: 'birthday-notification',
            requireInteraction: true,
        });
        
        // Reproducir som de notificação
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLjmu1YxBR1+zO3gfCMFl0C3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');
        audio.play().catch(() => {}); // Ignorar erro se não conseguir tocar
        
        return notification;
    }
}

// Função para mostrar mensagens na tela
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    messageDiv.textContent = text;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Atualizar cronômetro
function updateCountdown() {
    const now = new Date().getTime();
    const distance = birthdayDate.getTime() - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Atualizar elementos do cronômetro
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // Se chegou o aniversário
    if (distance <= 0 && !birthdayNotificationSent) {
        birthdayNotificationSent = true;
        
        // Mostrar notificação
        showNotification(
            '🎉 FELIZ ANIVERSÁRIO DONA NILZA! 🎉',
            'Hoje é o dia especial da mamãe mais querida! Que todos os seus sonhos se realizem! 💕'
        );
        
        // Mostrar mensagem na tela
        showMessage('🎂 FELIZ ANIVERSÁRIO DONA NILZA! 🎂 Hoje é seu dia especial!', 'success');
        
        // Iniciar confete
        if (typeof startConfetti === 'function') {
            startConfetti();
        }
        
        // Atualizar cronômetro para mostrar "Hoje é o dia!"
        if (daysEl) daysEl.textContent = '🎂';
        if (hoursEl) hoursEl.textContent = 'HOJE';
        if (minutesEl) minutesEl.textContent = 'É O';
        if (secondsEl) secondsEl.textContent = 'DIA!';
    }
}

// Adicionar botão de notificações
function addNotificationButton() {
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer && !document.getElementById('notification-btn')) {
        const notificationBtn = document.createElement('button');
        notificationBtn.id = 'notification-btn';
        notificationBtn.innerHTML = '🔔 Ativar Notificações';
        notificationBtn.style.cssText = `
            background: linear-gradient(135deg, #e91e63, #ff6b9d);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
            transition: all 0.3s ease;
        `;
        
        notificationBtn.addEventListener('click', () => {
            requestNotificationPermission();
        });
        
        notificationBtn.addEventListener('mouseenter', () => {
            notificationBtn.style.transform = 'translateY(-2px)';
            notificationBtn.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.4)';
        });
        
        notificationBtn.addEventListener('mouseleave', () => {
            notificationBtn.style.transform = 'translateY(0)';
            notificationBtn.style.boxShadow = '0 4px 15px rgba(233, 30, 99, 0.3)';
        });
        
        countdownContainer.appendChild(notificationBtn);
    }
}

// =============================================
// EFEITOS DE PARTÍCULAS FLUTUANTES
// =============================================

function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'floating-particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particlesContainer);
    
    const particles = ['🎈', '🌟', '✨', '💖', '🦋', '🌸'];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}%;
            top: 100%;
            opacity: 0.7;
            animation: float-up ${Math.random() * 10 + 15}s linear infinite;
            pointer-events: none;
        `;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 25000);
    }
    
    // Criar partículas periodicamente
    setInterval(createParticle, 3000);
}

// =============================================
// MODO NOTURNO/DIURNO
// =============================================

function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    `;
    
    let isDarkMode = false;
    
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.body.style.filter = 'invert(0.1) hue-rotate(180deg)';
            themeToggle.innerHTML = '☀️';
            showMessage('🌙 Modo noturno ativado', 'info');
        } else {
            document.body.style.filter = 'none';
            themeToggle.innerHTML = '🌙';
            showMessage('☀️ Modo diurno ativado', 'info');
        }
    });
    
    document.body.appendChild(themeToggle);
}

// =============================================
// GALERIA DE FOTOS COM ZOOM
// =============================================

function setupPhotoZoom() {
    const photos = document.querySelectorAll('.photo-slide img, .timeline-photo img, .hero-photo');
    
    photos.forEach(photo => {
        photo.style.cursor = 'zoom-in';
        
        photo.addEventListener('click', () => {
            createPhotoZoomModal(photo.src, photo.alt);
        });
    });
}

function createPhotoZoomModal(src, alt) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: zoom-out;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: zoom-in 0.3s ease;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
        modal.style.animation = 'zoom-out 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
}

// =============================================
// CONTADOR DE VISITAS E TEMPO ONLINE
// =============================================

function setupVisitCounter() {
    const visitCounter = document.createElement('div');
    visitCounter.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(233, 30, 99, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;
    
    // Contador de visitas
    let visits = localStorage.getItem('nilza-visits') || 0;
    visits++;
    localStorage.setItem('nilza-visits', visits);
    
    // Tempo online
    const startTime = Date.now();
    
    function updateCounter() {
        const timeOnline = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(timeOnline / 60);
        const seconds = timeOnline % 60;
        
        visitCounter.innerHTML = `
            <div>👀 Visitas: ${visits}</div>
            <div>⏰ Online: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
        `;
    }
    
    updateCounter();
    setInterval(updateCounter, 1000);
    
    document.body.appendChild(visitCounter);
}

// =============================================
// MENSAGENS MOTIVACIONAIS ALEATÓRIAS
// =============================================

function setupMotivationalMessages() {
    const messages = [
        "💕 Dona Nilza, você é especial!",
        "🌟 Seu sorriso ilumina o mundo!",
        "🌸 Cada dia com você é uma bênção!",
        "💎 Você é um tesouro precioso!",
        "🦋 Sua bondade toca corações!",
        "🌈 Você traz cor à nossa vida!",
        "⭐ Você é nossa estrela guia!",
        "🌻 Seu amor nos faz crescer!"
    ];
    
    function showMotivationalMessage() {
        const message = messages[Math.floor(Math.random() * messages.length)];
        showMessage(message, 'success');
    }
    
    // Mostrar mensagem a cada 2 minutos
    setInterval(showMotivationalMessage, 120000);
    
    // Primeira mensagem após 30 segundos
    setTimeout(showMotivationalMessage, 30000);
}

// =============================================
// EFEITO DE NEVE SUAVE (PÉTALAS DE ROSA)
// =============================================

function createRosePetalSnow() {
    function createPetal() {
        const petal = document.createElement('div');
        petal.innerHTML = '🌸';
        petal.style.cssText = `
            position: fixed;
            top: -20px;
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 15 + 10}px;
            opacity: ${Math.random() * 0.7 + 0.3};
            pointer-events: none;
            z-index: 1;
            animation: fall-petal ${Math.random() * 10 + 8}s linear infinite;
        `;
        
        document.body.appendChild(petal);
        
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, 18000);
    }
    
    // Criar pétalas ocasionalmente
    setInterval(createPetal, 4000);
}

// =============================================
// EFEITO DE DIGITAÇÃO NO TÍTULO
// =============================================

function typeWriter(element, text, speed = 100) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// =============================================
// ÁRVORE DE DESEJOS INTERATIVA  
// =============================================

function setupWishTree() {
    const wishTree = document.querySelector('.wish-tree');
    if (!wishTree) return;
    
    const wishes = [
        "Saúde e alegria sempre! 💕",
        "Que seus sonhos se realizem! ⭐",
        "Muito amor e felicidade! 💖",
        "Paz e prosperidade! 🌟",
        "Momentos especiais em família! 👨‍👩‍👧‍👦",
        "Sorrisos todos os dias! 😊"
    ];
    
    // Adicionar desejos flutuantes à árvore
    wishes.forEach((wish, index) => {
        setTimeout(() => {
            const wishElement = document.createElement('div');
            wishElement.className = 'floating-wish';
            wishElement.textContent = wish;
            wishElement.style.cssText = `
                position: absolute;
                top: ${Math.random() * 60 + 20}%;
                left: ${Math.random() * 60 + 20}%;
                background: rgba(255, 193, 204, 0.9);
                padding: 8px 12px;
                border-radius: 15px;
                font-size: 12px;
                color: #333;
                opacity: 0;
                transform: scale(0);
                transition: all 0.5s ease;
                cursor: pointer;
                z-index: 10;
            `;
            
            wishTree.appendChild(wishElement);
            
            setTimeout(() => {
                wishElement.style.opacity = '1';
                wishElement.style.transform = 'scale(1)';
            }, 100);
            
            // Fazer o desejo piscar ocasionalmente
            setInterval(() => {
                if (Math.random() < 0.3) {
                    wishElement.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        wishElement.style.transform = 'scale(1)';
                    }, 200);
                }
            }, 5000);
            
        }, index * 1000);
    });
}

// =============================================
// EFEITOS DE FOTO
// =============================================

function setupPhotoEffects() {
    const photos = document.querySelectorAll('.photo-item, .memory-photo');
    
    photos.forEach(photo => {
        photo.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 15px rgba(255, 193, 204, 0.8)';
        });
        
        photo.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// =============================================
// MENSAGENS ESPECIAIS
// =============================================

function setupSpecialMessages() {
    const specialMessages = [
        "Nilza, você ilumina nossas vidas!",
        "Seu amor e carinho são presentes preciosos!",
        "Que este dia seja tão especial quanto você!",
        "Sua bondade toca todos ao seu redor!",
        "O mundo é mais bonito com você nele!",
        "Celebrando você hoje e sempre!"
    ];
    
    const messageContainer = document.createElement('div');
    messageContainer.id = 'special-message';
    messageContainer.style.position = 'fixed';
    messageContainer.style.bottom = '80px';
    messageContainer.style.left = '50%';
    messageContainer.style.transform = 'translateX(-50%)';
    messageContainer.style.backgroundColor = 'rgba(255, 193, 204, 0.9)';
    messageContainer.style.padding = '10px 20px';
    messageContainer.style.borderRadius = '20px';
    messageContainer.style.color = '#333';
    messageContainer.style.fontWeight = 'bold';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.opacity = '0';
    messageContainer.style.transition = 'opacity 0.5s';
    document.body.appendChild(messageContainer);
    
    function showRandomMessage() {
        const randomMessage = specialMessages[Math.floor(Math.random() * specialMessages.length)];
        messageContainer.textContent = randomMessage;
        messageContainer.style.opacity = '1';
        
        setTimeout(() => {
            messageContainer.style.opacity = '0';
        }, 3000);
    }
    
    // Mostrar mensagem a cada 30 segundos
    setInterval(showRandomMessage, 30000);
    
    // Mostrar primeira mensagem após 5 segundos
    setTimeout(showRandomMessage, 5000);
}

// =============================================
// ANIMAÇÃO DE CARDS
// =============================================

function animateCards() {
    const cards = document.querySelectorAll('.message-card, .wish-card, .recipe-card, .timeline-item');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// =============================================
// INICIALIZAÇÃO PRINCIPAL
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site de aniversário da Dona Nilza carregado com sucesso! 🎉❤️');
    
    // Inicializar o cronômetro com notificações
    addNotificationButton();
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Primeira execução imediata
    
    // Solicitar permissão para notificações automaticamente
    setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            showMessage('🔔 Clique no botão "Ativar Notificações" para ser avisado quando chegar o aniversário!', 'info');
        }
    }, 2000);
    
    // Inicializar todas as funcionalidades NOVAS
    setupScrollHeader();
    setupAnimatedFooterIcon();
    setupThemeToggle();
    setupPhotoZoom();
    setupVisitCounter();
    setupMotivationalMessages();
    
    // Efeitos visuais
    setTimeout(() => {
        createFloatingParticles();
        createRosePetalSnow();
    }, 2000);
    
    // Funcionalidades originais
    setupSpecialMessages();
    setupPhotoEffects();
    setupWishTree();
    animateCards();
    
    // Verificar se há JQuery para o carousel
    if (typeof $ !== 'undefined') {
        initializeCarousel();
    } else {
        console.log('JQuery não encontrado - carousel desabilitado');
    }
    
    // Adicionar efeito de entrada suave
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);

    // Efeito de digitação no título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});

// Event listeners para fechar modals
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal.id);
            }
        });
    }
});

console.log('Site de aniversário da Dona Nilza carregado com sucesso! 🎉❤️');