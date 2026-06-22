// --- Configurações de Estado e Variáveis Globais ---
let googleSheetsSyncEnabled = localStorage.getItem('googleSheetsSyncEnabled') === 'true';
let googleSheetsWebAppUrl = localStorage.getItem('googleSheetsWebAppUrl') || '';
let syncStatus = 'idle'; // 'idle' | 'syncing' | 'success' | 'error' | 'disabled'
let syncQueue = JSON.parse(localStorage.getItem('sync_queue')) || [];
let isProcessingQueue = false;

let currentUsername = null;
let imagemCadastroBase64 = null;
let currentLanguage = localStorage.getItem('languagePreference') || 'pt'; // Default to Portuguese
let currentFontSize = parseInt(localStorage.getItem('fontSizePreference')) || 100;

let editingExpenseId = null;
let deleteExpenseId = null;
let myChart = null; // Status Chart
let categoryChart = null; // Category Chart

let despesas = JSON.parse(localStorage.getItem('minhas_despesas')) || [];
let mesesDisponiveis = ['Todos'];
let indiceMesAtual = 0;

// --- Dicionário de Traduções (PT, EN, ES) ---
const languageData = {
    'pt': {
        'mainHeader': 'Controle de Despesas Mensais',
        'footerText': 'Todos os direitos reservados a Asaph Summer :)',
        'appTitle': 'Gestão de Despesas Familiares',
        'totalPeriodo': 'Total Período',
        'paid': 'Pagas',
        'upcoming': 'A Vencer',
        'overdue': 'Vencidas',
        'chartTitle': 'Visualização das suas despesas por status',
        'categoryChartTitle': 'Distribuição por Categoria',
        'dataLabel': 'Data',
        'descriptionLabel': 'Descrição',
        'descriptionPlaceholder': 'Ex: Aluguel',
        'valueLabel': 'Valor (R$)',
        'valuePlaceholder': '0,00',
        'statusLabel': 'Status',
        'statusPending': 'Pendente',
        'statusPaid': 'Pago',
        'addBtn': 'Adicionar',
        'filterLabel': 'Filtrar por Mês:',
        'allMonths': 'Todos os Meses',
        'tableHeaderDate': 'Data',
        'tableHeaderDescription': 'Descrição',
        'tableHeaderValue': 'Valor',
        'tableHeaderStatus': 'Status',
        'tableHeaderCategory': 'Categoria',
        'tableHeaderActions': 'Ações',
        'editExpenseTitle': 'Editar Despesa',
        'saveChangesBtn': 'Salvar Alterações',
        'confirmDeleteTitle': 'Confirmar Exclusão',
        'confirmDeleteText': 'Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.',
        'cancelBtn': 'Cancelar',
        'deleteBtn': 'Excluir',
        'confirmLogoutTitle': 'Confirmar Saída',
        'confirmLogoutText': 'Tem certeza que deseja sair da sua conta?',
        'logoutBtn': 'Sair',
        'changeProfilePicTitle': 'Conta do Usuário',
        'confirmPasswordTitle': 'Confirmar Senha',
        'savePhotoBtn': 'Salvar Foto',
        'choosePhotoBtn': 'Alterar Foto',
        'imageIdLabel': 'ID ou URL da Imagem:',
        'imageIdPlaceholder': 'Cole o ID ou URL da imagem...',
        'loadPhotoBtn': 'Carregar',
        'accountUserLabel': 'Usuário:',
        'accountCreatedLabel': 'Criado em:',
        'switchAccountLabel': 'Trocar de Conta:',
        'switchAccountPlaceholder': 'Selecionar usuário...',
        'alertEnterValidId': 'Por favor, insira um ID ou URL de imagem válido.',
        'promptPasswordFor': 'Digite a senha para',
        'loginWelcome': 'Bem-vindo(a)',
        'loginPrompt': 'Faça seu login para começar a fazer as suas despesas',
        'usernameLabel': 'Usuário',
        'passwordLabel': 'Senha',
        'loginBtn': 'Entrar',
        'settingsTitle': 'Configurações',
        'themeLabel': 'Tema:',
        'lightTheme': 'Claro',
        'darkTheme': 'Noturno',
        'textLabel': 'Texto:',
        'languageLabel': 'Idioma:',
        'newUserBtn': 'Novo Usuário',
        'changeLanguageLogin': 'Alterar idioma',
        'btnExportPDF': 'Exportar PDF',
        'logoutSettingsBtn': 'Sair',
        'registerTitle': 'Novo Cadastro',
        'createAccountBtn': 'Criar Conta',
        'alertFillAllFields': 'Por favor, preencha todos os campos corretamente.',
        'alertLoginRequired': 'Você precisa estar logado para alterar a foto de perfil.',
        'alertUserExists': 'Este usuário já existe!',
        'alertUserRegistered': 'Usuário cadastrado com sucesso!',
        'alertInvalidLogin': 'Usuário ou senha incorretos!',
        'tabExpenses': 'Despesas',
        'tabCalculator': 'Calculadora',
        'calculatorError': 'Erro',
        'syncLabel': 'Sincronizar com Google Sheets:',
        'syncEnableText': 'Ativar Sincronização',
        'syncUrlLabel': 'URL do Web App:',
        'syncSuccess': 'Sincronizado com sucesso!',
        'syncError': 'Erro ao sincronizar com Google Sheets.',
        'syncingText': 'Sincronizando...',
        'syncPendingSingle': '1 pendência para sincronizar offline',
        'syncPendingPlural': '{count} pendências para sincronizar offline',
        'categoryLabel': 'Categoria',
        'catFood': 'Alimentação',
        'catTransport': 'Transporte',
        'catHousing': 'Moradia',
        'catLeisure': 'Lazer',
        'catOthers': 'Outros',
        'appearanceSection': 'Aparência e Idioma',
        'addCategoryLabel': 'Gerenciar Categorias',
        'addCategoryBtn': 'Adicionar',
        'newCategoryPlaceholder': 'Nova categoria...',
        'alertCategoryExists': 'Esta categoria já existe!',
        'monthNames': ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    },
    'en': {
        'mainHeader': 'Monthly Expense Control',
        'footerText': 'All rights reserved to Asaph Summer :)',
        'appTitle': 'Family Expense Management',
        'totalPeriodo': 'Total Period',
        'paid': 'Paid',
        'upcoming': 'Upcoming',
        'overdue': 'Overdue',
        'chartTitle': 'Expense Visualization by Status',
        'categoryChartTitle': 'Distribution by Category',
        'dataLabel': 'Date',
        'descriptionLabel': 'Description',
        'descriptionPlaceholder': 'Ex: Rent',
        'valueLabel': 'Value ($)',
        'valuePlaceholder': '0.00',
        'statusLabel': 'Status',
        'statusPending': 'Pending',
        'statusPaid': 'Paid',
        'addBtn': 'Add',
        'filterLabel': 'Filter by Month:',
        'allMonths': 'All Months',
        'tableHeaderDate': 'Date',
        'tableHeaderDescription': 'Description',
        'tableHeaderValue': 'Value',
        'tableHeaderStatus': 'Status',
        'tableHeaderCategory': 'Category',
        'tableHeaderActions': 'Actions',
        'editExpenseTitle': 'Edit Expense',
        'saveChangesBtn': 'Save Changes',
        'confirmDeleteTitle': 'Confirm Deletion',
        'confirmDeleteText': 'Are you sure you want to delete this expense? This action cannot be undone.',
        'cancelBtn': 'Cancel',
        'deleteBtn': 'Delete',
        'confirmLogoutTitle': 'Confirm Logout',
        'confirmLogoutText': 'Are you sure you want to log out of your account?',
        'logoutBtn': 'Logout',
        'changeProfilePicTitle': 'User Account',
        'confirmPasswordTitle': 'Confirm Password',
        'savePhotoBtn': 'Save Photo',
        'choosePhotoBtn': 'Change Photo',
        'imageIdLabel': 'Image ID or URL:',
        'imageIdPlaceholder': 'Paste image ID or URL...',
        'loadPhotoBtn': 'Load',
        'accountUserLabel': 'Username:',
        'accountCreatedLabel': 'Created on:',
        'switchAccountLabel': 'Switch Account:',
        'switchAccountPlaceholder': 'Select user...',
        'alertEnterValidId': 'Please enter a valid image ID or URL.',
        'promptPasswordFor': 'Enter password for',
        'loginWelcome': 'Welcome',
        'loginPrompt': 'Log in to start managing your expenses',
        'usernameLabel': 'Username',
        'passwordLabel': 'Password',
        'loginBtn': 'Login',
        'settingsTitle': 'Settings',
        'themeLabel': 'Theme:',
        'lightTheme': 'Light',
        'darkTheme': 'Dark',
        'textLabel': 'Text:',
        'languageLabel': 'Language:',
        'newUserBtn': 'New User',
        'changeLanguageLogin': 'Change language',
        'btnExportPDF': 'Export PDF',
        'logoutSettingsBtn': 'Logout',
        'registerTitle': 'New Registration',
        'createAccountBtn': 'Create Account',
        'alertFillAllFields': 'Please fill in all fields correctly.',
        'alertLoginRequired': 'You need to be logged in to change your profile picture.',
        'alertUserExists': 'This user already exists!',
        'alertUserRegistered': 'User registered successfully!',
        'alertInvalidLogin': 'Incorrect username or password!',
        'tabExpenses': 'Expenses',
        'tabCalculator': 'Calculator',
        'calculatorError': 'Error',
        'syncLabel': 'Sync with Google Sheets:',
        'syncEnableText': 'Enable Synchronization',
        'syncUrlLabel': 'Web App URL:',
        'syncSuccess': 'Synced successfully!',
        'syncError': 'Error syncing with Google Sheets.',
        'syncingText': 'Syncing...',
        'syncPendingSingle': '1 pending action to sync offline',
        'syncPendingPlural': '{count} pending actions to sync offline',
        'categoryLabel': 'Category',
        'catFood': 'Food',
        'catTransport': 'Transport',
        'catHousing': 'Housing',
        'catLeisure': 'Leisure',
        'catOthers': 'Others',
        'appearanceSection': 'Appearance & Language',
        'addCategoryLabel': 'Manage Categories',
        'addCategoryBtn': 'Add',
        'newCategoryPlaceholder': 'New category...',
        'alertCategoryExists': 'This category already exists!',
        'monthNames': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    'es': {
        'mainHeader': 'Control de Gastos Mensuales',
        'footerText': 'Todos os direitos reservados a Asaph Summer :)',
        'appTitle': 'Gestión de Gastos Familiares',
        'totalPeriodo': 'Total Período',
        'paid': 'Pagadas',
        'upcoming': 'Por Vencer',
        'overdue': 'Vencidas',
        'chartTitle': 'Visualización de sus gastos por estado',
        'categoryChartTitle': 'Distribución por Categoría',
        'dataLabel': 'Fecha',
        'descriptionLabel': 'Descripción',
        'descriptionPlaceholder': 'Ej: Alquiler',
        'valueLabel': 'Valor (€)',
        'valuePlaceholder': '0,00',
        'statusLabel': 'Estado',
        'statusPending': 'Pendiente',
        'statusPaid': 'Pagado',
        'addBtn': 'Añadir',
        'filterLabel': 'Filtrar por Mes:',
        'allMonths': 'Todos los Meses',
        'tableHeaderDate': 'Fecha',
        'tableHeaderDescription': 'Descripción',
        'tableHeaderValue': 'Valor',
        'tableHeaderStatus': 'Estado',
        'tableHeaderCategory': 'Categoría',
        'tableHeaderActions': 'Acciones',
        'editExpenseTitle': 'Editar Gasto',
        'saveChangesBtn': 'Guardar Cambios',
        'confirmDeleteTitle': 'Confirmar Eliminación',
        'confirmDeleteText': '¿Está seguro de que desea eliminar este gasto? Esta ação não pode ser desfeita.',
        'cancelBtn': 'Cancelar',
        'deleteBtn': 'Eliminar',
        'confirmLogoutTitle': 'Confirmar Salida',
        'confirmLogoutText': '¿Está seguro de que desea cerrar sesión en su cuenta?',
        'logoutBtn': 'Salir',
        'changeProfilePicTitle': 'Cuenta de Usuario',
        'confirmPasswordTitle': 'Confirmar Contraseña',
        'savePhotoBtn': 'Guardar Foto',
        'choosePhotoBtn': 'Cambiar Foto',
        'imageIdLabel': 'ID o URL de la Imagen:',
        'imageIdPlaceholder': 'Pegue el ID o URL de la imagen...',
        'loadPhotoBtn': 'Cargar',
        'accountUserLabel': 'Usuario:',
        'accountCreatedLabel': 'Creado el:',
        'switchAccountLabel': 'Cambiar de Cuenta:',
        'switchAccountPlaceholder': 'Seleccionar usuario...',
        'alertEnterValidId': 'Por favor, ingrese un ID o URL de imagen válido.',
        'promptPasswordFor': 'Ingrese la contraseña para',
        'loginWelcome': 'Bienvenido(a)',
        'loginPrompt': 'Inicie sesión para empezar a gestionar sus gastos',
        'usernameLabel': 'Usuario',
        'passwordLabel': 'Contraseña',
        'loginBtn': 'Iniciar Sesión',
        'settingsTitle': 'Configuración',
        'themeLabel': 'Tema:',
        'lightTheme': 'Claro',
        'darkTheme': 'Oscuro',
        'textLabel': 'Texto:',
        'languageLabel': 'Idioma:',
        'newUserBtn': 'Nuevo Usuario',
        'changeLanguageLogin': 'Cambiar idioma',
        'btnExportPDF': 'Exportar PDF',
        'logoutSettingsBtn': 'Salir',
        'registerTitle': 'Nuevo Registro',
        'createAccountBtn': 'Crear Cuenta',
        'alertFillAllFields': 'Por favor, complete todos los campos correctamente.',
        'alertLoginRequired': 'Debe iniciar sesión para cambiar su foto de perfil.',
        'alertUserExists': '¡Este usuario já existe!',
        'alertUserRegistered': '¡Usuario registrado con éxito!',
        'alertInvalidLogin': '¡Usuario o contraseña incorrectos!',
        'tabExpenses': 'Gastos',
        'tabCalculator': 'Calculadora',
        'calculatorError': 'Error',
        'syncLabel': 'Sincronizar con Google Sheets:',
        'syncEnableText': 'Activar Sincronización',
        'syncUrlLabel': 'URL del Web App:',
        'syncSuccess': '¡Sincronizado con éxito!',
        'syncError': 'Error al sincronizar con Google Sheets.',
        'syncingText': 'Sincronizando...',
        'syncPendingSingle': '1 sincronización pendiente offline',
        'syncPendingPlural': '{count} sincronizaciones pendientes offline',
        'categoryLabel': 'Categoría',
        'catFood': 'Alimentación',
        'catTransport': 'Transporte',
        'catHousing': 'Vivienda',
        'catLeisure': 'Ocio',
        'catOthers': 'Otros',
        'appearanceSection': 'Apariencia e Idioma',
        'addCategoryLabel': 'Gestionar Categorías',
        'addCategoryBtn': 'Añadir',
        'newCategoryPlaceholder': 'Nueva categoría...',
        'alertCategoryExists': '¡Esta categoría ya existe!',
        'monthNames': ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    }
};

// --- Funções Auxiliares de Criptografia (SHA-256) ---
async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
        try {
            const msgUint8 = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            console.warn("Web Crypto digest falhou, usando fallback pure JS:", e);
        }
    }
    
    // Fallback SHA-256 (pure JS) para contextos inseguros (ex: HTTP por IP de rede local)
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32-amount));
    }
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';

    var words = [];
    var asciiLength = password[lengthProperty] * 8;
    
    var hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    var k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    var ascii = password + '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return ''; // Apenas caracteres ASCII
        words[i>>2] |= j << (24 - (i % 4) * 8);
    }
    words[words[lengthProperty]] = ((asciiLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiLength|0);
    
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
        var oldHash = hash.slice(0);
        
        for (i = 0; i < 64; i++) {
            var w15 = w[i - 15], w2 = w[i - 2];
            var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
            var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
            w[i] = (i < 16) ? w[i] : (
                w[i - 16] + s0 + w[i - 7] + s1
            ) | 0;

            var a = hash[0], e = hash[4];
            var temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] + w[i];
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
            
            hash = [(temp1 + temp2)|0].concat(hash);
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        var s = (hash[i] >>> 0).toString(16);
        result += ('00000000' + s).slice(-8);
    }
    return result;
}

