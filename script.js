/* ═══════════════════════════════════════════════════════════
   MAXin.ai — Landing Page JavaScript v3
   Auto-typing chat + Google Forms + Mobile optimized
   ═══════════════════════════════════════════════════════════ */

// ── Google Forms Config ─────────────────────────────────────
const GFORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScUhPaQgBKPd-Cif_3keCH-N-XhjCTPHJKHP9Sv3C-mwvpduA/formResponse';
const GFORM_FIELDS = {
    name:     'entry.1166861709',
    phone:    'entry.660977506',
    business: 'entry.447701664', // Cambiado: Este ID es realmente para Tipo de Negocio (Select)
    country:  'entry.801552343'  // Cambiado: Enviamos el País a este input adicional
};

// ── Chat Scenarios: Restaurantes y Sitios de Comida ──
const SCENARIOS = [
    {
        badge: '🇵🇪 Restaurante — Perú',
        bizName: 'El Tablón',
        ventas: 'S/ 5,820',
        messages: [
            { role: 'in', text: 'Hola, buenas tardes! Me pasas la carta porfa? 🍗', time: '12:15' },
            { role: 'out', text: '¡Hola! 🌟 Qué gusto saludarte. Hoy en El Tablón tenemos listos nuestros clásicos para ti:\n\n🍗 Pollo a la Brasa Entero — S/65.00\n🥗 Ensalada Clásica Familiar — S/15.00\n🥤 Chicha de Jora 1L — S/12.00\n\n¿Qué se te antoja hoy para el almuerzo?', time: '12:15' },
            { role: 'in', text: 'Un pollo entero y la chicha de litro', time: '12:16' },
            { role: 'out', text: '¡Excelente elección! 🍽️ Procesando tu pedido:\n\n1x Pollo Entero = S/65.00\n1x Chicha 1L = S/12.00\n\n🧾 Total de tu pedido: S/77.00\n\n📸 Solo envíame tu comprobante Yape o Plin por aquí y lo enviamos al instante 🚀', time: '12:16' },
            { role: 'in', text: '[📸 Foto de comprobante Yape]', time: '12:17' },
            { role: 'out', text: '✅ ¡Pago validado exitosamente!\n🔒 Tu pedido ya está en cocina.\n\nEn un aproximado de 35 minutos llegará a tu casa calentito. ¡Gracias por preferir El Tablón! 👨🍳', time: '12:17' },
        ]
    },
    {
        badge: '🇦🇷 Restaurante — Argentina',
        bizName: 'Club de la Milanesa',
        ventas: '$ 125,500',
        messages: [
            { role: 'in', text: 'Buenas! Quiero pedir para esta noche 🍽️', time: '20:10' },
            { role: 'out', text: '¡Hola! Buenas noches 😊 Bienvenido al Club de la Milanesa.\n\nEstas son nuestras estrellas de hoy:\n🥩 Milanesa Napolitana — $9.500\n🍟 Milanesa a Caballo — $10.200\n🧀 Mila Cheddar Extra — $11.800\n\n¿Con qué te vas a tentar? 😋', time: '20:10' },
            { role: 'in', text: 'Mandame una Napo y una a caballo, porfa! 🤤', time: '20:11' },
            { role: 'out', text: '¡Genial! 🎉 Noté que sos VIP con nosotros, así que te aplico tu descuento automático:\n\n1x Napolitana = $8.500 ⭐\n1x A Caballo = $9.200 ⭐\n\n🧾 Total con beneficio VIP: $17.700\n(Ahorraste $2.000 por ser cliente fiel 💪)\n\n📸 ¡Enviame el comprobante y el delivery sale volando!', time: '20:11' },
            { role: 'in', text: '[📸 Transferencia MercadoPago]', time: '20:12' },
            { role: 'out', text: '✅ ¡Transferencia recibida al instante!\n🔒 Pedido confirmado en sistema.\n\nEn 30 min lo tenés tocando la puerta. ¡Que lo disfrutes! 🇦🇷🔥', time: '20:12' },
        ]
    },
    {
        badge: '🇵🇪 Pollería — Perú',
        bizName: 'Tinajas',
        ventas: 'S/ 4,190',
        messages: [
            { role: 'in', text: 'Hola! Quiero pedir un combo familiar 🍗', time: '19:45' },
            { role: 'out', text: '¡Hola, buenas noches! 😊\n\nEn Tinajas tenemos los mejores combos listos:\n🍗 Combo 1 (Medio Pollo + Papas + Gaseosa) — S/45.00\n🍗 Combo Super (1 Pollo Entero + Papas F) — S/72.00\n🍗 Combo Mega (1.5 Pollos + Chicha 1.5L) — S/95.00\n\n¿Cuál te enviamos para la cena de hoy?', time: '19:45' },
            { role: 'in', text: 'El super, por favor, con ají extra 😋', time: '19:46' },
            { role: 'out', text: '¡Listo! Pedido anotado:\n\n1x Combo Super = S/72.00\n(Incluye ají extra de cortesía)\n\n🧾 Total: S/72.00\nComo eres de nuestros favoritos en el sistema, aplicamos tu envío gratis ⭐\n\n📸 ¡Mándame tu Yape y lo despachamos! 🔥', time: '19:46' },
        ]
    }
];

