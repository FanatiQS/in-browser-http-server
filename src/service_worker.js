// File system API reference received from initializer
let root;

// Hands over file system access from root to service worker
addEventListener("message", function (event) {
	console.log("Service worker initializing");
	root = event.data;
	event.source.postMessage("initialized");
});

// Gets file from file system
async function readFile(path) {
	if (root.constructor === FileSystemDirectoryHandle) {
		const directoryNames = path.split("/");
		const fileName = directoryNames.pop();
		let directoryHandle = root;
		for (const directoryName of directoryNames) {
			directoryHandle = await directoryHandle.getDirectoryHandle(directoryName);
		}
		const fileHandle = await directoryHandle.getFileHandle(fileName);
		return await fileHandle.getFile();
	}

	return Array.prototype.find.call(root, (file) => {
		return path === file.webkitRelativePath.slice(file.webkitRelativePath.indexOf("/") + 1);
	});
}

// Wraps files content from file system in response
async function createResponse(path) {
	console.log("Service worker fetch response:", path);
	const file = await readFile(path);
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
	event.respondWith(createResponse(match[1] || "index.html"));
});
