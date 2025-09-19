/**
 * Validador de Hostnames
 * Valida hostnames de acordo com RFC 1123 e boas práticas
 */

class HostnameValidator {
    constructor() {
        // Regex para validar hostnames conforme RFC 1123
        this.hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
        
        // Comprimento máximo de um hostname (253 caracteres)
        this.maxLength = 253;
        
        // Comprimento máximo de um label (63 caracteres)
        this.maxLabelLength = 63;
        
        // Palavras reservadas que não devem ser usadas
        this.reservedWords = [
            'www', 'ftp', 'mail', 'smtp', 'pop', 'imap', 'admin', 'root',
            'administrator', 'test', 'dev', 'development', 'staging', 'prod',
            'production', 'localhost', 'local', 'internal', 'private'
        ];
        
        // Padrões problemáticos
        this.problematicPatterns = [
            /^[0-9]+$/, // Apenas números
            /^[0-9]+-/, // Começa com números seguido de hífen
            /--+/, // Múltiplos hífens consecutivos
            /^-/, // Começa com hífen
            /-$/, // Termina com hífen
            /\.$/, // Termina com ponto
            /^\./, // Começa com ponto
        ];
    }

    /**
     * Valida um hostname
     */
    validate(hostname) {
        const result = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: []
        };

        if (!hostname || typeof hostname !== 'string') {
            result.isValid = false;
            result.errors.push('Hostname é obrigatório');
            return result;
        }

        // Verifica comprimento total
        if (hostname.length > this.maxLength) {
            result.isValid = false;
            result.errors.push(`Hostname muito longo (máximo ${this.maxLength} caracteres)`);
        }

        // Verifica se está vazio
        if (hostname.trim().length === 0) {
            result.isValid = false;
            result.errors.push('Hostname não pode estar vazio');
        }

        // Verifica padrões problemáticos
        this.problematicPatterns.forEach((pattern, index) => {
            if (pattern.test(hostname)) {
                result.isValid = false;
                result.errors.push(this.getPatternErrorMessage(index));
            }
        });

        // Verifica regex básico
        if (!this.hostnameRegex.test(hostname)) {
            result.isValid = false;
            result.errors.push('Formato de hostname inválido');
        }

        // Verifica labels individuais
        const labels = hostname.split('.');
        labels.forEach((label, index) => {
            if (label.length > this.maxLabelLength) {
                result.isValid = false;
                result.errors.push(`Label "${label}" muito longo (máximo ${this.maxLabelLength} caracteres)`);
            }

            if (label.length === 0) {
                result.isValid = false;
                result.errors.push('Label vazio encontrado');
            }
        });

        // Verifica palavras reservadas
        const firstLabel = labels[0];
        if (this.reservedWords.includes(firstLabel.toLowerCase())) {
            result.warnings.push(`"${firstLabel}" é uma palavra reservada comum`);
            result.suggestions.push(`Considere usar um prefixo, ex: "my-${firstLabel}"`);
        }

        // Verifica se é muito genérico
        if (this.isTooGeneric(hostname)) {
            result.warnings.push('Hostname muito genérico');
            result.suggestions.push('Considere adicionar mais contexto (ambiente, localização, etc.)');
        }

        // Verifica se é muito específico
        if (this.isTooSpecific(hostname)) {
            result.warnings.push('Hostname muito específico');
            result.suggestions.push('Considere simplificar para melhor legibilidade');
        }

        // Verifica convenções de nomenclatura
        this.checkNamingConventions(hostname, result);

        return result;
    }

    /**
     * Verifica se o hostname é muito genérico
     */
    isTooGeneric(hostname) {
        const genericPatterns = [
            /^server$/,
            /^host$/,
            /^machine$/,
            /^computer$/,
            /^node$/,
            /^box$/
        ];

        return genericPatterns.some(pattern => pattern.test(hostname.toLowerCase()));
    }

    /**
     * Verifica se o hostname é muito específico
     */
    isTooSpecific(hostname) {
        // Hostname muito específico se tem mais de 4 labels ou mais de 30 caracteres
        const labels = hostname.split('.');
        return labels.length > 4 || hostname.length > 30;
    }

    /**
     * Verifica convenções de nomenclatura
     */
    checkNamingConventions(hostname, result) {
        // Verifica se usa camelCase (não recomendado)
        if (/[A-Z]/.test(hostname)) {
            result.warnings.push('Hostnames devem usar apenas letras minúsculas');
            result.suggestions.push('Converta para minúsculas: ' + hostname.toLowerCase());
        }

        // Verifica se usa underscores (não recomendado)
        if (hostname.includes('_')) {
            result.warnings.push('Hostnames devem usar hífens em vez de underscores');
            result.suggestions.push('Substitua underscores por hífens: ' + hostname.replace(/_/g, '-'));
        }

        // Verifica se tem números no início
        if (/^[0-9]/.test(hostname)) {
            result.warnings.push('Evite começar hostnames com números');
            result.suggestions.push('Adicione um prefixo alfabético');
        }
    }

    /**
     * Retorna mensagem de erro para padrões problemáticos
     */
    getPatternErrorMessage(index) {
        const messages = [
            'Hostname não pode conter apenas números',
            'Evite começar com números seguido de hífen',
            'Evite múltiplos hífens consecutivos',
            'Hostname não pode começar com hífen',
            'Hostname não pode terminar com hífen',
            'Hostname não pode terminar com ponto',
            'Hostname não pode começar com ponto'
        ];
        return messages[index] || 'Padrão problemático encontrado';
    }

    /**
     * Valida múltiplos hostnames
     */
    validateMultiple(hostnames) {
        return hostnames.map(hostname => ({
            hostname,
            validation: this.validate(hostname)
        }));
    }

    /**
     * Verifica se há duplicatas
     */
    checkDuplicates(hostnames) {
        const seen = new Set();
        const duplicates = [];

        hostnames.forEach((hostname, index) => {
            const normalized = hostname.toLowerCase();
            if (seen.has(normalized)) {
                duplicates.push({
                    hostname,
                    index,
                    message: 'Hostname duplicado encontrado'
                });
            } else {
                seen.add(normalized);
            }
        });

        return duplicates;
    }

    /**
     * Gera sugestões de melhoria
     */
    generateSuggestions(hostname) {
        const suggestions = [];
        const validation = this.validate(hostname);

        if (validation.warnings.length > 0) {
            suggestions.push(...validation.suggestions);
        }

        // Sugestões baseadas em boas práticas
        if (hostname.length > 20) {
            suggestions.push('Considere abreviar para melhor legibilidade');
        }

        if (!hostname.includes('-') && hostname.length > 8) {
            suggestions.push('Considere usar hífens para separar palavras');
        }

        return suggestions;
    }
}

// Exporta a classe para uso em outros módulos
export default HostnameValidator;
