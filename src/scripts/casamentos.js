/* ==========================================================================
   CARMEL EVENTOS — SCRIPTS DA PÁGINA CASAMENTOS
   Clean-Room JS
   ========================================================================== */

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
window.flatpickr = flatpickr;

// --- 1. MÁSCARA E VALIDAÇÃO DO TELEFONE ---
(function() {
  function aplicarMascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 10) {
      return '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7);
    } else if (valor.length > 6) {
      return '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 6) + '-' + valor.slice(6);
    } else if (valor.length > 2) {
      return '(' + valor.slice(0, 2) + ') ' + valor.slice(2);
    }
    return valor;
  }

  function validarTelefone(campo) {
    if (!campo) return false;
    const digitos = campo.value.replace(/\D/g, '');
    return digitos.length === 11 && digitos.charAt(2) === '9';
  }

  function gerenciarMensagemErro(campo, mostrar) {
    const parent = campo.closest('.form-group');
    if (!parent) return;

    let errorSpan = parent.querySelector('.telefone-erro-msg');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'telefone-erro-msg';
      errorSpan.style.color = '#ef4444';
      errorSpan.style.fontSize = '12px';
      errorSpan.style.display = 'block';
      errorSpan.style.marginTop = '4px';
      parent.appendChild(errorSpan);
    }

    if (mostrar) {
      errorSpan.textContent = 'Por favor, insira um celular válido com 11 dígitos (DDD + 9...).';
      campo.style.borderColor = '#ef4444';
    } else {
      errorSpan.textContent = '';
      campo.style.borderColor = '';
    }
  }

  function inicializarValidacaoTelefone() {
    const camposTelefone = document.querySelectorAll('input[name="telefone"]');
    
    camposTelefone.forEach(function(campo) {
      if (campo.dataset.maskAttached) return;

      campo.addEventListener('input', function(e) {
        e.target.value = aplicarMascaraTelefone(e.target.value);
        if (validarTelefone(e.target)) {
          gerenciarMensagemErro(e.target, false);
        }
      });

      const form = campo.closest('form');
      if (form) {
        form.addEventListener('submit', function(e) {
          if (!validarTelefone(campo)) {
            e.preventDefault();
            e.stopPropagation();
            gerenciarMensagemErro(campo, true);
          }
        });
      }

      campo.dataset.maskAttached = 'true';
    });
  }

  document.addEventListener('DOMContentLoaded', inicializarValidacaoTelefone);
  setInterval(inicializarValidacaoTelefone, 1000);
})();

// --- 2. INICIALIZAÇÃO DO FLATPICKR (CALENDÁRIO) ---
function inicializarCalendario() {
  const camposDeData = document.querySelectorAll('input[name="data"]');
  if (camposDeData.length === 0) return;

  const portugueseLocale = {
    weekdays: { 
      shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], 
      longhand: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"] 
    },
    months: { 
      shorthand: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], 
      longhand: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"] 
    },
    firstDayOfWeek: 1,
    rangeSeparator: " até ",
    ordinal: () => "º"
  };

  camposDeData.forEach(function(campo) {
    if (campo._flatpickr) return;
    
    flatpickr(campo, {
      "disableMobile": true,
      "dateFormat": "d/m/Y",
      "locale": portugueseLocale
    });
  });
}

window.addEventListener('load', inicializarCalendario);

const observer = new MutationObserver(function() {
  let timer;
  clearTimeout(timer);
  timer = setTimeout(inicializarCalendario, 200);
});
document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.body, { childList: true, subtree: true });
});

// --- 3. CONTROLE DO CARROSSEL ---
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('.cas-carousel-viewport');
  const prevBtn = document.querySelector('.cas-carousel-btn-prev');
  const nextBtn = document.querySelector('.cas-carousel-btn-next');

  if (viewport && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const slide = viewport.querySelector('.cas-carousel-slide');
      const slideWidth = slide ? slide.offsetWidth : viewport.offsetWidth / 3;
      viewport.scrollTo({ left: viewport.scrollLeft - slideWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      const slide = viewport.querySelector('.cas-carousel-slide');
      const slideWidth = slide ? slide.offsetWidth : viewport.offsetWidth / 3;
      viewport.scrollTo({ left: viewport.scrollLeft + slideWidth, behavior: 'smooth' });
    });
  }
});