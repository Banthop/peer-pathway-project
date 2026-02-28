import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1280px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					blue: '#3B82F6',
					emerald: '#10B981',
					amber: '#F59E0B',
					rose: '#F43F5E',
					violet: '#8B5CF6',
					indigo: '#6366F1',
					cyan: '#06B6D4',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				dark: {
					DEFAULT: 'hsl(var(--dark-bg))',
					foreground: 'hsl(var(--dark-foreground))'
				},
				surface: {
					elevated: '#FFFFFF',
					subtle: '#F3F4F6',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'sans-serif'
				],
				mono: [
					'Space Mono',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace'
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
				'30': '7.5rem'
			},
			keyframes: {
				float: {
					'0%, 100%': {
						transform: 'translateY(0) rotate(var(--tw-rotate, 0deg))'
					},
					'50%': {
						transform: 'translateY(-12px) rotate(var(--tw-rotate, 0deg))'
					}
				},
				'float-reverse': {
					'0%, 100%': {
						transform: 'translateY(0) rotate(var(--tw-rotate, 0deg))'
					},
					'50%': {
						transform: 'translateY(10px) rotate(var(--tw-rotate, 0deg))'
					}
				},
				'float-gentle': {
					'0%, 100%': {
						transform: 'translateY(0) translateX(0) rotate(var(--tw-rotate, 0deg))'
					},
					'33%': {
						transform: 'translateY(-8px) translateX(3px) rotate(var(--tw-rotate, 0deg))'
					},
					'66%': {
						transform: 'translateY(-4px) translateX(-2px) rotate(var(--tw-rotate, 0deg))'
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0) rotate(var(--tw-rotate, 0deg))'
					},
					'50%': {
						transform: 'translateY(-6px) rotate(var(--tw-rotate, 0deg))'
					}
				},
				ripple: {
					'0%, 100%': {
						transform: 'translate(-50%, -50%) scale(1)'
					},
					'50%': {
						transform: 'translate(-50%, -50%) scale(0.9)'
					}
				},
				grid: {
					'0%': {
						transform: 'translateY(-50%)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'fade-up': {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-left': {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(-50%)'
					}
				}
			},
			animation: {
				float: 'float 6s ease-in-out infinite',
				'float-reverse': 'float-reverse 7s ease-in-out infinite',
				'float-gentle': 'float-gentle 8s ease-in-out infinite',
				'float-slow': 'float-slow 10s ease-in-out infinite',
				ripple: 'ripple 3s ease-in-out infinite',
				grid: 'grid 60s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.6s ease-out',
				'slide-left': 'slide-left 25s linear infinite'
			},
			boxShadow: {
				'2xs': 'var(--shadow-2xs)',
				xs: 'var(--shadow-xs)',
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