// --- Compressor de Imagem Canvas (Redimensiona para max 200x200 JPEG) ---
function comprimirImagem(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const max_size = 200;
            let width = img.width;
            let height = img.height;
            
            // Redimensionamento proporcional
            if (width > height) {
                if (width > max_size) {
                    height *= max_size / width;
                    width = max_size;
                }
            } else {
                if (height > max_size) {
                    width *= max_size / height;
                    height = max_size;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Comprime para JPG qualidade 70% (reduz de 3MB para ~12KB)
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// --- Funções Auxiliares de Sincronização Google Sheets ---
function updateSyncStatusVisuals(status) {
    syncStatus = status;
    const container = document.getElementById('syncIndicatorContainer');
    const btn = document.getElementById('syncNowBtn');
    const icon = document.getElementById('syncCloudIcon');
    
    if (!googleSheetsSyncEnabled || !googleSheetsWebAppUrl) {
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    btn.className = ''; // Reset classes
    
    if (status === 'syncing') {
        btn.classList.add('syncing');
        btn.title = languageData[currentLanguage].syncingText;
        icon.innerHTML = `<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`;
    } else if (status === 'error') {
        btn.classList.add('error');
        btn.title = languageData[currentLanguage].syncError;
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>`;
    } else {
        btn.title = languageData[currentLanguage].syncSuccess;
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.48 0-.92.07-1.34.2-1.12-2.5-3.66-4.2-6.66-4.2-3.87 0-7 3.13-7 7 0 .38.04.74.1 1.1A4.5 4.5 0 0 0 5.5 19h12z"></path></svg>`;
    }
}

function updateSyncQueueBadge() {
    const badge = document.getElementById('syncQueueBadge');
    const text = document.getElementById('syncQueueText');
    if (!badge || !text) return;

    if (syncQueue.length > 0) {
        badge.classList.remove('hidden');
        const count = syncQueue.length;
        const template = count === 1 
            ? languageData[currentLanguage].syncPendingSingle
            : languageData[currentLanguage].syncPendingPlural.replace('{count}', count);
        text.innerText = template;
    } else {
        badge.classList.add('hidden');
    }
}

function sincronizarAcao(action, data) {
    // Sempre enfileira a ação primeiro para consistência (modo offline-first)
    syncQueue.push({ action: action, data: data });
    localStorage.setItem('sync_queue', JSON.stringify(syncQueue));
    updateSyncQueueBadge();
    
    // Tenta processar a fila imediatamente
    processarFilaSincronizacao();
}

async function processarFilaSincronizacao() {
    if (isProcessingQueue || !googleSheetsSyncEnabled || !googleSheetsWebAppUrl || syncQueue.length === 0) return;
    isProcessingQueue = true;
    updateSyncStatusVisuals('syncing');
    
    let failed = false;
    while (syncQueue.length > 0 && !failed) {
        const item = syncQueue[0];
        try {
            const res = await fetch(googleSheetsWebAppUrl, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ action: item.action, data: item.data })
            });
            if (!res.ok) throw new Error("Falha na requisição de rede");
            
            const result = await res.json();
            if (result.status !== 'success') throw new Error(result.message);
            
            // Sucesso: remove da fila e salva
            syncQueue.shift();
            localStorage.setItem('sync_queue', JSON.stringify(syncQueue));
            updateSyncQueueBadge();
        } catch (err) {
            console.error("Erro ao sincronizar item da fila:", err);
            failed = true;
        }
    }
    
    isProcessingQueue = false;
    if (failed) {
        updateSyncStatusVisuals('error');
    } else {
        updateSyncStatusVisuals('success');
        // Recarrega os dados para garantir que a ordenação e valores batem com a planilha
        carregarDespesasDaPlanilha();
    }
}

function carregarDespesasDaPlanilha() {
    if (!googleSheetsSyncEnabled || !googleSheetsWebAppUrl || !currentUsername) return;
    
    console.log("Carregando despesas do Google Sheets...");
    updateSyncStatusVisuals('syncing');
    
    const url = `${googleSheetsWebAppUrl}?usuario=${encodeURIComponent(currentUsername)}`;
    
    fetch(url, {
        method: "GET",
        mode: "cors",
        redirect: "follow"
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro na resposta da rede');
        return response.json();
    })
    .then(result => {
        if (result.status === "success") {
            despesas = result.data || [];
            localStorage.setItem('minhas_despesas', JSON.stringify(despesas));
            
            atualizarOpcoesFiltro();
            renderizarTabela();
            calcularSumario();
            
            updateSyncStatusVisuals('success');
            console.log("Despesas sincronizadas com sucesso:", despesas.length);
        } else {
            updateSyncStatusVisuals('error');
            console.error("Erro ao carregar dados do Sheets:", result.message);
        }
    })
    .catch(error => {
        updateSyncStatusVisuals('error');
        console.error("Erro ao buscar despesas da planilha:", error);
    });
}

// --- Funções da Tela de Login e Usuários ---
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.querySelector('.container').classList.add('hidden');
    document.querySelector('.top-right-controls').classList.add('hidden');
    document.title = languageData[currentLanguage].appTitle;
}

function hideLoginScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');
    document.querySelector('.top-right-controls').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function abrirModalCadastro() {
    // Esconde o modal de configurações para evitar sobreposição
    const modalSettings = document.getElementById('modalSettings');
    if (modalSettings) {
        modalSettings.style.display = 'none';
    }

    document.getElementById('modalCadastro').style.display = 'block';
    
    const fileInput = document.getElementById('newProfilePicInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                comprimirImagem(file, function(compressedUrl) {
                    document.getElementById('newProfilePicPreview').src = compressedUrl;
                    imagemCadastroBase64 = compressedUrl;
                });
            }
        });
    }
}

function fecharModalCadastro() {
    document.getElementById('modalCadastro').style.display = 'none';
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newProfilePicInput').value = '';
    document.getElementById('newProfilePicPreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a90e2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0A8.966 8.966 0 0112 20.25a8.966 8.966 0 01-5.982-2.525M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E";
    imagemCadastroBase64 = null;

    // Reabre o modal de configurações se estivesse logado (veio de lá)
    if (currentUsername) {
        document.getElementById('modalSettings').style.display = 'block';
    }
}

async function salvarNovoUsuario() {
    const user = document.getElementById('newUsername').value.trim();
    const pass = document.getElementById('newPassword').value.trim();
    if (!user || !pass) {
        alert(languageData[currentLanguage].alertFillAllFields);
        return;
    }
    let usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
    if (usuarios.find(u => u.username.toLowerCase() === user.toLowerCase())) {
        alert(languageData[currentLanguage].alertUserExists);
        return;
    }
    
    // Calcula Hash da senha para segurança
    const hashedPassword = await hashPassword(pass);
    
    usuarios.push({ 
        username: user, 
        password: hashedPassword,
        profilePic: imagemCadastroBase64,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
    alert(languageData[currentLanguage].alertUserRegistered);
    fecharModalCadastro();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
}

function abrirModalUploadProfilePic() {
    if (!currentUsername) {
        alert(languageData[currentLanguage].alertLoginRequired);
        return;
    }
    
    // Mostra o modal
    document.getElementById('modalUploadProfilePic').style.display = 'block';
    
    // Atualiza nome de usuário na interface do modal
    document.getElementById('accountUsernameText').innerText = currentUsername;
    
    // Busca informações do usuário atual
    let usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
    const userIndex = usuarios.findIndex(u => u.username.toLowerCase() === currentUsername.toLowerCase());
    let usuarioAtual = userIndex !== -1 ? usuarios[userIndex] : null;
    
    // Se o usuário atual não tem a data de criação (ex: usuário legado ou admin antigo), define a data atual e salva
    if (usuarioAtual && !usuarioAtual.createdAt) {
        usuarioAtual.createdAt = new Date().toISOString();
        usuarios[userIndex] = usuarioAtual;
        localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
    }
    
    // Atualiza data de criação na interface
    const dateTextEl = document.getElementById('accountCreatedAtText');
    if (usuarioAtual && usuarioAtual.createdAt) {
        const date = new Date(usuarioAtual.createdAt);
        let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        let locale = 'pt-BR';
        if (currentLanguage === 'en') locale = 'en-US';
        else if (currentLanguage === 'es') locale = 'es-ES';
        
        dateTextEl.innerText = date.toLocaleString(locale, options);
    } else {
        dateTextEl.innerText = 'N/A';
    }
    
    // Carrega foto de perfil no preview
    const profilePicPreview = document.getElementById('profilePicPreview');
    const profilePicData = (usuarioAtual && usuarioAtual.profilePic) || localStorage.getItem(`profile_pic_${currentUsername}`);
    if (profilePicData) {
        profilePicPreview.src = profilePicData;
    } else {
        profilePicPreview.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a90e2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0A8.966 8.966 0 0112 20.25a8.966 8.966 0 01-5.982-2.525M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E";
    }
    
    document.getElementById('uploadProfilePicInput').value = '';
    const idInput = document.getElementById('profilePicIdInput');
    if (idInput) idInput.value = '';
    
    // Carrega opções de trocar de conta
    atualizarSwitchAccountOptions();
}

function fecharModalUploadProfilePic() {
    document.getElementById('modalUploadProfilePic').style.display = 'none';
}

document.getElementById('uploadProfilePicInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        comprimirImagem(file, function(compressedUrl) {
            document.getElementById('profilePicPreview').src = compressedUrl;
        });
    }
});

