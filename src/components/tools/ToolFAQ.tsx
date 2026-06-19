interface FAQItem {
	question: string;
	answer: string;
}

interface ToolFAQProps {
	items: FAQItem[];
	toolName: string;
}

export function ToolFAQ({ items }: ToolFAQProps) {
	if (items.length === 0) return null;

	const schema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return (
		<section className="faq">
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
			<h2 className="faq-h">Frequently asked</h2>
			<dl className="faq-list">
				{items.map((item, index) => (
					<details key={index} className="faq-item">
						<summary>
							<span className="faq-mark">§</span>
							<span className="faq-q">{item.question}</span>
						</summary>
						<p className="faq-a">{item.answer}</p>
					</details>
				))}
			</dl>

			<style>{`
				.faq {
					margin-top: 3rem;
					padding-top: 2rem;
					border-top: 1px solid var(--rule);
					font-family: var(--font-serif);
				}
				.faq-h {
					font-family: var(--font-display);
					font-weight: 500;
					font-size: 1.5rem;
					letter-spacing: -0.005em;
					color: var(--ink);
					margin: 0 0 1.5rem;
				}
				.faq-list {
					margin: 0;
					padding: 0;
					display: flex;
					flex-direction: column;
				}
				.faq-item {
					border-bottom: 1px solid var(--rule);
				}
				.faq-item summary {
					list-style: none;
					display: grid;
					grid-template-columns: 2ch 1fr;
					gap: 0.75rem;
					align-items: baseline;
					padding: 1rem 0;
					cursor: pointer;
					font-family: var(--font-serif);
				}
				.faq-item summary::-webkit-details-marker { display: none; }
				.faq-mark {
					font-family: var(--font-display);
					font-style: italic;
					color: var(--ledger);
					font-size: 1.0625rem;
				}
				.faq-q {
					font-size: 1.0625rem;
					color: var(--ink);
					line-height: 1.5;
				}
				.faq-item[open] .faq-q { color: var(--ledger); }
				.faq-a {
					grid-column: 2;
					padding: 0 0 1rem 2.75ch;
					font-size: 1rem;
					line-height: 1.7;
					color: var(--ink);
					margin: 0;
				}
			`}</style>
		</section>
	);
}
