mutation createStore{
  createStore(input:{email:"example@store.com",password:"example", name:"Example", phone: "+8210 5232323232",address:"Somethere nearby"}){
    _id
    email
    phone
  }
}

mutation createProduct{
  createProduct(input:{storeId:"5fb127be071b64f1a9b25002",title:"Third Product", price:139,imageUrl:"Url 3", description:"Here goes short description"}){
    _id
    price
    title
    storeId
    description
  }
}

query products{
  products{
    _id
    title
    imageUrl
    storeId
    description
  }
}
query product{
  product(_id:"5fb1298205ddb9f2422951de"){
    _id
    title
    imageUrl
    description
    store{
      _id
      name
    }
  }
}

query stores{
  stores{
    _id
    name
    products{
      _id
      title
    }
  }
}
query store{
  store(_id:"5fb127be071b64f1a9b25002"){
    _id
    name
    products{
      _id
      title
    }
  }
}

mutation signup{
  signup(input:{email:"akrom2@test.com",password:"akrom2", firstName:"Akrom2",lastName:"Tester2"}){
    _id
    firstName
    lastName
    address
  }
}
mutation login{
  login(input:{email:"akrom@test.com",password:"akrom"}){
    token
    userId
  }
}