function salvarFotoDePerfil() {
    const previewSrc = document.getElementById('profilePicPreview').src;
    if (previewSrc && currentUsername) {
        if (!previewSrc.includes("data:image/svg+xml")) {
            localStorage.setItem(`profile_pic_${currentUsername}`, previewSrc);
            
            let usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
            const index = usuarios.findIndex(u => u.username === currentUsername);
            if (index !== -1) {
                usuarios[index].profilePic = previewSrc;
                localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
            }

            const display = document.getElementById('profilePicDisplay');
            const icon = document.getElementById('profilePicDefaultIcon');
            if (display && icon) {
                display.src = previewSrc;
                display.classList.remove('hidden');
                icon.classList.add('hidden');
            }
        }
        fecharModalUploadProfilePic();
    }
}

function carregarFotoPorId() {
    const inputVal = document.getElementById('profilePicIdInput').value.trim();
    if (!inputVal) {
        alert(languageData[currentLanguage].alertEnterValidId || "Por favor, insira um ID ou URL de imagem válido.");
        return;
    }
    
    let targetSrc = inputVal;
    if (!/^https?:\/\//i.test(inputVal) && !/^data:image\//i.test(inputVal)) {
        targetSrc = `https://robohash.org/${encodeURIComponent(inputVal)}.png`;
    }
    
    const preview = document.getElementById('profilePicPreview');
    if (preview) {
        preview.src = targetSrc;
    }
}

function fecharModalLogout() {
    document.getElementById('modalLogout').style.display = 'none';
    const modalSettings = document.getElementById('modalSettings');
    if (modalSettings && currentUsername) {
        modalSettings.style.display = 'block';
    }
}

function logout() {
    const modalSettings = document.getElementById('modalSettings');
    if (modalSettings) {
        modalSettings.style.display = 'none';
    }
    document.getElementById('modalLogout').style.display = 'block';
}

function confirmarLogout() {
    showLoginScreen();
    const modalSettings = document.getElementById('modalSettings');
    if (modalSettings) {
        modalSettings.style.display = 'none';
    }
    document.getElementById('profilePicDisplay').classList.add('hidden');
    document.getElementById('profilePicDefaultIcon').classList.remove('hidden');
    currentUsername = null;
    fecharModalLogout();
}

function formatarDescricao(input) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const valor = input.value;
    
    const formatado = valor.split(' ').map(palavra => {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }).join(' ');

    input.value = formatado;
    input.setSelectionRange(start, end);
}

// --- Funções de Operações com Despesas ---
function atualizarOpcoesFiltro() {
    const valorAtual = document.getElementById('filtroMesAno').value;
    
    const mesesSet = new Set();
    despesas.forEach(d => {
        if (d.data) {
            const parts = d.data.split('-');
            mesesSet.add(`${parts[0]}-${parts[1]}`);
        }
    });

    mesesDisponiveis = ['Todos', ...Array.from(mesesSet).sort().reverse()];
    
    indiceMesAtual = mesesDisponiveis.indexOf(valorAtual);
    if (indiceMesAtual === -1) indiceMesAtual = 0;
    
    atualizarDisplayFiltro();
}

function atualizarDisplayFiltro() {
    const valor = mesesDisponiveis[indiceMesAtual];
    document.getElementById('filtroMesAno').value = valor;
    const label = document.getElementById('labelMesAno');
    const translations = languageData[currentLanguage];

    if (valor === 'Todos') {
        label.innerText = translations.allMonths;
    } else {
        const [ano, mes] = valor.split('-');
        const nomesMeses = translations.monthNames;
        label.innerText = `${nomesMeses[parseInt(mes) - 1]} / ${ano}`;
    }
}

function navegarMes(direcao) {
    indiceMesAtual += direcao;
    if (indiceMesAtual < 0) indiceMesAtual = mesesDisponiveis.length - 1;
    if (indiceMesAtual >= mesesDisponiveis.length) indiceMesAtual = 0;
    
    atualizarDisplayFiltro();
    salvarEAtualizar();
}

function adicionarDespesa() {
    const data = document.getElementById('inputData').value;
    const descricao = document.getElementById('inputDescricao').value;
    const valor = parseFloat(document.getElementById('inputValor').value);
    const status = document.getElementById('inputStatus').value;
    const categoria = document.getElementById('inputCategoria').value;

    if (!data || !descricao || isNaN(valor) || valor <= 0) {
        alert(languageData[currentLanguage].alertFillAllFields);
        return;
    }

    const novaDespesa = {
        id: Date.now(),
        data,
        descricao,
        valor,
        status,
        categoria,
        usuario: currentUsername
    };

    despesas.push(novaDespesa);
    
    const partesData = data.split('-');
    const mesAnoAdicionado = `${partesData[0]}-${partesData[1]}`;
    
    localStorage.setItem('minhas_despesas', JSON.stringify(despesas));
    atualizarOpcoesFiltro();

    indiceMesAtual = mesesDisponiveis.indexOf(mesAnoAdicionado);
    atualizarDisplayFiltro();
    
    salvarEAtualizar();
    limparCampos();

    // Sincroniza em segundo plano via Sync Queue
    if (googleSheetsSyncEnabled && googleSheetsWebAppUrl) {
        sincronizarAcao("add", novaDespesa);
    }
}

function fecharModal() {
    document.getElementById('modalEditar').style.display = 'none';
    editingExpenseId = null;
}

function editarDespesa(id) {
    const despesaParaEditar = despesas.find(d => d.id === id);
    if (despesaParaEditar) {
        editingExpenseId = id;
        document.getElementById('editData').value = despesaParaEditar.data;
        document.getElementById('editDescricao').value = despesaParaEditar.descricao;
        document.getElementById('editValor').value = despesaParaEditar.valor;
        document.getElementById('editStatus').value = despesaParaEditar.status;
        document.getElementById('editCategoria').value = despesaParaEditar.categoria || 'Others';
        
        document.getElementById('modalEditar').style.display = 'block';
    }
}