let currentScenario = 0;
let chatAnimating = false;

// ── Typing simulation engine ────────────────────────────────
function typeText(element, html, speed = 20) {
    return new Promise(resolve => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const plainText = temp.textContent;
        element.innerHTML = '';
        let i = 0;
        function addChar() {
            if (i < plainText.length) {
                element.innerHTML = html;
                element.style.clipPath = `inset(0 ${100 - ((i + 1) / plainText.length * 100)}% 0 0)`;
                i++;
                setTimeout(addChar, speed + Math.random() * 15);
            } else {
                element.style.clipPath = 'none';
                element.innerHTML = html;
                resolve();
            }
        }
        addChar();
    });
}

function showTypingIndicator(show) {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.style.display = show ? 'flex' : 'none';
    const status = document.getElementById('chatStatus');
    if (status) {
        status.textContent = show ? 'escribiendo...' : 'en línea';
        status.style.color = show ? '#00E676' : 'rgba(255,255,255,0.7)';
    }
}

async function addChatBubble(role, text, time) {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role === 'in' ? 'incoming' : 'outgoing'}`;
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(12px) scale(0.95)';
    const htmlText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubble.innerHTML = `<p></p><span class="chat-time">${time}${role === 'out' ? ' ✓✓' : ''}</span>`;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    await new Promise(r => setTimeout(r, 50));
    bubble.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    bubble.style.opacity = '1';
    bubble.style.transform = 'translateY(0) scale(1)';
    const p = bubble.querySelector('p');
    await typeText(p, htmlText, role === 'out' ? 12 : 18);
    container.scrollTop = container.scrollHeight;
}

async function playScenario(scenario) {
    if (chatAnimating) return;
    chatAnimating = true;
    const container = document.getElementById('chatMessages');
    const badge = document.getElementById('scenarioBadge');
    const bizName = document.getElementById('chatBizName');
    const fcVentas = document.getElementById('fcVentas');
    if (!container) return;

    container.style.transition = 'opacity 0.4s ease';
    container.style.opacity = '0';
    await new Promise(r => setTimeout(r, 400));
    container.innerHTML = '';
    container.style.opacity = '1';

    if (badge) {
        badge.style.animation = 'none';
        badge.offsetHeight;
        badge.textContent = scenario.badge;
        badge.style.animation = 'badgePulse 0.5s ease';
    }
    if (bizName) bizName.textContent = scenario.bizName;
    if (fcVentas) fcVentas.textContent = scenario.ventas;

    for (let i = 0; i < scenario.messages.length; i++) {
        const msg = scenario.messages[i];
        if (msg.role === 'out') {
            showTypingIndicator(true);
            await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
            showTypingIndicator(false);
            await new Promise(r => setTimeout(r, 200));
        } else {
            await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
        }
        await addChatBubble(msg.role, msg.text, msg.time);
        await new Promise(r => setTimeout(r, 600));
    }
    chatAnimating = false;
}

async function startChatCycle() {
    while (true) {
        await playScenario(SCENARIOS[currentScenario]);
        await new Promise(r => setTimeout(r, 4000));
        currentScenario = (currentScenario + 1) % SCENARIOS.length;
    }
}
setTimeout(() => startChatCycle(), 1500);

// ── Navbar scroll effect ────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile menu toggle ──────────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active');
});
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
    });
});

// ── Smooth scroll ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Animated counter ────────────────────────────────────────
function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// ── Intersection Observer ───────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.closest('.hero-stats')) animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
    '.pain-card, .feature-card, .step-card, .sec-feature, ' +
    '.testimonial-card, .pricing-card, .dash-mockup, .hero-stats, ' +
    '.security-visual, .guarantee-box'
).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

document.querySelectorAll('.pain-grid, .features-grid, .testimonials-grid, .pricing-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.08}s`;
    });
});

