import { forwardRef, useRef, useState } from 'react';
import type {
  ClipboardEvent,
  DragEvent,
  HTMLAttributes,
  CSSProperties,
  KeyboardEvent,
} from 'react';
import { Icon } from '../core/Icon';

export interface FileDropProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'style' | 'onDrop'> {
  label?: string;
  /** Mono constraint line, e.g. "PNG, JPG ou PDF até 10 MB". */
  hint?: string;
  icon?: string;
  /** Comma-separated MIME types/extensions, same syntax as the native `accept` attribute — also used to validate files before `onFiles` fires. */
  accept?: string;
  maxSizeBytes?: number;
  onFiles?: (files: File[]) => void;
  /** Files rejected by `accept`/`maxSizeBytes`, with the reason. */
  onReject?: (rejected: { file: File; reason: 'type' | 'size' }[]) => void;
  style?: CSSProperties;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((p) => p.trim().toLowerCase());
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern);
    if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
    return file.type.toLowerCase() === pattern;
  });
}

function partitionFiles(
  files: File[],
  accept: string | undefined,
  maxSizeBytes: number | undefined,
) {
  const accepted: File[] = [];
  const rejected: { file: File; reason: 'type' | 'size' }[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'type' });
    else if (maxSizeBytes && file.size > maxSizeBytes) rejected.push({ file, reason: 'size' });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

/** Dashed drop zone for uploads and photo capture fields — the only dashed border in the system, reserve it for drop targets. */
export const FileDrop = forwardRef<HTMLLabelElement, FileDropProps>(function FileDrop(
  {
    label = 'Arraste um arquivo ou clique para escolher',
    hint = 'PNG, JPG ou PDF até 10 MB',
    icon = 'upload',
    accept,
    maxSizeBytes,
    onFiles,
    onReject,
    style,
    ...rest
  },
  ref,
) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: File[]) => {
    const { accepted, rejected } = partitionFiles(files, accept, maxSizeBytes);
    if (accepted.length) onFiles?.(accepted);
    if (rejected.length) onReject?.(rejected);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const onPaste = (e: ClipboardEvent<HTMLLabelElement>) => {
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length) handleFiles(files);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <label
      ref={ref}
      tabIndex={0}
      role="button"
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-8) var(--space-5)',
        textAlign: 'center',
        borderRadius: 'var(--radius-md)',
        background: over ? 'var(--glass-2)' : 'var(--glass-1)',
        border: `1px dashed ${over ? 'var(--line-focus)' : 'var(--line-strong)'}`,
        cursor: 'pointer',
        transition: 'background var(--motion-hover), border-color var(--motion-hover)',
        ...style,
      }}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
      />
      <Icon name={icon} size="lg" color="var(--text-tertiary)" />
      <span
        style={{
          font: 'var(--weight-medium) var(--text-md)/1.3 var(--font-sans)',
          color: 'var(--text-heading)',
        }}
      >
        {label}
      </span>
      <span style={{ font: 'var(--label-mono)', color: 'var(--text-tertiary)' }}>{hint}</span>
    </label>
  );
});