function salvarEdicao() {
    const data = document.getElementById('editData').value;
    const descricao = document.getElementById('editDescricao').value;
    const valor = parseFloat(document.getElementById('editValor').value);
    const status = document.getElementById('editStatus').value;
    const categoria = document.getElementById('editCategoria').value;

    if (!data || !descricao || isNaN(valor)) {
        alert(languageData[currentLanguage].alertFillAllFields);
        return;
    }

    const index = despesas.findIndex(d => d.id === editingExpenseId);
    if (index !== -1) {
        const despesaEditada = { 
            id: editingExpenseId, 
            data, 
            descricao, 
            valor, 
            status,
            categoria,
            usuario: despesas[index].usuario || currentUsername
        };
        despesas[index] = despesaEditada;
        localStorage.setItem('minhas_despesas', JSON.stringify(despesas));
        atualizarOpcoesFiltro();
        salvarEAtualizar();
        fecharModal();

        // Sincroniza em segundo plano via Sync Queue
        if (googleSheetsSyncEnabled && googleSheetsWebAppUrl) {
            sincronizarAcao("update", despesaEditada);
        }
    }
}

function fecharModalExcluir() {
    document.getElementById('modalExcluir').style.display = 'none';
    deleteExpenseId = null;
}

function removerDespesa(id) {
    deleteExpenseId = id;
    document.getElementById('modalExcluir').style.display = 'block';
}

function confirmarExclusao() {
    if (deleteExpenseId !== null) {
        const idExcluir = deleteExpenseId;
        despesas = despesas.filter(d => d.id !== idExcluir);
        localStorage.setItem('minhas_despesas', JSON.stringify(despesas));
        atualizarOpcoesFiltro();
        salvarEAtualizar();
        fecharModalExcluir();

        // Sincroniza em segundo plano via Sync Queue
        if (googleSheetsSyncEnabled && googleSheetsWebAppUrl) {
            sincronizarAcao("delete", { id: idExcluir });
        }
    }
}

function salvarEAtualizar() {
    renderizarTabela();
    calcularSumario();
}

function formatarMoeda(valor) {
    let locale = 'pt-BR';
    let currency = 'BRL';
    if (currentLanguage === 'en') {
        locale = 'en-US';
        currency = 'USD';
    } else if (currentLanguage === 'es') {
        locale = 'es-ES';
        currency = 'EUR';
    }
    return valor.toLocaleString(locale, { style: 'currency', currency: currency });
}

function obterDespesasFiltradas() {
    const filtroVal = document.getElementById('filtroMesAno').value;
    
    // Filtra pelo usuário logado e pelo filtro de mês/ano
    const despesasUsuario = despesas.filter(d => !d.usuario || d.usuario === currentUsername);
    
    if (!filtroVal || filtroVal === 'Todos') {
        return despesasUsuario;
    }
    return despesasUsuario.filter(d => {
        if (!d.data) return false;
        return d.data.startsWith(filtroVal);
    });
}

function calcularSumario() {
    const hoje = new Date().toISOString().split('T')[0];
    let total = 0, pagas = 0, aVencer = 0, vencidas = 0;
    
    // Categorias dinâmicas para contagem
    let categoriasVal = {};
    obterCategorias().forEach(cat => {
        categoriasVal[cat] = 0;
    });

    const listaFiltrada = obterDespesasFiltradas();

    listaFiltrada.forEach(d => {
        total += d.valor;
        if (d.status === 'Pago') {
            pagas += d.valor;
        } else {
            if (d.data < hoje) {
                vencidas += d.valor;
            } else {
                aVencer += d.valor;
            }
        }
        
        // Acumula por categoria
        const cat = d.categoria || 'Others';
        if (categoriasVal[cat] !== undefined) {
            categoriasVal[cat] += d.valor;
        } else {
            // Se a categoria antiga não existir mais, joga em Others
            if (categoriasVal['Others'] !== undefined) {
                categoriasVal['Others'] += d.valor;
            }
        }
    });

    document.getElementById('totalPeriodo').innerText = formatarMoeda(total);
    document.getElementById('totalPagas').innerText = formatarMoeda(pagas);
    document.getElementById('totalAVencer').innerText = formatarMoeda(aVencer);
    document.getElementById('totalVencidas').innerText = formatarMoeda(vencidas);

    // Atualiza os dois gráficos do dashboard
    renderizarGrafico(pagas, aVencer, vencidas);
    renderizarGraficoCategoria(categoriasVal);
}

// --- Funções de Renderização de Gráficos (Chart.js) ---
function renderizarGrafico(pagas, aVencer, vencidas) {
    const ctx = document.getElementById('despesasChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#eee' : '#666';

    const data = {
        labels: [languageData[currentLanguage].paid, languageData[currentLanguage].upcoming, languageData[currentLanguage].overdue],
        datasets: [{
            label: 'Valor',
            data: [pagas, aVencer, vencidas],
            backgroundColor: [
                'rgba(46, 204, 113, 0.8)',
                'rgba(241, 196, 15, 0.8)',
                'rgba(231, 76, 60, 0.8)'
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(241, 196, 15, 1)',
                'rgba(231, 76, 60, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColor,
                    callback: function(value) {
                        return formatarMoeda(value);
                    }
                }
            },
            x: {
                ticks: { color: textColor }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + formatarMoeda(context.parsed.y);
                    }
                }
            }
        }
    };

    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function renderizarGraficoCategoria(categorias) {
    const ctx = document.getElementById('categoriaChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#eee' : '#666';

    // Cria as labels traduzidas e filtra categorias vazias (para gráfico limpo)
    const labels = [];
    const dataValues = [];
    
    Object.keys(categorias).forEach(cat => {
        if (categorias[cat] > 0) {
            labels.push(languageData[currentLanguage]['cat' + cat] || cat);
            dataValues.push(categorias[cat]);
        }
    });

    // Se não houver despesas, insere uma fatia vazia padrão
    if (dataValues.length === 0) {
        labels.push(languageData[currentLanguage].catOthers);
        dataValues.push(0.01); // Pequeno valor simbólico
    }

    const coresPalette = [
        '#3498db', // Moradia - Azul
        '#2ecc71', // Alimentação - Verde
        '#e67e22', // Transporte - Laranja
        '#9b59b6', // Lazer - Roxo
        '#95a5a6', // Outros - Cinza
        '#1abc9c', // Turquesa
        '#e74c3c', // Vermelho
        '#f1c40f', // Amarelo
        '#34495e', // Slate Escuro
        '#d35400', // Laranja Escuro
        '#7f8c8d'  // Cinza Escuro
    ];
    const coresSelecionadas = dataValues.map((_, idx) => coresPalette[idx % coresPalette.length]);

    const data = {
        labels: labels,
        datasets: [{
            data: dataValues,
            backgroundColor: coresSelecionadas,
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: textColor }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const val = context.raw;
                        return context.label + ': ' + formatarMoeda(val === 0.01 ? 0 : val);
                    }
                }
            }
        }
    };

    if (categoryChart) {
        categoryChart.destroy();
    }
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