const vs = document.createElement('style');
vs.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(vs);

// ── Form Submission → Google Forms via iframe ────────────────
function submitForm() {
    const name = document.getElementById('ctaName').value.trim();
    const phone = document.getElementById('ctaPhone').value.trim();
    const business = document.getElementById('ctaBusiness').value;
    const country = document.getElementById('ctaCountry').value;

    // Validation
    if (!name) { showToast('⚠️ Por favor ingresa tu nombre', 'warning'); shakeField('ctaName'); return; }
    if (!phone) { showToast('⚠️ Ingresa tu número de WhatsApp', 'warning'); shakeField('ctaPhone'); return; }
    if (!business) { showToast('⚠️ Selecciona tu tipo de negocio', 'warning'); shakeField('ctaBusiness'); return; }
    if (!country) { showToast('⚠️ Selecciona tu país', 'warning'); shakeField('ctaCountry'); return; }

    const btn = document.getElementById('ctaSubmit');
    btn.innerHTML = '<span class="btn-spinner"></span> Enviando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Build Google Forms URL and submit via hidden iframe
    const formData = new URLSearchParams();
    formData.append(GFORM_FIELDS.name, name);
    formData.append(GFORM_FIELDS.phone, phone);
    formData.append(GFORM_FIELDS.business, business);
    formData.append(GFORM_FIELDS.country, country);

    // Create a hidden form and submit to the iframe
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GFORM_URL;
    form.target = 'gformIframe';
    form.style.display = 'none';

    for (const [key, val] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Show success after a short delay
    setTimeout(() => {
        showToast('✅ ¡Registrado! Te contactaremos pronto por WhatsApp 🎉');
        btn.innerHTML = '🎉 ¡Solicitud Enviada!';
        btn.style.background = 'linear-gradient(135deg, #00E676, #00C853)';
        btn.style.opacity = '1';

        // Reset form after 5s
        setTimeout(() => {
            btn.innerHTML = '🚀 Quiero mi vendedor IA GRATIS por 30 días';
            btn.style.background = '';
            btn.disabled = false;
            document.getElementById('ctaName').value = '';
            document.getElementById('ctaPhone').value = '';
            document.getElementById('ctaBusiness').selectedIndex = 0;
            document.getElementById('ctaCountry').selectedIndex = 0;
        }, 5000);
    }, 1500);
}
window.submitForm = submitForm;

// ── Shake animation for invalid fields ──────────────────────
function shakeField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#FF4D6A';
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
        el.style.borderColor = '';
        el.style.animation = '';
    }, 600);
}

