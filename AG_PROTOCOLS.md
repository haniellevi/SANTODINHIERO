# PROTOCOLOS DE SEGURANÇA OBRIGATÓRIOS (NÍVEL CRÍTICO)

## 1. REGRA DE OURO: PROTEÇÃO DA MAIN
ANTES de escrever qualquer linha de código ou executar qualquer comando, você DEVE verificar a branch atual:
- Execute `git branch --show-current`.
- SE a branch for "main" ou "master":
  - PARE IMEDIATAMENTE.
  - EMITA UM ALERTA VERMELHO: "⚠️ PERIGO: Você está na main. Abortando operação."
  - Sugira o comando para criar uma nova branch segura: `git checkout -b feature/nome-da-tarefa`

## 2. PROTOCOLO DE BACKUP (DOCKER)
Sempre que o usuário solicitar uma alteração que envolva "banco de dados", "model", "migration" ou "schema":
- OBRIGATÓRIO: Antes de gerar o código, crie um backup do banco.
- Execute o comando: `docker exec -t [NOME_DO_SEU_CONTAINER_DB] pg_dumpall -c -U postgres > backup_seguranca_$(date +%Y%m%d_%H%M%S).sql`
- Confirme que o arquivo .sql foi criado.

## 3. CHECKLIST DE FINALIZAÇÃO
Antes de dizer "Tarefa Concluída", verifique:
- O código roda sem erros no Docker?
- O banco de dados foi afetado? Se sim, o backup existe?
Agora, sempre que você abrir um chat ou iniciar uma tarefa no "Manager View" do Antigravity, diga como primeira instrução: "Leia o arquivo AG_PROTOCOLS.md e siga-o estritamente."
