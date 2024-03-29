// Initializes service worker with file system access and navigates to project path
async function initialize(root) {
	const serviceWorker = await navigator.serviceWorker.register("service_worker.js");
	await navigator.serviceWorker.ready;
	console.log("Service worker ready");

	serviceWorker.active.postMessage(await root);
	await new Promise((resolve) => navigator.serviceWorker.addEventListener("message", resolve, { once: true }));
	console.log("Service worker initialized");

	location.replace(`./project/`);
}