// ── Toast Notification ──────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-text').textContent = message;
    toast.querySelector('.toast-icon').textContent = type === 'warning' ? '⚠️' : '✅';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Parallax on glows ───────────────────────────────────────
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const s = window.scrollY;
            document.querySelectorAll('.bg-glow').forEach((g, i) => {
                g.style.transform = `translateY(${s * 0.05 * (i + 1)}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// ── Dashboard chart bar animation ───────────────────────────
const dashObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.bar-fill').forEach(bar => {
                const w = bar.style.width; bar.style.width = '0%';
                setTimeout(() => { bar.style.width = w; }, 300);
            });
            dashObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
const dc = document.querySelector('.dash-chart');
if (dc) dashObs.observe(dc);

console.log('🚀 MAXin.ai Landing v3 loaded — Google Forms integrated');

// ══════════════════════════════════════════════════════════════
//   GEO PRICING — PE: USD · AR: ARS dólar blue en tiempo real
// ══════════════════════════════════════════════════════════════

const PLAN_USD = [100, 150, 250]; // Básico · Presencia · Publicidad

const PLAN_PEN = [50, 100, 300]; // Básico · Presencia · Publicidad (fijo en soles)

function applyPENPricing() {
    PLAN_PEN.forEach((pen, i) => {
        const curEl  = document.getElementById('cur-'  + i);
        const amtEl  = document.getElementById('amt-'  + i);
        const exchEl = document.getElementById('exch-' + i);

        if (curEl)  curEl.textContent  = 'S/';
        if (amtEl)  amtEl.textContent  = pen;
        if (exchEl) exchEl.textContent = '';
    });

    // Actualizar promo inicial a Soles
    document.querySelectorAll('.badge-promo').forEach(el => {
        el.innerHTML = '🎁 1er mes de cortesía (S/ 15)';
    });
    document.querySelectorAll('.btn-promo').forEach(el => {
        el.innerHTML = 'Probar por S/ 15';
    });

    const regionText = document.getElementById('pricingRegionText');
    if (regionText) {
        regionText.textContent = '🇵🇪 Precios en soles peruanos';
    }
}

async function fetchBlueRate() {
    // Fuente primaria: dolarapi.com (refleja dolarhoy.com)
    try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue',
            { signal: AbortSignal.timeout(7000) });
        const data = await res.json();
        if (data && data.venta) return Number(data.venta);
    } catch (_) {}
    // Fallback: bluelytics
    try {
        const res = await fetch('https://api.bluelytics.com.ar/v2/latest',
            { signal: AbortSignal.timeout(7000) });
        const data = await res.json();
        if (data && data.blue && data.blue.value_sell) return Number(data.blue.value_sell);
    } catch (_) {}
    return null;
}

function applyARSPricing(blueRate) {
    const rateRounded = Math.round(blueRate);
    PLAN_USD.forEach((usd, i) => {
        const ars = Math.round((usd * blueRate) / 100) * 100;
        const arsFormatted = new Intl.NumberFormat('es-AR').format(ars);

        const curEl  = document.getElementById('cur-'  + i);
        const amtEl  = document.getElementById('amt-'  + i);
        const exchEl = document.getElementById('exch-' + i);

        if (curEl)  curEl.textContent  = '$';
        if (amtEl)  amtEl.textContent  = arsFormatted;
        if (exchEl) exchEl.textContent = '≈ USD ' + usd + ' | Dólar blue $' + rateRounded;
    });

    const regionText = document.getElementById('pricingRegionText');
    if (regionText) {
        regionText.textContent = '🇦🇷 Precios en pesos argentinos — Dólar blue: $' + rateRounded + ' por USD';
    }
}

async function initGeoPricing() {
    let country = null;
    // Geo primario
    try {
        const res = await fetch('https://ip-api.com/json/?fields=countryCode,status',
            { signal: AbortSignal.timeout(6000) });
        const data = await res.json();
        if (data && data.status === 'success' && typeof data.countryCode === 'string' && data.countryCode.length === 2) {
            country = data.countryCode.toUpperCase();
        }
    } catch (_) {}
    // Geo fallback
    if (!country) {
        try {
            const res = await fetch('https://ipapi.co/country_code/',
                { signal: AbortSignal.timeout(6000) });
            const text = (await res.text()).trim().toUpperCase();
            if (/^[A-Z]{2}$/.test(text)) country = text;
        } catch (_) {}
    }

    console.log('[MAXin] Geo detected:', country);

    if (country === 'AR') {
        const toggle = document.getElementById('geoToggle');
        if(toggle && !toggle.checked) {
            toggle.checked = true;
            toggle.dispatchEvent(new Event('change'));
        } else {
            const rate = await fetchBlueRate();
            if (rate) applyARSPricing(rate);
        }
    } else if (country === 'PE') {
        applyPENPricing();
    }
    // Resto del mundo → mantiene precios en USD que están en el HTML
}

// Geo Toggle Event
const geoToggle = document.getElementById('geoToggle');
const lblPen = document.getElementById('lbl-pen');
const lblArs = document.getElementById('lbl-ars');

if(geoToggle) {
    geoToggle.addEventListener('change', async (e) => {
        if(e.target.checked) {
            // ARS mode
            lblPen.style.color = 'var(--text-muted)'; lblPen.style.fontWeight = 'normal';
            lblArs.style.color = '#3498db'; lblArs.style.fontWeight = 'bold';
            const regionText = document.getElementById('pricingRegionText');
            if(regionText) regionText.textContent = '🇦🇷 Calculando precios en Pesos...';
            let rate = await fetchBlueRate();
            if(!rate) rate = 1100; // fallback
            applyARSPricing(rate);
        } else {
            // PEN mode
            lblArs.style.color = 'var(--text-muted)'; lblArs.style.fontWeight = 'normal';
            lblPen.style.color = 'var(--primary)'; lblPen.style.fontWeight = 'bold';
            const regionText = document.getElementById('pricingRegionText');
            if(regionText) regionText.textContent = '🇵🇪 Precios en soles peruanos';
            applyPENPricing();
        }
    });
}

initGeoPricing();

// ══════════════════════════════════════════════════════════════
// Brand Animation — Slot Machine con <MAXin> final
// ══════════════════════════════════════════════════════════════

const BRAND_WORDS = [
    'El Tablón',
    'Yopo',
    'Tinajas',
    'Club de la Milanesa',
    'Kentucky',
    'La Parolaccia',
    'Kansas',
    'La Bistecca',
    'TGI Fridays',
    'La Estrellita del Sur'
];

function initBrandAnimation() {
    const strip = document.getElementById('brandStrip');
    const spin = document.getElementById('brandSpin');
    const final = document.getElementById('brandFinal');
    if (!strip || !spin || !final) return;

    // Build word strip (repeat for loop effect)
    const allWords = [...BRAND_WORDS, ...BRAND_WORDS, ...BRAND_WORDS];
    allWords.forEach(w => {
        const el = document.createElement('span');
        el.className = 'brand-slot-word';
        el.textContent = w;
        strip.appendChild(el);
    });

    let wordHeight = 0;
    let currentIndex = 0;
    let totalShown = 0;
    const totalToShow = 6;
    let delay = 2000;

    const slotWindow = document.querySelector('.brand-slot-window');
    
    function updateWindowWidth(index) {
        if (!slotWindow) return;
        const words = strip.querySelectorAll('.brand-slot-word');
        if (words[index]) {
            slotWindow.style.width = words[index].getBoundingClientRect().width + 'px';
        }
    }

    function getWordHeight() {
        const first = strip.querySelector('.brand-slot-word');
        return first ? first.offsetHeight : 50;
    }

    // Set initial width
    setTimeout(() => updateWindowWidth(0), 50);

    function spinNext() {
        if (!wordHeight) wordHeight = getWordHeight();
        currentIndex++;
        totalShown++;
        strip.style.transform = `translateY(-${currentIndex * wordHeight}px)`;
        
        updateWindowWidth(currentIndex);

        if (totalShown >= totalToShow - 3) {
            delay += 500; // Slow down a lot near end
        }

        if (totalShown < totalToShow) {
            setTimeout(spinNext, delay);
        } else {
            setTimeout(showFinal, 500);
        }
    }

    function showFinal() {
        spin.classList.add('fade-out');
        const lt = final.querySelector('.bf-lt');
        const gt = final.querySelector('.bf-gt');

        setTimeout(() => {
            final.classList.add('visible');
            setTimeout(() => lt && lt.classList.add('show'), 150);
            setTimeout(() => gt && gt.classList.add('show'), 400);
        }, 350);
    }

    // Start after page load
    setTimeout(spinNext, 800);
}

document.addEventListener('DOMContentLoaded', initBrandAnimation);
