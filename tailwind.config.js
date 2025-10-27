/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	// Soporta tanto .dark como [data-theme="dark"]
	darkMode: ["class", '[data-theme="dark"]'],

	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: { "2xl": "1400px" },
		},
		extend: {
			colors: {
				// --- Tokens base que faltaban ---
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				muted: "hsl(var(--muted))",
				"muted-foreground": "hsl(var(--muted-foreground))",

				// --- Tu paleta corporativa ---
				primary: {
					DEFAULT: "hsl(240 90% 33%)",
					foreground: "hsl(0 0% 100%)",
				},
				destructive: {
					DEFAULT: "hsl(0 84.2% 60.2%)",
					foreground: "hsl(0 0% 100%)",
				},

				// --- Tokens shadcn restantes (ya los tenías) ---
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.1s ease-out",
				"accordion-up": "accordion-up 0.1s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
