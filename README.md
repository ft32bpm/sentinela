# 🛡️ Sentinela — Sistema de Escala de Serviço

Sistema web para geração de escalas de serviço da **Força Tática**, com exportação em PDF. Funciona diretamente no navegador, sem instalação ou servidor.

---

## 📋 Funcionalidades

### Gerar Escala
- Definição de **data de emissão** e **data da escala**
- Adição de múltiplas **viaturas (ÁGUIA)** com prefixo e horários de início/fim
- Alocação de militares por viatura com atribuição automática de **funções** (Cmdt de Equipe, Motorista, Segurança, Anotador, Estagiário) baseada na ordem de antiguidade
- Suporte a **horário personalizado por militar**, independente do horário da viatura
- Painel lateral com lista de **militares disponíveis** (não alocados) em tempo real
- Exportação da escala em **PDF** com layout formatado, cabeçalho, tabela de efetivo e assinaturas

### Indisponibilidades
| Tipo | Descrição |
|------|-----------|
| Intervalo de Escala | Militares em folga no período |
| RSP | Recompensa por Serviços Prestados |
| Férias | Férias regulamentares |
| LE | Licença Especial |
| LTIP | Licença Temporária para Interesse Particular |
| LTS | Licença para Tratamento de Saúde |
| Adido | Militar adido a outra unidade |

- Botão **"Adicionar os Restantes"** preenche automaticamente o Intervalo de Escala com todos os militares ainda não alocados, ordenados por antiguidade

### Cadastro de Militares
- Cadastro com: número de antiguidade, graduação, nome de guerra, nome completo e ID funcional
- Edição e exclusão individual
- Opção de **resetar** para a lista padrão da unidade

### Configurações
- Nome do batalhão
- Seleção do **Comandante** e **Auxiliar de Pelotão** (usados na assinatura do PDF)
- Texto personalizado de assinatura

---

## 📄 Geração do PDF

O PDF gerado inclui:
- Logo da Força Tática centralizada
- Cabeçalho com nome do batalhão e data da escala
- Tabela com: graduação, nome, ID funcional, hora inicial, hora final, prefixo da viatura e função
- Seções de indisponibilidade (apenas as que possuem militares)
- Resumo de efetivo: existente, indisponível, disponível e empregado
- Rodapé com local, data de emissão e campos de assinatura
- Nome do arquivo gerado automaticamente com data e dia da semana (ex: `15 DE JULHO DE 2025 - TERÇA-FEIRA.pdf`)

---

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no `localStorage` do navegador:

| Chave | Conteúdo |
|-------|----------|
| `militares` | Lista de militares cadastrados |
| `configuracoes` | Batalhão, comandante, auxiliar e texto de assinatura |
| `viatura_<id>` | Dados de cada viatura (prefixo, horários, militares) |
| `totalViaturas` | Quantidade de viaturas ativas |
| `indisponiveis_<tipo>` | Militares por tipo de indisponibilidade |

> ⚠️ Os dados ficam salvos apenas no navegador local. Limpar os dados do navegador apaga todas as informações.

---

## 🗂️ Estrutura de Arquivos

```
Sentinela/
├── index.html              # Interface principal
├── script.js               # Toda a lógica da aplicação
├── styles.css              # Estilização (tema escuro)
├── sentinela.png           # Logo exibida na tela
└── Logo FT PNG sem fundo.png  # Logo usada no PDF
```

---

## 🚀 Como Usar

1. Abra o arquivo `index.html` diretamente no navegador
2. Em **Configurações**, defina o batalhão, comandante e auxiliar de pelotão
3. Em **Cadastro de Militares**, revise ou atualize a lista
4. Na aba **Gerar Escala**:
   - Defina as datas
   - Adicione as viaturas e aloque os militares
   - Registre as indisponibilidades
   - Clique em **Gerar PDF**

---

## 🛠️ Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks)
- [SweetAlert2](https://sweetalert2.github.io/) — alertas e confirmações
- [Lucide Icons](https://lucide.dev/) — ícones
- [jsPDF](https://github.com/parallax/jsPDF) — geração de PDF no navegador