function renderizarTabela() {
    const corpo = document.getElementById('listaCorpo');
    corpo.innerHTML = '';

    const listaFiltrada = obterDespesasFiltradas();
    listaFiltrada.sort((a, b) => new Date(a.data) - new Date(b.data));

    listaFiltrada.forEach(d => {
        const tr = document.createElement('tr');
        const catKey = 'cat' + (d.categoria || 'Others');
        const catTraduzida = languageData[currentLanguage][catKey] || d.categoria;

        tr.innerHTML = `
            <td>${d.data.split('-').reverse().join('/')}</td>
            <td>${d.descricao}</td>
            <td>${catTraduzida}</td>
            <td>${formatarMoeda(d.valor)}</td>
            <td style="color: ${d.status === 'Pago' ? 'var(--success)' : 'var(--warning)'}">${d.status === 'Pago' ? languageData[currentLanguage].statusPaid : languageData[currentLanguage].statusPending}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-table btn-edit" onclick="editarDespesa(${d.id})" title="${languageData[currentLanguage].tableHeaderEdit}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                    </button>
                    <button class="btn-table btn-delete" onclick="removerDespesa(${d.id})" title="${languageData[currentLanguage].deleteBtn}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        corpo.appendChild(tr);
    });
}

function limparCampos() {
    document.getElementById('inputData').value = '';
    document.getElementById('inputDescricao').value = '';
    document.getElementById('inputValor').value = '';
}

// --- Lógica da Calculadora ---
let calcValue = '0';
let calcPendingExpr = '';

function updateCalcDisplay() {
    document.getElementById('calcDisplay').innerText = calcValue;
}

function calcNum(num) {
    if (calcValue === '0' && num !== '.') {
        calcValue = num;
    } else {
        if (num === '.' && calcValue.includes('.')) return;
        calcValue += num;
    }
    updateCalcDisplay();
}

function calcOp(op) {
    calcPendingExpr = calcValue + ' ' + op + ' ';
    calcValue = '0';
    updateCalcDisplay();
}

function calcCalculate() {
    try {
        const result = eval(calcPendingExpr + calcValue);
        calcValue = String(Number(result.toFixed(8))); // Evita dízimas longas
        calcPendingExpr = '';
        updateCalcDisplay();
    } catch (e) {
        calcValue = languageData[currentLanguage].calculatorError;
        updateCalcDisplay();
        setTimeout(calcClear, 1000);
    }
}

function calcClear() {
    calcValue = '0';
    calcPendingExpr = '';
    updateCalcDisplay();
}

// Envia o valor atual da calculadora para o formulário de despesa
function usarValorCalculadora() {
    const valor = parseFloat(calcValue);
    if (isNaN(valor) || valor <= 0) return;
    
    const modalEditar = document.getElementById('modalEditar');
    if (modalEditar && modalEditar.style.display === 'block') {
        document.getElementById('editValor').value = valor.toFixed(2);
    } else {
        document.getElementById('inputValor').value = valor.toFixed(2);
    }
    
    // Troca para a aba de despesas
    const tabDespesasBtn = document.querySelector('.tab-btn[onclick*="despesas"]');
    if (tabDespesasBtn) {
        switchTab('despesas', tabDespesasBtn);
    }
}

// --- Funções de Exportação e Idiomas ---
function exportarPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("Erro: Biblioteca PDF não carregada.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const translations = languageData[currentLanguage];
    const filtroTexto = document.getElementById('labelMesAno').innerText;

    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text(translations.appTitle, 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`${translations.filterLabel} ${filtroTexto}`, 14, 30);

    const listaFiltrada = obterDespesasFiltradas();
    listaFiltrada.sort((a, b) => new Date(a.data) - new Date(b.data));

    const tableRows = listaFiltrada.map(d => {
        const catKey = 'cat' + (d.categoria || 'Others');
        const catTraduzida = translations[catKey] || d.categoria;
        return [
            d.data.split('-').reverse().join('/'),
            d.descricao,
            catTraduzida,
            formatarMoeda(d.valor),
            d.status === 'Pago' ? translations.statusPaid : translations.statusPending
        ];
    });

    doc.autoTable({
        head: [[
            translations.tableHeaderDate,
            translations.tableHeaderDescription,
            translations.tableHeaderCategory,
            translations.tableHeaderValue,
            translations.tableHeaderStatus
        ]],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] }
    });

    doc.save(`Despesas_${filtroTexto.replace(/[\s/]/g, '_')}.pdf`);
}

function switchTab(tabName, btn) {
    document.getElementById('tabDespesas').classList.toggle('hidden', tabName !== 'despesas');
    document.getElementById('tabCalculadora').classList.toggle('hidden', tabName !== 'calculadora');
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('languagePreference', lang);

    const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    const settingsRadio = document.getElementById(`lang${capitalizedLang}Radio`);
    const loginRadio = document.getElementById(`loginLang${capitalizedLang}Radio`);
    if (settingsRadio) settingsRadio.checked = true;
    if (loginRadio) loginRadio.checked = true;

    const translations = languageData[lang];

    // Atualiza elementos com chaves de tradução
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[key]) {
            el.innerText = translations[key];
        }
    });

    document.querySelectorAll('[data-lang-placeholder-key]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder-key');
        if (translations[key]) {
            el.placeholder = translations[key];
        }
    });

    document.title = translations.appTitle;
    document.getElementById('totalPeriodo').previousElementSibling.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-18a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM13 8h-2v6h2V8zm-1-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1z"/></svg>${translations.totalPeriodo}`;
    document.getElementById('totalPagas').previousElementSibling.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>${translations.paid}`;
    document.getElementById('totalAVencer').previousElementSibling.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a0.75 0.75 0 0 0-1.5 0v6c0 0.414 0.336 0.75 0.75h4.5a0.75 0.75 0 0 0 0 -1.5h-3.75V6z" clip-rule="evenodd" /></svg>${translations.upcoming}`;
    document.getElementById('totalVencidas').previousElementSibling.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>${translations.overdue}`;
    
    document.querySelector('.chart-card:nth-child(1) h2').innerText = translations.chartTitle;
    document.querySelector('.chart-card:nth-child(2) h2').innerText = translations.categoryChartTitle;
    
    document.getElementById('inputStatus').options[0].innerText = translations.statusPending;
    document.getElementById('inputStatus').options[1].innerText = translations.statusPaid;
    
    // Traduz opções do dropdown de Categorias
    atualizarDropdownsCategorias();

    // Traduz cabeçalhos da tabela
    const ths = document.querySelectorAll('#tabelaDespesas thead tr th');
    if (ths.length >= 6) {
        ths[0].innerText = translations.tableHeaderDate;
        ths[1].innerText = translations.tableHeaderDescription;
        ths[2].innerText = translations.tableHeaderCategory;
        ths[3].innerText = translations.tableHeaderValue;
        ths[4].innerText = translations.tableHeaderStatus;
        ths[5].innerText = translations.tableHeaderActions;
    }

    document.getElementById('editStatus').options[0].innerText = translations.statusPending;
    document.getElementById('editStatus').options[1].innerText = translations.statusPaid;

    if (myChart) {
        myChart.data.labels = [translations.paid, translations.upcoming, translations.overdue];
        myChart.update();
    }

    renderizarTabela();
    atualizarDisplayFiltro();
    calcularSumario();
    updateSyncQueueBadge();
    
    if (typeof updateSyncStatusVisuals === 'function') {
        updateSyncStatusVisuals(syncStatus);
    }
}

// --- Temas e Ajuste de Fontes ---
const styleElement = document.createElement('style');
styleElement.id = 'darkModeStyles';
document.head.appendChild(styleElement);

function updateDarkModeStyles(isDarkMode) {
    let styles = '';
    if (isDarkMode) {
        styles = `
            body {
                background-color: #333;
                color: #eee;
                --success: #4ade80;
            }
            .card, .form-container, .chart-card, table, .modal-content, .settings-panel, .login-card, .filter-container, .calc-container {
                background-color: #444;
                color: #eee;
            }
            h1, h2, .card h3, .settings-panel label, .filter-container label, footer, .chart-card h2 {
                color: #eee;
            }
            th {
                background-color: #555;
                color: #eee;
            }
            input, select {
                background-color: #555;
                color: #eee;
                border-color: #666;
            }
            input::placeholder {
                color: #bbb;
            }
            button {
                background-color: var(--primary);
                color: white;
            }
            .btn-table {
                color: #eee;
            }
            .btn-edit { color: var(--primary); }
            .btn-delete { color: var(--danger); }
            .settings-panel {
                box-shadow: 0 2px 10px rgba(0,0,0,0.4);
            }
            .settings-panel .divider {
                border-color: #666;
            }
            .categories-list-container {
                background-color: #333 !important;
                border-color: #555 !important;
            }
            .category-item {
                border-color: #555 !important;
            }
            .login-screen {
                background-color: #333;
            }
            .login-card .welcome-text,
            .login-card .login-prompt {
                color: #eee;
            }
            .login-card input[type="text"],
            .login-card input[type="password"] {
                background-color: #555;
                color: #eee;
                border-color: #666;
            }
            .tab-btn {
                background-color: #555;
                color: #eee;
            }
            .tab-btn.active {
                background-color: var(--primary);
            }
            .toggle-password-btn {
                color: #bbb !important;
            }
            .language-selection-login {
                color: #bbb;
            }
            .login-card input::placeholder {
                color: #bbb;
            }
        `;
    }
    styleElement.innerHTML = styles;
}

const darkModeRadio = document.getElementById('darkModeRadio');
const lightModeRadio = document.getElementById('lightModeRadio');

function applyTheme(theme) {
    const isDarkMode = (theme === 'dark');
    document.body.classList.toggle('dark-mode', isDarkMode);
    updateDarkModeStyles(isDarkMode);
    calcularSumario();

    if (darkModeRadio) darkModeRadio.checked = isDarkMode;
    if (lightModeRadio) lightModeRadio.checked = !isDarkMode;
    localStorage.setItem('themePreference', theme);
}

if (darkModeRadio) darkModeRadio.addEventListener('change', () => applyTheme('dark'));
if (lightModeRadio) lightModeRadio.addEventListener('change', () => applyTheme('light'));

function applyFontSize(size) {
    document.documentElement.style.fontSize = size + '%';
    const display = document.getElementById('fontSizeDisplay');
    if (display) display.innerText = size + '%';
    localStorage.setItem('fontSizePreference', size);
}

function changeFontSize(delta) {
    currentFontSize = Math.max(80, Math.min(140, currentFontSize + (delta * 10)));
    applyFontSize(currentFontSize);
}

// --- Configurações dos Usuários na Nuvem (Sheets) ---
function carregarUsuariosDaPlanilha() {
    if (!googleSheetsSyncEnabled || !googleSheetsWebAppUrl) return;

    fetch(`${googleSheetsWebAppUrl}?action=obterUsuarios`)
        .then(res => {
            if (!res.ok) throw new Error("Erro de rede");
            return res.json();
        })
        .then(usuariosPlanilha => {
            if (usuariosPlanilha && usuariosPlanilha.length > 0) {
                let usuariosLocais = JSON.parse(localStorage.getItem('app_usuarios')) || [];
                
                usuariosPlanilha.forEach(uPlanilha => {
                    if (!usuariosLocais.some(uLocal => uLocal.username.toLowerCase() === uPlanilha.username.toLowerCase())) {
                        usuariosLocais.push(uPlanilha);
                    }
                });
                
                localStorage.setItem('app_usuarios', JSON.stringify(usuariosLocais));
            }
        })
        .catch(err => console.error("Erro ao sincronizar usuários do Sheets:", err));
}

// --- Inicialização do Aplicativo ---
document.addEventListener('DOMContentLoaded', () => {
    // Garante que existe pelo menos o usuário default 'admin'
    let usuariosDefault = JSON.parse(localStorage.getItem('app_usuarios')) || [];
    if (!usuariosDefault.some(u => u.username.toLowerCase() === 'admin')) {
        hashPassword('admin').then(hashedDefault => {
            usuariosDefault.push({
                username: 'admin',
                password: hashedDefault,
                profilePic: null,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('app_usuarios', JSON.stringify(usuariosDefault));
            console.log("Usuário default 'admin' cadastrado com sucesso!");
        });
    }

    // Configura o tema salvo
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light');
    }
    applyFontSize(currentFontSize);

    // Idioma
    const savedLanguage = localStorage.getItem('languagePreference');
    const langPtRadio = document.getElementById('langPtRadio');
    const langEnRadio = document.getElementById('langEnRadio');
    const langEsRadio = document.getElementById('langEsRadio');
    
    if (savedLanguage === 'en') {
        if (langEnRadio) langEnRadio.checked = true;
    } else if (savedLanguage === 'es') {
        if (langEsRadio) langEsRadio.checked = true;
    } else {
        if (langPtRadio) langPtRadio.checked = true;
    }
    applyLanguage(savedLanguage || 'pt');

    // Idioma na Login
    const loginLangPtRadio = document.getElementById('loginLangPtRadio');
    const loginLangEnRadio = document.getElementById('loginLangEnRadio');
    const loginLangEsRadio = document.getElementById('loginLangEsRadio');

    if (savedLanguage === 'pt') {
        if (loginLangPtRadio) loginLangPtRadio.checked = true;
    } else if (savedLanguage === 'en') {
        if (loginLangEnRadio) loginLangEnRadio.checked = true;
    } else if (savedLanguage === 'es') {
        if (loginLangEsRadio) loginLangEsRadio.checked = true;
    }

    if (langPtRadio) langPtRadio.addEventListener('change', () => applyLanguage('pt'));
    if (langEnRadio) langEnRadio.addEventListener('change', () => applyLanguage('en'));
    if (langEsRadio) langEsRadio.addEventListener('change', () => applyLanguage('es'));
    if (loginLangPtRadio) loginLangPtRadio.addEventListener('change', () => applyLanguage('pt'));
    if (loginLangEnRadio) loginLangEnRadio.addEventListener('change', () => applyLanguage('en'));
    if (loginLangEsRadio) loginLangEsRadio.addEventListener('change', () => applyLanguage('es'));

    // Configurações do Google Sheets
    const syncCheckbox = document.getElementById('syncEnabledCheckbox');
    const syncUrlInput = document.getElementById('syncUrlInput');
    const syncConfigContainer = document.getElementById('syncConfigContainer');
    
    if (syncCheckbox) syncCheckbox.checked = googleSheetsSyncEnabled;
    if (syncUrlInput) syncUrlInput.value = googleSheetsWebAppUrl;
    if (syncConfigContainer) syncConfigContainer.style.display = googleSheetsSyncEnabled ? 'flex' : 'none';
    
    if (syncCheckbox) {
        syncCheckbox.addEventListener('change', (e) => {
            googleSheetsSyncEnabled = e.target.checked;
            localStorage.setItem('googleSheetsSyncEnabled', googleSheetsSyncEnabled);
            syncConfigContainer.style.display = googleSheetsSyncEnabled ? 'flex' : 'none';
            updateSyncStatusVisuals('idle');
            
            if (googleSheetsSyncEnabled && googleSheetsWebAppUrl && currentUsername) {
                carregarDespesasDaPlanilha();
                processarFilaSincronizacao();
            }
        });
    }
    
    if (syncUrlInput) {
        syncUrlInput.addEventListener('input', (e) => {
            googleSheetsWebAppUrl = e.target.value.trim();
            localStorage.setItem('googleSheetsWebAppUrl', googleSheetsWebAppUrl);
            updateSyncStatusVisuals('idle');
        });
    }

    // Inicializa botão de abrir Configurações (Modal)
    document.getElementById('openSettingsBtn').addEventListener('click', function(event) {
        abrirModalSettings();
        event.stopPropagation();
    });

    // Puxa usuários da nuvem no início
    carregarUsuariosDaPlanilha();

    updateSyncStatusVisuals('idle');
    updateSyncQueueBadge();

    showLoginScreen();

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const user = document.getElementById('username').value.trim();
            const pass = document.getElementById('password').value.trim();
            let usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
            
            // Calcula o hash da senha digitada
            const hashedPassword = await hashPassword(pass);
            
            // Verifica com hash
            let usuarioValido = usuarios.find(u => u.username.toLowerCase() === user.toLowerCase() && u.password === hashedPassword);
            
            if (!usuarioValido) {
                // Fallback para verificar se havia senha antiga em texto puro (migração automática)
                const legacyUserIdx = usuarios.findIndex(u => u.username.toLowerCase() === user.toLowerCase() && u.password === pass);
                if (legacyUserIdx !== -1) {
                    usuarios[legacyUserIdx].password = hashedPassword;
                    localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
                    usuarioValido = usuarios[legacyUserIdx];
                    console.log("Senha legada migrada com sucesso!");
                }
            }

            if (usuarioValido) {
                currentUsername = usuarioValido.username;
                hideLoginScreen();
                
                atualizarOpcoesFiltro();
                
                const hoje = new Date();
                const mesCorrente = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
                
                const indexMesCorrente = mesesDisponiveis.indexOf(mesCorrente);
                if (indexMesCorrente !== -1) {
                    indiceMesAtual = indexMesCorrente;
                    atualizarDisplayFiltro();
                }

                // Carrega dados
                if (googleSheetsSyncEnabled && googleSheetsWebAppUrl) {
                    carregarDespesasDaPlanilha();
                    processarFilaSincronizacao();
                } else {
                    renderizarTabela();
                    calcularSumario();
                }

                // Foto de perfil do topo
                const display = document.getElementById('profilePicDisplay');
                const icon = document.getElementById('profilePicDefaultIcon');
                if (display && icon) {
                    if (usuarioValido.profilePic) {
                        display.src = usuarioValido.profilePic;
                        display.classList.remove('hidden');
                        icon.classList.add('hidden');
                    } else {
                        display.classList.add('hidden');
                        icon.classList.remove('hidden');
                    }
                }
            } else {
                alert(languageData[currentLanguage].alertInvalidLogin);
            }
        });
    }
});

// Fila Offline auto-sync quando a conexão retornar
window.addEventListener('online', () => {
    console.log("Conexão de rede reestabelecida. Sincronizando pendências...");
    processarFilaSincronizacao();
});

// --- Funções de Categoria Customizada ---
function obterCategorias() {
    let categorias = JSON.parse(localStorage.getItem('app_categorias'));
    if (!categorias || categorias.length === 0) {
        categorias = ['Food', 'Transport', 'Housing', 'Leisure', 'Others'];
        localStorage.setItem('app_categorias', JSON.stringify(categorias));
    }
    return categorias;
}

function atualizarDropdownsCategorias() {
    const categorias = obterCategorias();
    const selects = [document.getElementById('inputCategoria'), document.getElementById('editCategoria')];
    
    selects.forEach(sel => {
        if (!sel) return;
        const valorSelecionado = sel.value;
        sel.innerHTML = '';
        
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            
            const translations = languageData[currentLanguage];
            const catKey = 'cat' + cat;
            opt.innerText = translations[catKey] || cat;
            
            sel.appendChild(opt);
        });
        
        if (valorSelecionado && categorias.includes(valorSelecionado)) {
            sel.value = valorSelecionado;
        } else if (sel.id === 'inputCategoria') {
            sel.value = 'Others';
        }
    });
}

function renderizarListaCategorias() {
    const container = document.getElementById('categoriesListContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const categorias = obterCategorias();
    const translations = languageData[currentLanguage];
    
    categorias.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        
        const catKey = 'cat' + cat;
        const catName = translations[catKey] || cat;
        
        const span = document.createElement('span');
        span.innerText = catName;
        div.appendChild(span);
        
        // As 5 categorias iniciais não podem ser deletadas para manter integridade
        const defaultCats = ['Food', 'Transport', 'Housing', 'Leisure', 'Others'];
        if (!defaultCats.includes(cat)) {
            const delBtn = document.createElement('button');
            delBtn.className = 'btn-delete-category';
            delBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                </svg>
            `;
            delBtn.onclick = function() {
                removerCategoria(cat);
            };
            div.appendChild(delBtn);
        }
        
        container.appendChild(div);
    });
}

