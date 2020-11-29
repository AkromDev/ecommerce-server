# Public queries
```graphql
query products {
  products {
    _id
    title
    imageUrl
    storeId
    description
  }
}
query product {
  product(_id: "5fb1298205ddb9f2422951de") {
    _id
    title
    imageUrl
    description
    store {
      _id
      name
    }
  }
}

query stores {
  stores {
    _id
    name
    products {
      _id
      title
    }
  }
}
query store {
  store(_id: "5fb127be071b64f1a9b25002") {
    _id
    name
    products {
      _id
      title
    }
  }
}

```
# Protected queries

```graphql 

query me{
  me{
    _id
    isVerified
    roles
    firstName
    lastName
  }
}

query myOrders{
  myOrders{
    _id
    user{
      firstName
      lastName
    }
   productsOrdered{
    quantity
    product{
      _id
      title
      imageUrl
    }
  }
  }
}
query myOrder{
  myOrder(orderId:"5fbfd095c61bace0143912c0"){
    _id
    productsOrdered{
      quantity
      product{
        title
        imageUrl
      }
    }
  }
}
```


# Auth mutations

```graphql

mutation signup {
  signup(
    input: {
      email: "akrom2@test.com"
      password: "akrom2"
      firstName: "Akrom2"
      lastName: "Tester2"
    }
  ) {
    _id
    firstName
    lastName
    address
  }
}

# mutation to resend confirmation email
mutation resendConfirmation{
  resendConfirmation(input:{email:"kejek4196@opetron.com"}){
    message
  }
}

# user need to confirm email via confirmation email to be able to login
mutation login {
  login(input: { email: "akrom@test.com", password: "akrom" }) {
    token
    userId
  }
}

# Mutation to send 6-digit OTP to an email. 
mutation sendResetPasswordOTP{
  sendResetPasswordOTP(input:{email:"vapeti2463@opetron.com"}){
    message
    success
    userId
  }
}

# Mutation to reset user password after recieving OTP
mutation resetPassword{
  resetPassword(input:{userId:"5fbb5aafee3fb87c9230d3e9",password: "akromnew", otp: 647609}){
    message
    success
  }
}
```

## Admin mutations
```graphql
mutation createStore {
  createStore(
    input: {
      email: "example@store.com"
      password: "example"
      name: "Example"
      phone: "+8210 5232323232"
      address: "Somethere nearby"
    }
  ) {
    _id
    email
    phone
  }
}

mutation createProduct {
  createProduct(
    input: {
      storeId: "5fb127be071b64f1a9b25002"
      title: "Third Product"
      price: 139
      imageUrl: "Url 3"
      description: "Here goes short description"
    }
  ) {
    _id
    price
    title
    storeId
    description
  }
}
``` 
## User mutations
```graphql
mutation createOrder{
  createOrder(
    input:{ 
      products: [
          {productId:"5fb1298205ddb9f2422951de", quantity: 1},
          {productId:"5fb1299605ddb9f2422951df", quantity: 3}
        ]
      }
  ) {
    _id
  }
}
``` 
