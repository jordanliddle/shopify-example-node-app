# Shopify Example Node App

This repository is home to the code examples highlighted in various [Shopify API tutorials](http://docs.myshopify.io/api/tutorials/). They are designed solely for the purpose of introducing new developers to the Shopify API. This example app was developed on [Express](https://expressjs.com/), but the concepts presented will also apply to developers building applications in other languages such as Python, Ruby and PHP.

## Requirements

* [Node](https://nodejs.org/en/)
* [Shopify Partners account](https://developers.shopify.com/)

## Credentials

Follow [this guide](https://help.shopify.com/api/guides/api-credentials#generate-public-app-credentials) to obtain your public app credentials from your Shopify Partners account.

This example apps use a `.env` file to store app credentials. After cloning the repository, you will need to create a file named .env in the same folder of the tutorial. Copy the values of the API Key and API Secret from your partner dashboard, and add them to the .env file in the following format:

```
API_KEY=YOUR_API_KEY
API_SECRET=YOUR_SECRET_KEY
APP_URL=YOUR_APP_URL
APP_REDIRECT_URI=YOUR_APP_REDIRECT_URL
```

where `YOUR_API_KEY` and `YOUR_SECRET_KEY` are the values of your application's API key and secret key respectively and
`YOUR_APP_URL` are `YOUR_REDIRECT_URI` are App URL and Whitelisted redirection URL(s) values that you had defined in your app settings. 

## App URL

This tutorial series uses [ngrok](https://ngrok.com/) to create a secure tunnel from the internet to your local machine. 

## Running the app

`$ node app.js`

