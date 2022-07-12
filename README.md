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
    - Response: {
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

- GET /cards/transactions/:id
    - Get card transactions route
    - id is the card id
    - headers: {}
    - body: {}
    - Response: {
        "balance": 35000,
        "transactions": [
		    { "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
	    ]
        "recharges": [
		    { "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
	    ]
    }

- POST /cards/block/:id
    - Block card route
    - id is the card id
    - headers: {}
    - body: {
        "password": "3367"
    }

- POST /cards/unblock/:id
    - Block card route
    - id is the card id
    - headers: {}
    - body: {
        "password": "3367"
    }

- POST /recharge/:id
    - Recharge card route
    - id is the card id
    - headers: {
        x-api-key: add api key of the company
    }
    - body: {
        "amount": "30000"
    }
    - Use integers for amount, so the last two house of the number represent the cents

- POST /payment/:id
    - Payment at point of sale route
    - id is the card id
    - headers: {}
    - body: {
        "businessId": 4,
        "amount": 5400,
        "cardPassword": "3367"
    }
    - Use integers for amount, so the last two house of the number represent the cents

- POST /payment/online/:id
    - Online Payment route
    - id is the business id
    - headers: {}
    - body: {
        "cardNumber": "9333 1444 4344 7302",
        "ownerName": "Fulano V Silva",
        "expirationDate": "07/30",
        "cvc": "637",
        "amount": 2200
    }
    - Use integers for amount, so the last two house of the number represent the cents

- POST /cards/virtual/create/:id
    - Create virtual card route
    - id is the card id
    - headers: {}
    - body: {
        "password": "3367"
    }

- DELETE /cards/delete-virtual/:id
    - Delete virtual card route
    - id is the card id
    - headers: {}
    - body: {
        "password": "3367"
    }
```

## Deploy

The API is deployed at the link: [https://ipt-valex.herokuapp.com/](https://ipt-valex.herokuapp.com/)
