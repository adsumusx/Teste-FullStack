<!--- # "Can be a image or a gift from the project pages" -->

# Challenge Jobber✨

Este é um projeto que visa a criação de uma aplicação Fullstack para o gerenciamento de tarefas, utilizando React e Node. 
O objetivo central é desenvolver uma aplicação básica que permita a gestão de campos e preenchimentos relacionado aos campos.

## Tech Stack 🐋

<!--- # "Verify icons availability here https://github.com/tandpfun/skill-icons" -->

[![My Skills](https://skillicons.dev/icons?i=ts,nodejs,sqlite,react,tailwind)](https://skillicons.dev)

## Como rodar o projeto 💻

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:adsumusx/Teste-FullStack.git
   ```

2. **Navegue até a pasta `backend`:**

   ```bash
   cd backend
   ```

3. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```
   
4. **Inicialize o servidor do backend:**

   ```bash
   npm run start
   ```
   
5. **Inicialize um novo Terminal na raiz do projeto e navegue até a pasta `frontend`:**

    ```bash
    cd frontend
    ```
    
6. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```
   
4. **Inicialize o servidor do frontend:**

   ```bash
   npm run start
   ```
  
   
5. **As aplicações vão estar nos seguintes URL's:**

   - **Backend:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
   - **Frontend:** [http://localhost:3000](http://localhost:3000)


Após a configuração inicial do projeto, você pode interagir com o backend através do frontend ou pela API disponível nos seguintes endpoints: 

**GET /fields**
Recupera a lista de todos os campos. Este endpoint retorna uma coleção de objetos campos, permitindo a visualização de todas os campos disponíveis.

**GET /fills**
Recupera a lista de todos os preenchimentos. Este endpoint retorna uma coleção de objetos preenchimentos, permitindo a visualização de todas os preenchimentos disponíveis.

**POST /fields**
Cria um novo campo. Envie os dados necessários no corpo da solicitação para adicionar um novo campo à lista.

**POST /fills**
Cria um novo preenchimento. Envie os dados necessários no corpo da solicitação para adicionar um novo preenchimento à lista.
