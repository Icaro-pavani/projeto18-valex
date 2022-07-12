# Valex

<p align="center">
  <a href="https://github.com/Icaro-pavani/projeto18-valex">
    
  </a>

  <h3 align="center">
    projeto18-valex
  </h3>
</p>

## Usage

```bash
$ git clone https://github.com/Icaro-pavani/projeto18-valex

$ cd projeto18-valex

$ npm install

$ npm run dev
```

### API:

```
- POST /cards/create/:id
    - Create new card route
    - id is the employee id
    - headers: {
        x-api-key: add api key of the company
    }
    - body: {
        "type": "groceries" or "restaurant" or "transport" or "education" or "health";
    }
    - Return: {
        "number",
        "cardholderName",
        "cvc",
        "type"
    }
    - The cvc are the security code of the card, which is used for others routes

- POST /cards/activate/:id
    - Activate card route
    - id is the card id
    - body: {
        "cvc": "567",
        "password": "3367"
    }

- POST /cards/cardInfo/:id
    - See card informations route
    - id is the card id
    - body: {
        "employeeId": 1,
        "cardPassword": "3367"
    }

- GET /usuarios (autenticada)
    - Rota para listar todos os usuários
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
- GET /usuarios/:id (autenticada)
    - Rota para listar um usuário pelo id
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
- PUT /usuarios/:id (autenticada)
    - Rota para atualizar um usuário pelo id
    - headers: { "Authorization": "Bearer $token" }
    - body: {
        "nome": "Lorem ipsum2",
        "email": "lorem2@gmail.com",
        "senha": "loremipsum2"
    }
- DELETE /usuarios/:id (autenticada)
    - Rota para deletar um usuário pelo id
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
```
