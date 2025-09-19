/**
 * Gerador de Hostnames - Padrão CNL
 * Gera hostnames seguindo o padrão: CNL-{fornecedor}{tipo}{setor}{local}-{numero:03d}
 */

class HostnameGenerator {
    constructor() {
        // Dados padrão baseados no sistema Python
        this.fornecedores = {
            'Condor': '1',
            'Volker': '3',
            'Vivo': '5',
            'Sellbetti': '2',
            
        };

        this.tipos = {
            'laptop': 'L',
            'desktop': 'D',
            'servidor': 'S',
            'impressora': 'I',
            'celular': 'C'
        };

        this.setores = {
            'ti': '01',
            'rh': '02',
            'financeiro': '03',
        };

        this.locais = {
            'fabrica': '1',
            'escritorio': '2',
            'deposito': '4',
        };

        // Histórico de máquinas por setor
        this.maquinas = {};
        
        // Carrega dados personalizados do localStorage
        this.loadCustomData();
    }

    /**
     * Gera hostnames seguindo o padrão CNL
     */
    generate(params) {
        const {
            fornecedor,
            tipo,
            setor,
            local,
            quantidade
        } = params;

        if (!fornecedor || !tipo || !setor || !local) {
            throw new Error('Todos os campos são obrigatórios');
        }

        const hostnames = [];
        
        // Inicializa o setor se não existir
        if (!this.maquinas[setor]) {
            this.maquinas[setor] = {};
        }

        const maquinasSetor = this.maquinas[setor];
        
        // Encontra o próximo número disponível
        const numerosUsados = Object.keys(maquinasSetor).map(n => parseInt(n)).sort((a, b) => a - b);
        let proximoNumero = 1;
        
        for (let i = 0; i < quantidade; i++) {
            // Encontra o próximo número disponível
            while (numerosUsados.includes(proximoNumero)) {
                proximoNumero++;
            }
            
            // Gera o hostname no padrão CNL
            const hostname = `CNL-${this.fornecedores[fornecedor]}${this.tipos[tipo]}${this.setores[setor]}${this.locais[local]}-${proximoNumero.toString().padStart(3, '0')}`;
            
            // Adiciona ao histórico
            maquinasSetor[proximoNumero.toString().padStart(3, '0')] = hostname;
            numerosUsados.push(proximoNumero);
            
            hostnames.push({
                hostname: hostname,
                fornecedor: fornecedor,
                tipo: tipo,
                setor: setor,
                local: local,
                numero: proximoNumero,
                index: i + 1,
                timestamp: new Date().toISOString()
            });
            
            proximoNumero++;
        }

        return hostnames;
    }

    /**
     * Obtém lista de fornecedores disponíveis
     */
    getFornecedores() {
        return Object.keys(this.fornecedores);
    }

    /**
     * Obtém lista de tipos disponíveis
     */
    getTipos() {
        return Object.keys(this.tipos);
    }

    /**
     * Obtém lista de setores disponíveis
     */
    getSetores() {
        return Object.keys(this.setores);
    }

    /**
     * Obtém lista de locais disponíveis
     */
    getLocais() {
        return Object.keys(this.locais);
    }

    /**
     * Consulta máquinas por setor
     */
    consultarSetores() {
        const resultado = {};
        
        for (const [setor, maquinas] of Object.entries(this.maquinas)) {
            if (Object.keys(maquinas).length > 0) {
                resultado[setor] = {
                    nome: setor,
                    codigo: this.setores[setor],
                    quantidade: Object.keys(maquinas).length,
                    maquinas: Object.values(maquinas)
                };
            }
        }
        
        return resultado;
    }

    /**
     * Obtém próximo número disponível para um setor
     */
    getProximoNumero(setor) {
        if (!this.maquinas[setor]) {
            return 1;
        }
        
        const numerosUsados = Object.keys(this.maquinas[setor]).map(n => parseInt(n)).sort((a, b) => a - b);
        let proximoNumero = 1;
        
        while (numerosUsados.includes(proximoNumero)) {
            proximoNumero++;
        }
        
        return proximoNumero;
    }

    /**
     * Valida se um hostname segue o padrão CNL
     */
    validarHostnameCNL(hostname) {
        const regex = /^CNL-[A-Z]{1,2}[A-Z]\d{2}\d-\d{3}$/;
        return regex.test(hostname);
    }

    /**
     * Decodifica um hostname CNL
     */
    decodificarHostname(hostname) {
        if (!this.validarHostnameCNL(hostname)) {
            return null;
        }

        const partes = hostname.split('-');
        const codigos = partes[1];
        
        // Extrai códigos
        const fornecedorCodigo = codigos.substring(0, codigos.length - 4);
        const tipoCodigo = codigos.substring(codigos.length - 4, codigos.length - 3);
        const setorCodigo = codigos.substring(codigos.length - 3, codigos.length - 1);
        const localCodigo = codigos.substring(codigos.length - 1);
        const numero = parseInt(partes[2]);

        // Encontra nomes pelos códigos
        const fornecedor = Object.keys(this.fornecedores).find(f => this.fornecedores[f] === fornecedorCodigo);
        const tipo = Object.keys(this.tipos).find(t => this.tipos[t] === tipoCodigo);
        const setor = Object.keys(this.setores).find(s => this.setores[s] === setorCodigo);
        const local = Object.keys(this.locais).find(l => this.locais[l] === localCodigo);

        return {
            hostname,
            fornecedor,
            tipo,
            setor,
            local,
            numero,
            codigos: {
                fornecedor: fornecedorCodigo,
                tipo: tipoCodigo,
                setor: setorCodigo,
                local: localCodigo
            }
        };
    }

