/** @type {import('tailwindcss').Config} */
export default {
	// 1. Rutas de contenido: Le dice a Tailwind qué archivos escanear
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	// 2. Modo de tema: Usa variables CSS (lo configura Shadcn)
	darkMode: ["class"],

	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				// --- COLORES CORPORATIVOS UNILEVER ---
				// Se define el color primario usando la aproximación HSL del #0F0E9A
				primary: {
					DEFAULT: "hsl(240 90% 33%)", // Azul de Unilever
					foreground: "hsl(0 0% 100%)", // Texto blanco sobre el azul
				},
				// Color para alertas y errores (e.g., ZC, No Conforme)
				destructive: {
					DEFAULT: "hsl(0 84.2% 60.2%)", // Rojo estándar de alerta
					foreground: "hsl(0 0% 100%)",
				},
				// --- COLORES BASE DE SHADCN (Necesarios para el resto de componentes) ---
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