function adicionarNovaCategoria() {
    const input = document.getElementById('newCategoryInput');
    if (!input) return;
    
    const novaCat = input.value.trim();
    if (!novaCat) return;
    
    let categorias = obterCategorias();
    
    // Evita duplicados (case-insensitive)
    if (categorias.some(c => c.toLowerCase() === novaCat.toLowerCase())) {
        alert(languageData[currentLanguage].alertCategoryExists || "Esta categoria já existe!");
        return;
    }
    
    categorias.push(novaCat);
    localStorage.setItem('app_categorias', JSON.stringify(categorias));
    
    input.value = '';
    renderizarListaCategorias();
    atualizarDropdownsCategorias();
    calcularSumario();
}

function removerCategoria(cat) {
    let categorias = obterCategorias();
    categorias = categorias.filter(c => c !== cat);
    localStorage.setItem('app_categorias', JSON.stringify(categorias));
    
    renderizarListaCategorias();
    atualizarDropdownsCategorias();
    calcularSumario();
}

function abrirModalSettings() {
    document.getElementById('modalSettings').style.display = 'block';
    renderizarListaCategorias();
}

function fecharModalSettings() {
    document.getElementById('modalSettings').style.display = 'none';
}

// --- Funções de Troca de Conta no Modal de Usuário ---
function atualizarSwitchAccountOptions() {
    const select = document.getElementById('switchAccountSelect');
    if (!select) return;
    
    select.innerHTML = '';
    
    // Adiciona a opção placeholder padrão
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.innerText = languageData[currentLanguage].switchAccountPlaceholder || "Selecionar usuário...";
    select.appendChild(placeholder);
    
    let usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
    // Filtra outros usuários (exclui o atual)
    const outrosUsuarios = usuarios.filter(u => u.username.toLowerCase() !== currentUsername.toLowerCase());
    
    outrosUsuarios.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.username;
        opt.innerText = u.username;
        select.appendChild(opt);
    });
}