    /**
     * Carrega dados personalizados do localStorage
     */
    loadCustomData() {
        try {
            const customData = localStorage.getItem('hostname-generator-custom-data');
            if (customData) {
                const data = JSON.parse(customData);
                // Só adiciona dados personalizados, não sobrescreve os padrão
                if (data.fornecedores) {
                    Object.keys(data.fornecedores).forEach(key => {
                        if (!this.fornecedores[key]) {
                            this.fornecedores[key] = data.fornecedores[key];
                        }
                    });
                }
                if (data.tipos) {
                    Object.keys(data.tipos).forEach(key => {
                        if (!this.tipos[key]) {
                            this.tipos[key] = data.tipos[key];
                        }
                    });
                }
                if (data.setores) {
                    Object.keys(data.setores).forEach(key => {
                        if (!this.setores[key]) {
                            this.setores[key] = data.setores[key];
                        }
                    });
                }
                if (data.locais) {
                    Object.keys(data.locais).forEach(key => {
                        if (!this.locais[key]) {
                            this.locais[key] = data.locais[key];
                        }
                    });
                }
                if (data.maquinas) this.maquinas = data.maquinas;
            }
        } catch (error) {
            console.warn('Erro ao carregar dados personalizados:', error);
        }
    }

    /**
     * Salva dados personalizados no localStorage
     */
    saveCustomData() {
        try {
            // Dados padrão originais
            const defaultData = {
                fornecedores: {
                    'Condor': '1',
                    'Volker': '3',
                    'Vivo': '5',
                    'Sellbetti': '2'
                },
                tipos: {
                    'laptop': 'L',
                    'desktop': 'D',
                    'servidor': 'S',
                    'impressora': 'I',
                    'celular': 'C'
                },
                setores: {
                    'ti': '01',
                    'rh': '02',
                    'financeiro': '03'
                },
                locais: {
                    'fabrica': '1',
                    'escritorio': '2',
                    'deposito': '4'
                }
            };

            // Filtra apenas os dados personalizados (que não estão nos padrões)
            const customData = {
                fornecedores: {},
                tipos: {},
                setores: {},
                locais: {},
                maquinas: this.maquinas
            };

            // Fornecedores personalizados
            Object.keys(this.fornecedores).forEach(key => {
                if (!defaultData.fornecedores[key]) {
                    customData.fornecedores[key] = this.fornecedores[key];
                }
            });

            // Tipos personalizados
            Object.keys(this.tipos).forEach(key => {
                if (!defaultData.tipos[key]) {
                    customData.tipos[key] = this.tipos[key];
                }
            });

            // Setores personalizados
            Object.keys(this.setores).forEach(key => {
                if (!defaultData.setores[key]) {
                    customData.setores[key] = this.setores[key];
                }
            });

            // Locais personalizados
            Object.keys(this.locais).forEach(key => {
                if (!defaultData.locais[key]) {
                    customData.locais[key] = this.locais[key];
                }
            });

            localStorage.setItem('hostname-generator-custom-data', JSON.stringify(customData));
        } catch (error) {
            console.warn('Erro ao salvar dados personalizados:', error);
        }
    }

    /**
     * Adiciona um novo fornecedor
     */
    addFornecedor(nome, codigo) {
        if (this.fornecedores[nome.toLowerCase()]) {
            throw new Error('Fornecedor já existe');
        }
        if (Object.values(this.fornecedores).includes(codigo)) {
            throw new Error('Código já está em uso');
        }
        
        this.fornecedores[nome.toLowerCase()] = codigo;
        this.saveCustomData();
        return true;
    }

    /**
     * Adiciona um novo tipo
     */
    addTipo(nome, codigo) {
        if (this.tipos[nome.toLowerCase()]) {
            throw new Error('Tipo já existe');
        }
        if (Object.values(this.tipos).includes(codigo)) {
            throw new Error('Código já está em uso');
        }
        
        this.tipos[nome.toLowerCase()] = codigo;
        this.saveCustomData();
        return true;
    }

    /**
     * Adiciona um novo setor
     */
    addSetor(nome, codigo) {
        if (this.setores[nome.toLowerCase()]) {
            throw new Error('Setor já existe');
        }
        if (Object.values(this.setores).includes(codigo)) {
            throw new Error('Código já está em uso');
        }
        
        this.setores[nome.toLowerCase()] = codigo;
        this.saveCustomData();
        return true;
    }

    /**
     * Adiciona um novo local
     */
    addLocal(nome, codigo) {
        if (this.locais[nome.toLowerCase()]) {
            throw new Error('Local já existe');
        }
        if (Object.values(this.locais).includes(codigo)) {
            throw new Error('Código já está em uso');
        }
        
        this.locais[nome.toLowerCase()] = codigo;
        this.saveCustomData();
        return true;
    }

    /**
     * Remove um item (fornecedor, tipo, setor ou local)
     */
    removeItem(categoria, nome) {
        if (this[categoria] && this[categoria][nome.toLowerCase()]) {
            delete this[categoria][nome.toLowerCase()];
            this.saveCustomData();
            return true;
        }
        return false;
    }
}

// Exporta a classe para uso em outros módulos
export default HostnameGenerator;
