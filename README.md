## Table Of Contents
- [About-this-project](#About-this-project)
- [Directory-Strucure](#Directory-Structure)
- [Getting-Started](#Getting-Started)
- [Dependancies](#Dependancies)

## About this Project

### What is Notes?

    * Notes app is a note-taking application.

    * In Notes app User can Create notes with title and description of notes. It usefull to user as user just need to make one note for any event and application will stores details of notes and user simply refer as per his/her convenience.
 
## Directory Structure

```
  +--/Controllers 
     +-- [controller for request and response from database]
  +--/Note Controller
     +-- [methods for maintain note details(CRUD)]
  +--/Models 
     +-- [models for note detail and message]
  +-- /screens
    +-- [All Component Use In Notes app]
  +-- /Add Note
    +-- [add note details]
  +--/Home 
     +-- [list all notes]
  +--/List Notes 
     +-- [scroll view for notes]
  +--/Note View 
     +-- [shows one note]
  +--/Routes 
     +-- [routing between screens]   
  +--/Update Note 
     +-- [update notes]        
```

## Getting started
1. git clone https://github.com/rajgohel0001/Notes-app.git

2. Install NodeJS 

3. Install react-native-cli globally on your computer
   npm install -g react-native-cli

4. Enter the project folder and run the following command to get all right files in the right place
     `npm install`

5. Install an IDE(like visual studio code),visual studio is recommended,beacuse it has great Commandline integration and javascript building/debugging features.

6. Conect Android Device with your computer and device is in devlopment mode.

7. react-native start,react-native run-android and react-native log-android Execute these command in commandline of visual studio code.

8. Open the project in visual studio code.

9. The apllication can be accessed in connected device at localhost:8081.


### `react-native start`

Runs the app in the development mode.

### `react-native run-android`

View Application in Connected device 

### `npm test`

Run example app tests with:

npm test

Note: Jest testing does not yet work on node versions after 0.10.x.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

You can learn more in the [Create React Native App documentation](https://facebook.github.io/react-native/docs/getting-started).

To learn React Native, check out the [React documentation](https://facebook.github.io/react-native/docs/tutorial).


### Deployment

This section has moved here: https://facebook.github.io/react-native/docs/signed-apk-android

## Dependancies

* Open package.json to see all development and production dependencies or run npm ls in the project root directory for all installed dependencies.

* Follow to install react-native-sqlite-storage ref.url: https://github.com/andpor/react-native-sqlite-storage. Sqlite storage is mainly usefull to store database and perform opretaions(CRUD) on database. 