let switchTargetUsername = null;

function trocarDeConta(username) {
    if (!username) return;
    
    switchTargetUsername = username;
    const translations = languageData[currentLanguage];
    const passwordPromptText = (translations.promptPasswordFor || "Digite a senha para") + " " + username + ":";
    
    const promptTextEl = document.getElementById('confirmPasswordPromptText');
    if (promptTextEl) promptTextEl.innerText = passwordPromptText;
    
    // Limpa campo de senha
    const passInput = document.getElementById('switchPasswordInput');
    if (passInput) {
        passInput.value = '';
        passInput.type = 'password';
    }
    
    // Reseta o olho
    const eyeIcon = document.getElementById('switchEyeIcon');
    if (eyeIcon) {
        eyeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #666; display: block; margin: auto;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
    
    // Oculta modal de conta temporariamente
    const modalUploadProfilePic = document.getElementById('modalUploadProfilePic');
    if (modalUploadProfilePic) modalUploadProfilePic.style.display = 'none';
    
    // Abre o modal de confirmação de senha
    const modalConfirm = document.getElementById('modalConfirmSwitchPassword');
    if (modalConfirm) modalConfirm.style.display = 'block';
}

function fecharModalConfirmSwitchPassword() {
    const modalConfirm = document.getElementById('modalConfirmSwitchPassword');
    if (modalConfirm) modalConfirm.style.display = 'none';
    
    // Reseta o select
    const select = document.getElementById('switchAccountSelect');
    if (select) select.value = '';
    
    // Mostra de volta o modal de conta
    const modalUploadProfilePic = document.getElementById('modalUploadProfilePic');
    if (modalUploadProfilePic) modalUploadProfilePic.style.display = 'block';
    
    switchTargetUsername = null;
}

async function confirmarTrocaDeConta() {
    if (!switchTargetUsername) return;
    
    const passInput = document.getElementById('switchPasswordInput');
    const pass = passInput ? passInput.value.trim() : '';
    const translations = languageData[currentLanguage];
    
    let usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
    const targetUser = usuarios.find(u => u.username.toLowerCase() === switchTargetUsername.toLowerCase());
    
    if (targetUser) {
        const hashedPassword = await hashPassword(pass);
        if (targetUser.password === hashedPassword) {
            // Sucesso! Troca de usuário
            currentUsername = targetUser.username;
            
            // Fecha modal de senha
            const modalConfirm = document.getElementById('modalConfirmSwitchPassword');
            if (modalConfirm) modalConfirm.style.display = 'none';
            
            // Atualiza interface com novo usuário
            atualizarOpcoesFiltro();
            
            // Recarrega as despesas do novo usuário
            if (googleSheetsSyncEnabled && googleSheetsWebAppUrl) {
                carregarDespesasDaPlanilha();
                processarFilaSincronizacao();
            } else {
                renderizarTabela();
                calcularSumario();
            }
            
            // Atualiza foto de perfil do topo
            const display = document.getElementById('profilePicDisplay');
            const icon = document.getElementById('profilePicDefaultIcon');
            if (display && icon) {
                if (targetUser.profilePic) {
                    display.src = targetUser.profilePic;
                    display.classList.remove('hidden');
                    icon.classList.add('hidden');
                } else {
                    display.classList.add('hidden');
                    icon.classList.remove('hidden');
                }
            }
            
            alert(translations.loginWelcome + ", " + currentUsername + "!");
            switchTargetUsername = null;
        } else {
            alert(translations.alertInvalidLogin);
            if (passInput) passInput.value = '';
        }
    }
}

function toggleSwitchPasswordVisibility() {
    const passwordInput = document.getElementById('switchPasswordInput');
    const eyeIcon = document.getElementById('switchEyeIcon');
    if (!passwordInput || !eyeIcon) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
}
