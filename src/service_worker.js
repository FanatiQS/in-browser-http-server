// File system API reference received from initializer
let fs;

// Hands over file system access from root to service worker
addEventListener("message", function (event) {
	console.log("Service worker initializing");
	fs = event.data;
	event.source.postMessage("initialized");
});

// Gets content type from file extension
function getContentType(path) {
	switch (path.slice(path.lastIndexOf(".") + 1)) {
		case "html": return "text/html";
		case "js":   return "text/javascript";
		case "css": return "text/css";

		case "json": return "application/json";

		case "jped": return "image/jpeg";
		case "jpg": return "image/jpeg";
		case "png": return "image/png";
		case "svg": return "image/svg+xml";

		case "ttf": return "font/ttf";

		default: return "text/plain";
	}
}

// Reads files content from file system
async function readFile(path) {
	console.log("Service worker fetch response:", path);
	const fileHandle = await fs.getFileHandle(path);
	const file = await fileHandle.getFile();
	const mime = getContentType(path);
	console.log("Service worker fetch mime type:", mime);
	return new Response(await file.text(), {
		headers: {
			"Content-Type": mime
		}
	});
}

// Intercepts requests to /project/* path with files from filesystem
addEventListener("fetch", function (event) {
	console.log("Service worker fetch request:", event.request.url);
	console.log(location);
	const match = new URL(event.request.url).pathname.match(/\/project\/(.*)/);
	if (match == null) return;
	event.respondWith(readFile(match[1] || "index.html"));
});
