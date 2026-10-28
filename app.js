

document.addEventListener('DOMContentLoaded', () => {


  const state = {
    currentScreen: 'view-home',
    veiculo: {
      placa: 'ABC1D23',
      renavam: '12345678901',
      modelo: 'FIAT ARGO DRIVE 1.0 (2022/2023)'
    },
    debitos: [
      { id: 'licenciamento', nome: 'Licenciamento Anual 2026', valor: 168.60, selecionado: false },
      { id: 'ipva', nome: 'IPVA 2026 - Cota Única', valor: 1250.40, selecionado: false },
      { id: 'multa', nome: 'Multa por Excesso de Velocidade', valor: 195.23, selecionado: false }
    ],
    pix: {
      status: 'pending',
      valor: 168.60,
      countdownSeconds: 899,
      intervalId: null
    },
    moderador: {
      timerSeconds: 0,
      timerRunning: false,
      timerInterval: null
    }
  };


  const screens = document.querySelectorAll('.screen-view');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');


  const btnGotoConsulta = document.getElementById('btn-goto-consulta');
  const navBrand = document.getElementById('nav-brand');
  const navHomeBtn = document.getElementById('nav-home-btn');
  const navVeiculosBtn = document.getElementById('nav-veiculos-btn');
  const breadcrumbButtons = document.querySelectorAll('[data-goto]');


  const formConsulta = document.getElementById('form-consulta-debitos');
  const inputPlaca = document.getElementById('input-placa');
  const inputRenavam = document.getElementById('input-renavam');
  const formErrorAlert = document.getElementById('form-error-alert');
  const formErrorMsg = document.getElementById('form-error-msg');
  const btnBackToHome = document.getElementById('btn-back-to-home');
  const presetIncomplete = document.getElementById('preset-incomplete');
  const presetComplete = document.getElementById('preset-complete');
  const presetClear = document.getElementById('preset-clear');

  const btnOpenHelpRenavam = document.getElementById('btn-open-help-renavam');
  const modalRenavamHelp = document.getElementById('modal-renavam-help');
  const btnCloseModalX = document.getElementById('btn-close-modal-x');
  const btnCloseModalReturn = document.getElementById('btn-close-modal-return');

  const debitosCheckboxes = document.querySelectorAll('.debito-checkbox');
  const summaryItemsCount = document.getElementById('summary-items-count');
  const summaryItemsList = document.getElementById('summary-items-list');
  const summaryTotalVal = document.getElementById('summary-total-val');
  const btnGotoRevisao = document.getElementById('btn-goto-revisao');
  const btnBackToConsulta = document.getElementById('btn-back-to-consulta');


  const revisaoListaDebitos = document.getElementById('revisao-lista-debitos');
  const revisaoTotalVal = document.getElementById('revisao-total-val');
  const btnBackToExtrato = document.getElementById('btn-back-to-extrato');
  const btnGerarPix = document.getElementById('btn-gerar-pix');


  const pixStatePending = document.getElementById('pix-state-pending');
  const pixStateExpired = document.getElementById('pix-state-expired');
  const pixStateConfirmed = document.getElementById('pix-state-confirmed');
  const pixDisplayVal = document.getElementById('pix-display-val');
  const pixCountdown = document.getElementById('pix-countdown');
  const btnCopyPix = document.getElementById('btn-copy-pix');
  const pixCodeInput = document.getElementById('pix-code-input');
  const copyFeedbackMsg = document.getElementById('copy-feedback-msg');
  const btnRenewPix = document.getElementById('btn-renew-pix');
  const btnComprovanteHome = document.getElementById('btn-comprovante-home');
  const compValorPago = document.getElementById('comp-valor-pago');
  const compDataHora = document.getElementById('comp-data-hora');
  const compAuthCode = document.getElementById('comp-auth-code');


  const btnQuickConfirm = document.getElementById('btn-quick-confirm');
  const btnQuickExpire = document.getElementById('btn-quick-expire');
  const btnPixConfirmScreen = document.getElementById('btn-pix-confirm-screen');



  function switchScreen(targetScreenId) {
    screens.forEach(screen => {
      screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(targetScreenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      state.currentScreen = targetScreenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    if (targetScreenId === 'view-home') {
      navHomeBtn.classList.add('active');
      navVeiculosBtn.classList.remove('active');
    } else {
      navHomeBtn.classList.remove('active');
      navVeiculosBtn.classList.add('active');
    }
  }


  function showToast(message, duration = 3500) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }


  if (btnGotoConsulta) {
    btnGotoConsulta.addEventListener('click', () => switchScreen('view-consulta'));
  }
  if (navBrand) {
    navBrand.addEventListener('click', () => switchScreen('view-home'));
  }
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', () => switchScreen('view-home'));
  }
  if (navVeiculosBtn) {
    navVeiculosBtn.addEventListener('click', () => switchScreen('view-home'));
  }

  breadcrumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-goto');
      if (target) switchScreen(target);
    });
  });

  if (btnBackToHome) {
    btnBackToHome.addEventListener('click', () => switchScreen('view-home'));
  }
  if (btnBackToConsulta) {
    btnBackToConsulta.addEventListener('click', () => switchScreen('view-consulta'));
  }
  if (btnBackToExtrato) {
    btnBackToExtrato.addEventListener('click', () => switchScreen('view-extrato'));
  }
  if (btnComprovanteHome) {
    btnComprovanteHome.addEventListener('click', () => switchScreen('view-home'));
  }



  function openHelpModal() {
    modalRenavamHelp.style.display = 'flex';
  }

  function closeHelpModal() {
    modalRenavamHelp.style.display = 'none';
  }

  if (btnOpenHelpRenavam) {
    btnOpenHelpRenavam.addEventListener('click', openHelpModal);
  }
  if (btnCloseModalX) {
    btnCloseModalX.addEventListener('click', closeHelpModal);
  }
  if (btnCloseModalReturn) {
    btnCloseModalReturn.addEventListener('click', closeHelpModal);
  }

  modalRenavamHelp.addEventListener('click', (e) => {
    if (e.target === modalRenavamHelp) {
      closeHelpModal();
    }
  });


  

  function clearFormErrors() {
    formErrorAlert.style.display = 'none';
    inputRenavam.classList.remove('input-error');
  }


  presetIncomplete.addEventListener('click', () => {
    inputPlaca.value = 'ABC1D23';
    inputRenavam.value = '12345';
    clearFormErrors();
    showToast('Campos preenchidos com o Cenário T3 (Incompleto)');
  });


  presetComplete.addEventListener('click', () => {
    inputPlaca.value = 'ABC1D23';
    inputRenavam.value = '12345678901';
    clearFormErrors();
    showToast('Campos preenchidos com o Cenário T3 (Completo / Correto)');
  });


  presetClear.addEventListener('click', () => {
    inputPlaca.value = '';
    inputRenavam.value = '';
    clearFormErrors();
    showToast('Campos limpos');
  });


  inputPlaca.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  });

  inputRenavam.addEventListener('input', (e) => {

    e.target.value = e.target.value.replace(/\D/g, '');
    if (inputRenavam.classList.contains('input-error') && e.target.value.length === 11) {
      clearFormErrors();
    }
  });


  formConsulta.addEventListener('submit', (e) => {
    e.preventDefault();
    const placaVal = inputPlaca.value.trim().toUpperCase();
    const renavamVal = inputRenavam.value.trim();

    if (!placaVal) {
      alert('Por favor, informe a placa do veículo.');
      inputPlaca.focus();
      return;
    }


    if (renavamVal.length < 11) {
      inputRenavam.classList.add('input-error');
      formErrorAlert.style.display = 'flex';
      formErrorMsg.innerHTML = `O Renavam informado (<strong>${renavamVal || 'em branco'}</strong>) possui apenas <strong>${renavamVal.length} dígito(s)</strong>. O Renavam oficial possui exatamente <strong>11 dígitos</strong>. Confira o documento do veículo e tente novamente.`;
      formErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }


    clearFormErrors();
    state.veiculo.placa = placaVal;
    state.veiculo.renavam = renavamVal;


    resetExtratoZerado();


    switchScreen('view-extrato');
  });



  function resetExtratoZerado() {
    debitosCheckboxes.forEach(cb => {
      cb.checked = false;
      const row = cb.closest('.debito-row');
      if (row) row.classList.remove('selected');
    });
    state.debitos.forEach(d => d.selecionado = false);
    recalcDebitos();
  }

  function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function recalcDebitos() {
    let total = 0;
    let selecionados = [];

    debitosCheckboxes.forEach(cb => {
      const row = cb.closest('.debito-row');
      const id = row.getAttribute('data-id');
      const valor = parseFloat(row.getAttribute('data-valor'));
      const nome = row.getAttribute('data-nome');

      const debitoItem = state.debitos.find(d => d.id === id);
      if (debitoItem) {
        debitoItem.selecionado = cb.checked;
      }

      if (cb.checked) {
        row.classList.add('selected');
        total += valor;
        selecionados.push(nome);
      } else {
        row.classList.remove('selected');
      }
    });


    summaryItemsCount.textContent = `${selecionados.length} débito(s)`;
    summaryTotalVal.textContent = formatBRL(total);

    if (selecionados.length === 0) {
      summaryItemsList.textContent = 'Nenhum débito marcado';
      btnGotoRevisao.disabled = true;
      btnGotoRevisao.title = 'Selecione pelo menos um débito para prosseguir';
    } else {
      summaryItemsList.textContent = selecionados.join(' + ');
      btnGotoRevisao.disabled = false;
      btnGotoRevisao.title = '';
    }

    state.pix.valor = total;
  }


  debitosCheckboxes.forEach(cb => {
    cb.addEventListener('change', recalcDebitos);
  });


  btnGotoRevisao.addEventListener('click', () => {
    const itensSelecionados = state.debitos.filter(d => d.selecionado);
    if (itensSelecionados.length === 0) {
      alert('Selecione pelo menos um débito para continuar.');
      return;
    }


    revisaoListaDebitos.innerHTML = '';
    let total = 0;

    itensSelecionados.forEach(item => {
      total += item.valor;
      const li = document.createElement('li');
      li.className = 'review-item';
      li.innerHTML = `
        <span>${item.nome}</span>
        <strong>${formatBRL(item.valor)}</strong>
      `;
      revisaoListaDebitos.appendChild(li);
    });

    revisaoTotalVal.textContent = formatBRL(total);
    switchScreen('view-revisao');
  });



  function setPixState(newState) {
    state.pix.status = newState;
    pixStatePending.style.display = 'none';
    pixStateExpired.style.display = 'none';
    pixStateConfirmed.style.display = 'none';

    if (newState === 'pending') {
      pixStatePending.style.display = 'block';
      pixDisplayVal.textContent = formatBRL(state.pix.valor);
      copyFeedbackMsg.style.display = 'none';
      startPixCountdown();
    } else if (newState === 'expired') {
      pixStateExpired.style.display = 'block';
      stopPixCountdown();
    } else if (newState === 'confirmed') {
      pixStateConfirmed.style.display = 'block';
      stopPixCountdown();


      compValorPago.textContent = formatBRL(state.pix.valor);
      const agora = new Date();
      compDataHora.textContent = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR');
      const randomAuth = 'GO-' + agora.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
      compAuthCode.textContent = randomAuth;
    }
  }

  function startPixCountdown() {
    stopPixCountdown();
    state.pix.countdownSeconds = 899;
    updateTimerText();

    state.pix.intervalId = setInterval(() => {
      state.pix.countdownSeconds--;
      if (state.pix.countdownSeconds <= 0) {
        stopPixCountdown();
        setPixState('expired');
      } else {
        updateTimerText();
      }
    }, 1000);
  }

  function stopPixCountdown() {
    if (state.pix.intervalId) {
      clearInterval(state.pix.intervalId);
      state.pix.intervalId = null;
    }
  }

  function updateTimerText() {
    const mins = Math.floor(state.pix.countdownSeconds / 60);
    const secs = state.pix.countdownSeconds % 60;
    pixCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} min`;
  }


  btnGerarPix.addEventListener('click', () => {
    setPixState('pending');
    switchScreen('view-pix');
  });


  btnCopyPix.addEventListener('click', () => {
    const code = pixCodeInput.value;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    
  
    copyFeedbackMsg.style.display = 'block';
    showToast('✅ Código Pix copiado com sucesso!');
  });


  btnRenewPix.addEventListener('click', () => {

    setPixState('pending');
    showToast('🔄 Novo código Pix gerado com sucesso! Valor mantido.');
  });




  function triggerConfirmAndJump() {
    // Garante valor de Licenciamento (R$ 168,60) se não tiver sido calculado
    if (!state.pix.valor || state.pix.valor === 0) {
      state.pix.valor = 168.60;
    }

    switchScreen('view-pix');
    setPixState('confirmed');
    showToast('✅ Pagamento confirmado com sucesso! Exibindo comprovante.');
  }

  function triggerExpirePix() {
    if (!state.pix.valor || state.pix.valor === 0) {
      state.pix.valor = 168.60;
    }
    switchScreen('view-pix');
    setPixState('expired');
    showToast('⏰ Código Pix expirado!');
  }


  if (btnQuickConfirm) {
    btnQuickConfirm.addEventListener('click', triggerConfirmAndJump);
  }

  if (btnPixConfirmScreen) {
    btnPixConfirmScreen.addEventListener('click', triggerConfirmAndJump);
  }

  if (btnQuickExpire) {
    btnQuickExpire.addEventListener('click', triggerExpirePix);
  }

  resetExtratoZerado();
  switchScreen('view-home');
});
