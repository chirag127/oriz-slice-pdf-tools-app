import { useState, useCallback, useRef } from "react";
import { formatBytes, MAX_FILE_SIZE } from "../../lib/utils/fileValidation";

interface FileDropzoneProps {
	accept: string[];
	multiple?: boolean;
	maxSize?: number;
	onFiles: (files: File[]) => void;
	title?: string;
	subtitle?: string;
}

/*
 * FileDropzone — manuscript-styled. Single dashed leaf, italic prompt,
 * mono caption with file size. NO icon, NO emoji — the brief forbids them
 * in chrome. Errors render in vermilion (the only allowed CTA-adjacent
 * vermilion: validation errors).
 */
export function FileDropzone({
	accept,
	multiple = false,
	maxSize = MAX_FILE_SIZE,
	onFiles,
	title = "Drop a leaf, or click to browse",
	subtitle,
}: FileDropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const acceptString = accept.join(",");

	const handleFiles = useCallback(
		(fileList: FileList | null) => {
			if (!fileList) return;
			const files = Array.from(fileList);
			for (const file of files) {
				if (file.size > maxSize) {
					setError(`Leaf too large. Max: ${formatBytes(maxSize)}.`);
					return;
				}
			}
			setError(null);
			onFiles(files);
		},
		[maxSize, onFiles],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		},
		[handleFiles],
	);

	const handleClick = () => inputRef.current?.click();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleFiles(e.target.files);
	};

	return (
		<div className="dz-wrap">
			<button
				type="button"
				className={`dz ${isDragging ? "dz-on" : ""}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={handleClick}
				aria-label="Upload files"
			>
				<span className="dz-prompt">{title}</span>
				{subtitle && <span className="dz-sub">{subtitle}</span>}
				<span className="dz-meta">
					{accept.join(" · ")} · max {formatBytes(maxSize)}
				</span>
			</button>

			<input
				ref={inputRef}
				type="file"
				accept={acceptString}
				multiple={multiple}
				onChange={handleChange}
				className="dz-input"
			/>

			{error && <p className="dz-err">{error}</p>}

			<style>{`
				.dz-wrap { width: 100%; font-family: var(--font-serif); }
				.dz {
					position: relative;
					width: 100%;
					min-height: 200px;
					padding: 2.5rem 1.5rem;
					background: transparent;
					border: 1px dashed var(--rule);
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					font-family: inherit;
					color: var(--ink);
					transition: border-color 120ms;
				}
				.dz:hover, .dz-on {
					border-color: var(--ledger);
					color: var(--ledger);
				}
				.dz:focus-visible {
					outline: 2px solid var(--ledger);
					outline-offset: 4px;
				}
				.dz-prompt {
					font-family: var(--font-serif);
					font-style: italic;
					font-size: 1.0625rem;
					color: inherit;
				}
				.dz-sub {
					font-family: var(--font-serif);
					font-size: 14px;
					color: var(--margin);
				}
				.dz-meta {
					font-family: var(--font-mono);
					font-size: 12px;
					color: var(--margin);
					letter-spacing: 0.06em;
				}
				.dz-input { display: none; }
				.dz-err {
					margin: 0.75rem 0 0;
					padding: 0.625rem 0.875rem;
					font-family: var(--font-serif);
					font-style: italic;
					font-size: 14px;
					color: var(--vermilion);
					border: 1px solid color-mix(in oklab, var(--vermilion) 50%, transparent);
					background: color-mix(in oklab, var(--vermilion) 8%, transparent);
				}
			`}</style>
		</div>
	);
}

interface FileListProps {
	files: File[];
	onRemove: (index: number) => void;
	onReorder?: (from: number, to: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
	if (files.length === 0) return null;

	return (
		<ul className="fl">
			{files.map((file, index) => (
				<li key={`${file.name}-${index}`} className="fl-item">
					<span className="fl-num mono">
						{(index + 1).toString().padStart(2, "0")}
					</span>
					<span className="fl-name">{file.name}</span>
					<span className="fl-size mono">{formatBytes(file.size)}</span>
					<button
						type="button"
						onClick={() => onRemove(index)}
						className="fl-x"
						aria-label={`Remove ${file.name}`}
					>
						×
					</button>
				</li>
			))}

			<style>{`
				.fl {
					list-style: none;
					padding: 0;
					margin: 1.25rem 0 0;
					font-family: var(--font-serif);
					border-top: 1px solid var(--rule);
				}
				.fl-item {
					display: grid;
					grid-template-columns: 4ch 1fr auto 2.5ch;
					align-items: center;
					gap: 0.875rem;
					padding: 0.75rem 0;
					border-bottom: 1px solid var(--rule);
				}
				.fl-num {
					font-family: var(--font-mono);
					font-size: 12px;
					color: var(--margin);
					letter-spacing: 0.06em;
				}
				.fl-name {
					font-size: 14px;
					color: var(--ink);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.fl-size {
					font-family: var(--font-mono);
					font-size: 12px;
					color: var(--margin);
					letter-spacing: 0.04em;
				}
				.fl-x {
					background: transparent;
					border: 0;
					color: var(--margin);
					font-family: var(--font-serif);
					font-size: 1.125rem;
					line-height: 1;
					cursor: pointer;
					padding: 0;
					width: 100%;
					text-align: right;
				}
				.fl-x:hover { color: var(--vermilion); }
			`}</style>
		</ul>
	);
}
