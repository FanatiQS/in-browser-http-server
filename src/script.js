// Initializes service worker with file system access and navigates to project path
async function initialize(path) {
	const serviceWorker = await navigator.serviceWorker.register("service_worker.js");
	await navigator.serviceWorker.ready;
	serviceWorker.active.postMessage(await window.showDirectoryPicker());
	await new Promise((resolve) => navigator.serviceWorker.addEventListener("message", resolve, { once: true }));
	location.replace(`/project/${path}`);
}
