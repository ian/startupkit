import "@fontsource-variable/inter"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import App from "./App"
import { DocsPage } from "./pages/docs"
import { PrivacyPage } from "./pages/privacy"
import { TermsPage } from "./pages/terms"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/docs" element={<DocsPage />} />
					<Route path="/privacy" element={<PrivacyPage />} />
					<Route path="/terms" element={<TermsPage />} />
				</Routes>
			</BrowserRouter>
		</HelmetProvider>
	</React.StrictMode>
)
