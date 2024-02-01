# In-Browser HTTP Server
Allows opening a locally stored website without an HTTP server or being restricted by file protocol.
Many popular features such as ES6 modules and fetch are not available when served from the file system.
No files are uploaded to anywhere.

## Usage
Navigate to https://fanatiqs.github.io/in-browser-http-server/src/, click one of the buttons to select the directory to serve files from.
The initial file navigated to when directory is selected is `index.html`.

When you want to open another directory, just navigate to the same root page again an select another directory.

## Live directory
A live directory allows reading files that have changed, been created or renamed after initial selection.
This is done using the `showDirectoryPicker` but is not widely supported yet ([browser support](https://caniuse.com/?search=showdirectorypicker)).
A non live directory gets access to the the files found when directory is selected.
Files created after selection will not be accessible and if a file is changed, or renamed, it will no longer be available.

## How it works
It utilizes a service worker together with the File System API to respond to HTTP requests within the page itself without ever leaving your local machine.
