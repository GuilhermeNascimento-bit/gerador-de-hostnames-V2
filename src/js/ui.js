/**
 * Interface do Usuário
 * Gerencia a interação com o usuário e exibe resultados
 */

import HostnameGenerator from './generator.js';
import HostnameValidator from './validator.js';

class HostnameUI {
    constructor() {
        this.generator = new HostnameGenerator();
        this.validator = new HostnameValidator();
        this.history = this.loadHistory();
        
        this.initializeElements();
        this.bindEvents();
        this.initializeForm();
    }

    /**
     * Inicializa elementos do DOM
     */
    initializeElements() {
        this.form = document.getElementById('hostnameForm');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.historyContainer = document.getElementById('historyContainer');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // Elementos do formulário CNL
        this.fornecedorSelect = document.getElementById('fornecedor');
        this.tipoSelect = document.getElementById('tipo');
        this.setorSelect = document.getElementById('setor');
        this.localSelect = document.getElementById('local');
        this.quantidadeInput = document.getElementById('quantidade');
    }

    /**
     * Vincula eventos
     */
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.copyAllBtn.addEventListener('click', () => this.copyAllResults());
        this.exportBtn.addEventListener('click', () => this.exportResults());
        this.clearBtn.addEventListener('click', () => this.clearForm());
        
