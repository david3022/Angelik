// Variables globales
let cart = [];
let currentReviewSlide = 0;
const reviewsContainer = document.querySelector('.reviews-container');
const reviewCards = document.querySelectorAll('.review-card');

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar efecto typing
    startTypingEffect();
    
    // Event listeners
    setupEventListeners();
    
    // Inicializar carousel de reseñas
    if (reviewCards.length > 0) {
        setInterval(autoSlideReviews, 5000);
    }
});

// Configurar event listeners
function setupEventListeners() {
    // Menu hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar modal del carrito
    const closeCart = document.querySelector('.close-cart');
    const cartModal = document.getElementById('cartModal');
    
    if (closeCart && cartModal) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
        
        // Cerrar modal al hacer click fuera
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    // Click en icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
    }
}

// Efecto typing para "Velas Calimaya"
function startTypingEffect() {
    const text = "* Velas Calimaya";
    const typingElement = document.getElementById('typing-text');
    let i = 0;
    
    if (!typingElement) return;
    
    typingElement.textContent = '';
    
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        } else {
            // Reiniciar el efecto después de una pausa
            setTimeout(() => {
                i = 0;
                typingElement.textContent = '';
                typeWriter();
            }, 3000);
        }
    }
    
    typeWriter();
}

// Funciones del carrito
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    showAddedToCartMessage(productName);
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartUI();
}

function updateCartQuantity(productName, newQuantity) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productName);
        } else {
            item.quantity = newQuantity;
        }
    }
    updateCartUI();
}

function updateCartUI() {
    // Actualizar contador del carrito
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Actualizar contenido del modal del carrito
    updateCartModal();
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <div>
                    <button onclick="updateCartQuantity('${item.name}', ${item.quantity - 1})" style="margin-right: 10px; padding: 5px 10px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.name}', ${item.quantity + 1})" style="margin-left: 10px; padding: 5px 10px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">+</button>
                    <button onclick="removeFromCart('${item.name}')" style="margin-left: 10px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">🗑️</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    cartTotal.textContent = total.toFixed(2);
}

function showCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        updateCartModal();
        cartModal.style.display = 'block';
    }
}

function showAddedToCartMessage(productName) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #feca57);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    notification.innerHTML = `✅ ${productName} agregado al carrito`;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animar salida y remover
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funciones del carousel de reseñas
function slideReviews(direction) {
    if (reviewCards.length === 0) return;
    
    currentReviewSlide += direction;
    
    if (currentReviewSlide >= reviewCards.length - 2) {
        currentReviewSlide = reviewCards.length - 3;
    }
    if (currentReviewSlide < 0) {
        currentReviewSlide = 0;
    }
    
    const translateX = currentReviewSlide * -320; // 300px width + 20px margin
    if (reviewsContainer) {
        reviewsContainer.style.transform = `translateX(${translateX}px)`;
    }
}

function autoSlideReviews() {
    if (reviewCards.length <= 3) return;
    
    currentReviewSlide++;
    if (currentReviewSlide >= reviewCards.length - 2) {
        currentReviewSlide = 0;
    }
    
    const translateX = currentReviewSlide * -320;
    if (reviewsContainer) {
        reviewsContainer.style.transform = `translateX(${translateX}px)`;
    }
}

// Smooth scrolling para los enlaces del navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto parallax en scroll (opcional)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.2s';
            entry.target.style.animationFillMode = 'both';
            entry.target.style.animation = 'fadeInUp 0.8s ease-out';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.product-card, .guarantee-item, .gif-placeholder');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Añadir keyframes para fadeInUp
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Función para el checkout (placeholder)
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `¡Gracias por tu compra!\n\nTotal: $${total.toFixed(2)}\n\nTe contactaremos pronto para coordinar la entrega.`;
    
    alert(message);
    
    // Limpiar carrito después de la "compra"
    cart = [];
    updateCartUI();
    
    // Cerrar modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Agregar event listener al botón de checkout
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});