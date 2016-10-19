# TidyArchitecture

> Because there's more to life than building boilerplate code

TidyArchitecture is a Node script to automate certain aspects of building [Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) applications in .NET.

## Configuration

In `config.js`, you will need to tell the script a little bit about your Visual Studio solution.

```js
module.exports = {
    // The root name of your project
    rootNamespace: 'AwesomeApp',

    // Filepath to your Visual Studio root directory
    solution: 'C:\\dev\\github\\awesome-app',

    // String array containing domain folder structure
    entities: [
        'Identity/Role',
        'Identity/User',
        'Customer/Customer',
        'Customer/CustomerPhone',
        'Customer/CustomerEmail',
        'Product/Product',
        'Product/ProductPhoto',
        'Order/Order',
        'Order/OrderItem'
    ]
};
```

## Usage

After editing configuration file, type `npm start` to run the application.