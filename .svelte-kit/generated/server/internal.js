
import root from '../root.svelte';
import { set_building } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: false,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\" />\r\n  <link rel=\"icon\" type=\"image/svg+xml\" href=\"" + assets + "/favicon.ico\" />\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n  <title>Hyper chat App</title>\r\n  " + head + "\r\n  <style>\r\n    :root {\r\n      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\r\n      --primary:#bb86fc; \r\n      --primary-variant:#3700b3; \r\n      --on-primary:#000000;\r\n      --secondary:#03dac6;\r\n      --secondary-variant:#018786;\r\n      --on-secondary:#000000;\r\n      --error:#cf6679;\r\n      --on-error:#000000;\r\n      --background:#121212;\r\n      --on-background:#ffffff;\r\n      --surface:#161616;\r\n      --on-surface:#ffffff;\r\n    }\r\n\r\n    body {\r\n      height: 100vh;\r\n      width: 100vw;\r\n      margin: 0;\r\n      padding: 0;\r\n      overflow: auto;\r\n\r\n      @supports (min-height: 100dvh) {\r\n        height: 100dvh;\r\n        width: 100dvw;\r\n      }\r\n    }\r\n\r\n    button {\r\n      background-color: var(--primary);\r\n      color: var(--on-primary);\r\n      border: .2ch solid var(--primary-variant);\r\n      width: fit-content;\r\n      border-radius: .225em;\r\n    }\r\n\r\n    button:hover {\r\n      background-color: var(--primary-variant);\r\n      color: var(--primary);\r\n      border: .2ch solid var(--primary);\r\n      filter: drop-shadow(0em 0em .125em var(--primary));\r\n      transition: all 170ms ease-in-out;\r\n    }\r\n  </style>\r\n</head>\r\n\r\n<body>\r\n  <div style=\"display: contents\">\r\n    " + body + "\r\n  </div>\r\n</body>\r\n\r\n</html>",
		error: ({ status, message }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n\t\t\t\t\tUbuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "ntywz8"
};

export function get_hooks() {
	return {};
}

export { set_assets, set_building, set_private_env, set_public_env };
