import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

declare const process: { env: Record<string, string | undefined> };

const rawBase = (process.env.BASE_PATH ?? "").trim();
const base: "" | `/${string}` =
	rawBase === "" || rawBase === "/"
		? ""
		: (`/${rawBase.replace(/^\/+/, "").replace(/\/+$/, "")}` as `/${string}`);

export default defineConfig({
	ssr: {
		noExternal: ["@lucide/svelte"],
	},
	plugins: [
		sveltekit({
			paths: {
				base,
			},

			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
			},

			adapter: adapter({
				pages: "build",
				assets: "build",
				fallback: undefined,
				precompress: false,
				strict: true,
			}),

			prerender: {
				handleMissingId: "warn",
			},
		}),
	],
});
