var debugMode = new URLSearchParams(location.search).get('debug') === 'true';
//id="logo"のimgがクリックされたらdebugModeをトグルする
const logo = document.getElementById('logo');
if (logo) {
	logo.addEventListener('click', () => {
		debugMode = !debugMode;
		console.log('Debug mode is ' + (debugMode ? 'enabled' : 'disabled') + '.');
		// const url = new URL(location.href);
		// url.searchParams.set('debug', !debugMode);
		// location.replace(url.toString());
	});
}

if (debugMode) {
	console.log('Debug mode is enabled.');
	// デバッグモードの場合はService Workerを削除する
	navigator.serviceWorker.getRegistrations().then(registrations => {
		for (let registration of registrations) {
			registration.unregister();
		}
	});
} else {
try {
	const a = navigator.serviceWorker.register("/sw.js", { scope: "/", type: "module" })
} catch (e) { console.error(e) }
}

window.onload = () => {
	var e = document.getElementById("login-form");
	e && (e.onsubmit = e => {
		e.preventDefault(),
		fetch(new Request("/sw-login", { method: "POST", body: document.getElementById("password").value })),
		location.href = (new URLSearchParams(location.search).get("rd") || "/") + `?debug=${debugMode}`;
	}),
		document.querySelectorAll("[data-plain]").forEach(l => {
			fetch(l.dataset.plain)
				.then(e => (401 == e.status && !debugMode && (location.href = `/login.html?rd=${location.pathname}&error=true`), e.text()))
				.then(e => { l.innerHTML = e })
		})
};

const isLineWebBrowser = () => {
	const userAgent = navigator.userAgent;
	const isLineWebOpen = /Line/i.test(userAgent);
	return isLineWebOpen;
};

const isLineWebOpen = isLineWebBrowser();
if (isLineWebOpen) {
	const url = new URL(location.href);
	url.searchParams.set('openExternalBrowser', '1');
	location.replace(url.toString());
}

const hasError = new URLSearchParams(location.search).get('error');
console.log(hasError);
if (hasError == 'true') {
	document.getElementById('error').style.display = 'block';
	// パラメータを削除
	const url = new URL(location.href);
	url.searchParams.delete('error');
	history.replaceState(null, '', url.toString());
}
