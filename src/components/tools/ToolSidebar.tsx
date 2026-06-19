import { tools } from "../../data/tools";

interface ToolSidebarProps {
	currentSlug: string;
}

export function ToolSidebar({ currentSlug }: ToolSidebarProps) {
	const currentTool = tools.find((t) => t.slug === currentSlug);
	if (!currentTool) return null;

	const relatedTools = tools.filter(
		(t) => t.category === currentTool.category && t.slug !== currentSlug,
	);

	const steps = [
		{ num: 1, text: "Open your leaf with drop or browse." },
		{ num: 2, text: "Set the implements (range, password, watermark text…)." },
		{ num: 3, text: "Bind the document and save it back to disk." },
	];

	return (
		<aside className="ts">
			<section>
				<h3 className="ts-h">related implements</h3>
				<ul className="ts-list">
					{relatedTools.map((tool) => (
						<li key={tool.slug}>
							<a href={`/tools/${tool.slug}/`} className="ts-a">
								{tool.name.toLowerCase()}
							</a>
						</li>
					))}
				</ul>
			</section>

			<section>
				<h3 className="ts-h">three movements</h3>
				<ol className="ts-steps">
					{steps.map((step) => (
						<li key={step.num}>
							<span className="ts-step-num">{step.num.toString().padStart(2, "0")}</span>
							<span>{step.text}</span>
						</li>
					))}
				</ol>
			</section>

			<section>
				<h3 className="ts-h">on-device</h3>
				<p className="ts-promise">
					Every leaf you open is read into your browser, worked on locally,
					and saved back. No upload, no server, no copy kept.
				</p>
			</section>

			<style>{`
				.ts {
					font-family: var(--font-serif);
					color: var(--ink);
					display: flex;
					flex-direction: column;
					gap: 1.75rem;
				}
				.ts-h {
					font-family: var(--font-serif);
					font-size: 13px;
					font-feature-settings: 'smcp' 1;
					letter-spacing: 0.12em;
					color: var(--margin);
					font-weight: 500;
					margin: 0 0 0.625rem;
					padding-bottom: 0.5rem;
					border-bottom: 1px solid var(--rule);
				}
				.ts-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0.375rem;
				}
				.ts-a {
					font-family: var(--font-serif);
					font-size: 14px;
					color: var(--ink);
					text-decoration: none;
				}
				.ts-a:hover {
					color: var(--ledger);
					text-decoration: underline;
					text-decoration-color: var(--ledger);
					text-underline-offset: 3px;
				}
				.ts-steps {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0.625rem;
				}
				.ts-steps li {
					display: grid;
					grid-template-columns: 3ch 1fr;
					gap: 0.625rem;
					font-size: 14px;
					line-height: 1.55;
					color: var(--ink);
				}
				.ts-step-num {
					font-family: var(--font-mono);
					font-size: 12px;
					color: var(--margin);
					letter-spacing: 0.06em;
				}
				.ts-promise {
					font-family: var(--font-serif);
					font-style: italic;
					font-size: 14px;
					line-height: 1.6;
					color: var(--margin);
					margin: 0;
				}
			`}</style>
		</aside>
	);
}
