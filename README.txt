How to setup the project

1. ChatGPT api key file in the "admin/chatgptConfig.js", set the "apiKey" variable value to the api key
2. Update firebase config in the "src/firebaseConfig.js" file. Update the "firebaseConfig" value, copy it from firebase.
   You have to create a firebase project, its free
3. Update the ".htaccess" and ".htpasswd" files in the "admin" folder.
   ".thaccess": After "AuthUserFile" use the relative path on your webserver. to get this you can use the "path.php", simply open it on your webserver and it Will write the relative path
   ".htpasswd": "https://hostingcanada.org/htpasswd-generator/" If you want to change the username: "admin", password: "admin", generate new code with the site, and update this file