# jsramverk-editor-backend

Backend codebase for editor app.

## This repo is for editor app in course jsramverk at BTH

Made with the use of Javascript and Node.js.
MongoDb for storing documents from the editor.

## Prerequisites

- Make sure your have a Node.js installed.
- Make sure you have your database setup.

## Installation

Install all the npm dependencies with the following command:

```bash
npm install
```

To run the server in terminal enter the following command:

```bash
npm start
```
- The backend API should be available at [http://localhost:1337/editor](http://localhost:1337/editor).

## Routes

The routing for the editor is set with Express using the root of the app('/').
Get method is used to get a single or all the documents from the MongoDb database.
To add a new document or update an existing one, Methods post and put is used respectively.
