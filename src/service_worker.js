// File system API reference received from initializer
let fs;

// Mocks FileSystemDirectoryHandler for FileList
function getFileHandleWrapper(path) {
	return { getFile: () => Array.prototype.find.call(this, (file) => file.name === path) };
}

// Hands over file system access from root to service worker
addEventListener("message", function (event) {
	console.log("Service worker initializing");
	fs = event.data;
	if (!fs.getFileHandle) {
		fs.getFileHandle = getFileHandleWrapper;
	}
	event.source.postMessage("initialized");
});

// Reads files content from file system
async function readFile(path) {
	console.log("Service worker fetch response:", path);
	const fileHandle = await fs.getFileHandle(path);
	const file = await fileHandle.getFile();
	console.log("Service worker fetch mime type:", file.type);
	return new Response(await file.text(), {
		headers: {
			"Content-Type": file.type
		}
	});
}

// Intercepts requests to /project/* path with files from filesystem
addEventListener("fetch", function (event) {
	console.log("Service worker fetch request:", event.request.url);
	const match = new URL(event.request.url).pathname.match(/\/project\/(.*)/);
	if (match == null) return;
	event.respondWith(readFile(match[1] || "index.html"));
});
