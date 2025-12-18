class AdminPanel {
    constructor() {
        this.isLoggedIn = false;
        this.currentEditIndex = -1;
        this.adminCredentials = {
            username: 'admin',
            password: 'admin123'
        };
        this.settings = {
            namaMadrasah: 'MAN 2 KOTA TIDORE KEPULAUAN',
            namaKepala: 'Nurlaila Usman, S.Pd',
            nipKepala: 'NIP.196604021994032001',
            namaBendahara: 'Sarbanun senuk, S.Pd',
            nipBendahara: 'NIP 198005052003122003',
            logo: ''
        };
        this.transactions = [];
        this.initializeApp();
        this.loadData();
        this.checkLoginSession();
    }

    initializeApp() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Home button
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());
        document.getElementById('headerHomeBtn').addEventListener('click', () => this.goHome());

        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        document.getElementById('resetSettingsBtn').addEventListener('click', () => this.resetSettings());

        // Logo upload
        document.getElementById('uploadLogoBtn').addEventListener('click', () => {
            document.getElementById('logoUpload').click();
        });
        document.getElementById('logoUpload').addEventListener('change', (e) => this.handleLogoUpload(e));
        document.getElementById('removeLogoBtn').addEventListener('click', () => this.removeLogo());

        // Transaction management
        document.getElementById('addTransactionBtn').addEventListener('click', () => this.openTransactionModal());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllTransactions());
        document.getElementById('loadSampleBtn').addEventListener('click', () => this.loadSampleData());
        document.getElementById('transactionForm').addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        document.getElementById('cancelTransactionBtn').addEventListener('click', () => this.closeTransactionModal());
        document.querySelector('.close').addEventListener('click', () => this.closeTransactionModal());

        // Reports, Backup, Security, Export
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());
        document.getElementById('backupBtn').addEventListener('click', () => this.backupData());
        document.getElementById('restoreBtn').addEventListener('click', () => {
            document.getElementById('restoreFile').click();
        });
        document.getElementById('restoreFile').addEventListener('change', (e) => this.restoreData(e));
        document.getElementById('securityForm').addEventListener('submit', (e) => this.handleSecuritySubmit(e));
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
    }    g
oHome() {
        // Redirect back to main application
        window.location.href = 'app.html';
    }

    checkLoginSession() {
        const loginSession = localStorage.getItem('adminLoginSession');
        const loginTime = localStorage.getItem('adminLoginTime');
        const urlParams = new URLSearchParams(window.location.search);
        const fromMainApp = urlParams.get('from') === 'main' || document.referrer.includes('app.html');
        const fromLogin = urlParams.get('from') === 'login' || document.referrer.includes('index.html');
        
        if (loginSession === 'true' && loginTime) {
            const currentTime = new Date().getTime();
            const sessionTime = parseInt(loginTime);
            const sessionDuration = 24 * 60 * 60 * 1000;
            
            if (currentTime - sessionTime < sessionDuration) {
                this.isLoggedIn = true;
                this.showDashboard();
                return;
            } else {
                localStorage.removeItem('adminLoginSession');
                localStorage.removeItem('adminLoginTime');
            }
        }
        
        if (fromMainApp) {
            this.autoLogin();
        }
        
        if (fromLogin && loginSession === 'true') {
            this.isLoggedIn = true;
            this.showDashboard();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.isLoggedIn = true;
            localStorage.setItem('adminLoginSession', 'true');
            localStorage.setItem('adminLoginTime', new Date().getTime().toString());
            this.showDashboard();
        } else {
            alert('❌ Username atau password salah!');
        }
    }

    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('adminLoginSession');
        localStorage.removeItem('adminLoginTime');
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('loginForm').reset();
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        this.updateDashboard();
        this.loadSettingsForm();
    }

    autoLogin() {
        this.isLoggedIn = true;
        localStorage.setItem('adminLoginSession', 'true');
        localStorage.setItem('adminLoginTime', new Date().getTime().toString());
        this.showDashboard();
    }
}