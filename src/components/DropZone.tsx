import { useRef, useState } from 'react';
import { PlusIcon } from './icons';

interface Props {
  onFile: (file: File) => void;
}

export function DropZone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please drop an image file (JPEG, PNG, WebP, GIF, AVIF, etc.)');
      return;
    }
    onFile(file);
  }

  return (
    <div
      className={`dropzone${hover ? ' dropzone--hover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="dropzone__plate glass">
        <div className="dropzone__icon">
          <PlusIcon size={28} />
        </div>
        <h2>Drop an image to begin</h2>
        <p>or click to choose a file</p>
        <div className="dropzone__formats">
          <span>JPEG</span>
          <span>PNG</span>
          <span>WebP</span>
          <span>AVIF</span>
          <span>GIF</span>
          <span>BMP</span>
        </div>
      </div>
    </div>
  );
}