        // Eventos de input para validação em tempo real
        this.quantidadeInput.addEventListener('input', () => this.validateQuantidade());
    }

    /**
     * Inicializa o formulário
     */
    initializeForm() {
        // Define valores padrão
        this.quantidadeInput.value = 1;
        
        // Carrega opções dos selects
        this.loadSelectOptions();
        
        // Carrega histórico
        this.renderHistory();
        
        // Configura modal
        this.setupModal();
    }

    /**
     * Manipula o envio do formulário
     */
    handleSubmit(e) {
        e.preventDefault();
        
        try {
            const params = this.getFormParams();
            const hostnames = this.generator.generate(params);
            
            this.displayResults(hostnames);
            this.addToHistory(hostnames);
            this.updateActionButtons(true);
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Obtém parâmetros do formulário
     */
    getFormParams() {
        return {
            fornecedor: this.fornecedorSelect.value,
            tipo: this.tipoSelect.value,
            setor: this.setorSelect.value,
            local: this.localSelect.value,
            quantidade: parseInt(this.quantidadeInput.value)
        };
    }

    /**
     * Exibe resultados
     */
    displayResults(hostnames) {
        if (hostnames.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <p>Nenhum hostname foi gerado</p>
                </div>
            `;
            return;
        }

        const resultsHTML = hostnames.map((item, index) => {
            const validation = this.validator.validate(item.hostname);
            const statusClass = validation.isValid ? 'valid' : 'invalid';
            const statusIcon = validation.isValid ? '✅' : '❌';
            
            return `
                <div class="result-item ${statusClass}" data-index="${index}">
                    <div class="result-header">
                        <span class="result-number">${item.index}</span>
                        <span class="result-status">${statusIcon}</span>
                        <span class="result-pattern">CNL</span>
                    </div>
                    <div class="result-content">
                        <div class="result-hostname">${item.hostname}</div>
                        <div class="result-details">
                            <div class="detail-item">
                                <strong>Fornecedor:</strong> ${item.fornecedor}
                            </div>
                            <div class="detail-item">
                                <strong>Tipo:</strong> ${item.tipo}
                            </div>
                            <div class="detail-item">
                                <strong>Setor:</strong> ${item.setor}
                            </div>
                            <div class="detail-item">
                                <strong>Local:</strong> ${item.local}
                            </div>
                            <div class="detail-item">
                                <strong>Número:</strong> ${item.numero}
                            </div>
                        </div>
                        ${validation.warnings.length > 0 ? `
                            <div class="result-warnings">
                                ${validation.warnings.map(warning => `
                                    <div class="warning">⚠️ ${warning}</div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${validation.suggestions.length > 0 ? `
                            <div class="result-suggestions">
                                ${validation.suggestions.map(suggestion => `
                                    <div class="suggestion">💡 ${suggestion}</div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="result-actions">
                        <button class="btn-copy" onclick="navigator.clipboard.writeText('${item.hostname}')">
                            📋 Copiar
                        </button>
                        <button class="btn-validate" onclick="this.showValidationDetails('${item.hostname}')">
                            🔍 Detalhes
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.resultsContainer.innerHTML = `
            <div class="results-list">
                ${resultsHTML}
            </div>
        `;
    }

    /**
     * Obtém nome do padrão
     */
    getPatternName(pattern) {
        const names = {
            'descriptive': 'Descritivo',
            'abbreviated': 'Abreviado',
            'numeric': 'Numérico',
            'environment': 'Por Ambiente',
            'location': 'Por Localização',
            'function': 'Por Função'
        };
        return names[pattern] || pattern;
    }

    /**
     * Copia todos os resultados
     */
    copyAllResults() {
        const hostnames = Array.from(this.resultsContainer.querySelectorAll('.result-hostname'))
            .map(el => el.textContent)
            .join('\n');
        
        if (hostnames) {
            navigator.clipboard.writeText(hostnames).then(() => {
                this.showSuccess('Todos os hostnames foram copiados!');
            }).catch(() => {
                this.showError('Erro ao copiar hostnames');
            });
        }
    }

    /**
     * Exporta resultados
     */
    exportResults() {
        const hostnames = Array.from(this.resultsContainer.querySelectorAll('.result-hostname'))
            .map(el => el.textContent);
        
        if (hostnames.length === 0) {
            this.showError('Nenhum resultado para exportar');
            return;
        }

        const data = {
            timestamp: new Date().toISOString(),
            hostnames: hostnames,
            count: hostnames.length
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `hostnames-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Resultados exportados com sucesso!');
    }

    /**
     * Limpa o formulário
     */
    clearForm() {
        this.form.reset();
        this.resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <p>Configure os parâmetros acima e clique em "Gerar Hostnames" para ver os resultados</p>
            </div>
        `;
        this.updateActionButtons(false);
        this.initializeForm();
    }

    /**
     * Atualiza botões de ação
     */
    updateActionButtons(hasResults) {
        this.copyAllBtn.disabled = !hasResults;
        this.exportBtn.disabled = !hasResults;
    }

    /**
     * Valida quantidade
     */
    validateQuantidade() {
        const value = parseInt(this.quantidadeInput.value);
        if (value < 1 || value > 10) {
            this.showFieldError(this.quantidadeInput, 'Quantidade deve estar entre 1 e 10');
        } else {
            this.clearFieldError(this.quantidadeInput);
        }
    }

    /**
     * Mostra erro em campo
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    /**
     * Remove erro de campo
     */
    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }

    /**
     * Adiciona ao histórico
     */
    addToHistory(hostnames) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            params: this.getFormParams(),
            hostnames: hostnames.map(h => h.hostname),
            count: hostnames.length
        };
        
        this.history.unshift(historyItem);
        
        // Mantém apenas os últimos 50 itens
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    /**
     * Renderiza histórico
     */
    renderHistory() {
        if (this.history.length === 0) {
            this.historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <p>Os hostnames gerados aparecerão aqui</p>
                </div>
            `;
            return;
        }

        const historyHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
                    <span class="history-count">${item.count} hostnames</span>
                </div>
                <div class="history-details">
                    <div class="history-params">
                        <span class="param">${item.params.baseName}</span>
                        ${item.params.environment ? `<span class="param">${item.params.environment}</span>` : ''}
                        ${item.params.location ? `<span class="param">${item.params.location}</span>` : ''}
                        <span class="param">${this.getPatternName(item.params.pattern)}</span>
                    </div>
                    <div class="history-hostnames">
                        ${item.hostnames.slice(0, 3).map(hostname => `
                            <span class="hostname-preview">${hostname}</span>
                        `).join('')}
                        ${item.hostnames.length > 3 ? `<span class="more">+${item.hostnames.length - 3} mais</span>` : ''}
                    </div>
                </div>
                <div class="history-actions">
                    <button class="btn-small" onclick="this.regenerateFromHistory(${item.id})">
                        🔄 Regenerar
                    </button>
                    <button class="btn-small" onclick="this.deleteFromHistory(${item.id})">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `).join('');

        this.historyContainer.innerHTML = `
            <div class="history-list">
                ${historyHTML}
            </div>
        `;
    }

    /**
     * Regenera a partir do histórico
     */
    regenerateFromHistory(id) {
        const item = this.history.find(h => h.id === id);
        if (item) {
            // Preenche o formulário
            this.baseNameInput.value = item.params.baseName;
            this.environmentSelect.value = item.params.environment;
            this.locationSelect.value = item.params.location;
            this.patternSelect.value = item.params.pattern;
            this.countInput.value = item.params.count;
            this.customPrefixInput.value = item.params.customPrefix;
            this.customSuffixInput.value = item.params.customSuffix;
            
            // Gera novamente
            this.handleSubmit(new Event('submit'));
        }
    }

    /**
     * Remove do histórico
     */
    deleteFromHistory(id) {
        this.history = this.history.filter(h => h.id !== id);
        this.saveHistory();
        this.renderHistory();
    }

    /**
     * Carrega histórico do localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('hostname-generator-history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Erro ao carregar histórico:', error);
            return [];
        }
    }

    /**
     * Salva histórico no localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('hostname-generator-history', JSON.stringify(this.history));
        } catch (error) {
            console.warn('Erro ao salvar histórico:', error);
        }
    }

    /**
     * Carrega opções dos selects
     */
    loadSelectOptions() {
        // Fornecedores
        this.populateSelect(this.fornecedorSelect, this.generator.getFornecedores(), this.generator.fornecedores);
        
        // Tipos
        this.populateSelect(this.tipoSelect, this.generator.getTipos(), this.generator.tipos);
        
        // Setores
        this.populateSelect(this.setorSelect, this.generator.getSetores(), this.generator.setores);
        
        // Locais
        this.populateSelect(this.localSelect, this.generator.getLocais(), this.generator.locais);
    }

    /**
     * Popula um select com opções
     */
    populateSelect(selectElement, keys, data) {
        // Limpa opções existentes (exceto a primeira)
        while (selectElement.children.length > 1) {
            selectElement.removeChild(selectElement.lastChild);
        }

        // Adiciona novas opções
        keys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)} (${data[key]})`;
            selectElement.appendChild(option);
        });
    }

    /**
     * Configura o modal
     */
    setupModal() {
        this.modal = document.getElementById('addModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.addForm = document.getElementById('addForm');
        this.itemNameInput = document.getElementById('itemName');
        this.itemCodeInput = document.getElementById('itemCode');
        this.codeHelp = document.getElementById('codeHelp');
        
        this.addForm.addEventListener('submit', (e) => this.handleAddItem(e));
        this.currentCategory = null;
        
        // Fecha modal ao clicar fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Fecha modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    /**
     * Abre o modal para adicionar item
     */
    openModal(category) {
        this.currentCategory = category;
        
        const titles = {
            'fornecedor': 'Adicionar Fornecedor',
            'tipo': 'Adicionar Tipo',
            'setor': 'Adicionar Setor',
            'local': 'Adicionar Local'
        };
        
        const placeholders = {
            'fornecedor': 'Ex: Samsung',
            'tipo': 'Ex: Tablet',
            'setor': 'Ex: Marketing',
            'local': 'Ex: Filial'
        };
        
        const codeExamples = {
            'fornecedor': 'Ex: S',
            'tipo': 'Ex: T',
            'setor': 'Ex: 09',
            'local': 'Ex: 6'
        };
        
        this.modalTitle.textContent = titles[category];
        this.itemNameInput.placeholder = placeholders[category];
        this.itemCodeInput.placeholder = codeExamples[category];
        this.codeHelp.textContent = `Código único para o ${category}`;
        
        // Limpa o formulário
        this.addForm.reset();
        
        // Mostra o modal
        this.modal.classList.add('show');
        this.itemNameInput.focus();
    }

    /**
     * Fecha o modal
     */
    closeModal() {
        this.modal.classList.remove('show');
        this.currentCategory = null;
    }

    /**
     * Manipula o envio do formulário de adicionar item
     */
    handleAddItem(e) {
        e.preventDefault();
        
        const nome = this.itemNameInput.value.trim();
        const codigo = this.itemCodeInput.value.trim();
        
        if (!nome || !codigo) {
            this.showError('Nome e código são obrigatórios');
            return;
        }
        
        try {
            let success = false;
            
            switch (this.currentCategory) {
                case 'fornecedor':
                    success = this.generator.addFornecedor(nome, codigo);
                    break;
                case 'tipo':
                    success = this.generator.addTipo(nome, codigo);
                    break;
                case 'setor':
                    success = this.generator.addSetor(nome, codigo);
                    break;
                case 'local':
                    success = this.generator.addLocal(nome, codigo);
                    break;
            }
            
            if (success) {
                this.showSuccess(`${this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1)} adicionado com sucesso!`);
                this.loadSelectOptions();
                this.closeModal();
            }
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Mostra mensagem de sucesso
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Mostra mensagem
     */
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
}

// Inicializa a UI quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.hostnameUI = new HostnameUI();
});

// Funções globais para o modal
window.openModal = function(category) {
    if (window.hostnameUI) {
        window.hostnameUI.openModal(category);
    }
};

window.closeModal = function() {
    if (window.hostnameUI) {
        window.hostnameUI.closeModal();
    }
};
