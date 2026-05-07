import type { BatchItem } from '../types';
import { toSlug } from '../utils/slug';
import { FolderIcon, PlusIcon } from './icons';

interface Props {
  items: BatchItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function BatchSidebar({ items, activeId, onSelect, onRename, onRemove, onAdd }: Props) {
  return (
    <aside className="batch-sidebar glass">
      <div className="batch-sidebar__head">
        <span className="batch-sidebar__count mono">
          {items.length} {items.length === 1 ? 'image' : 'images'}
        </span>
        <button className="batch-sidebar__add" onClick={onAdd} title="Add images">
          <PlusIcon size={14} />
        </button>
      </div>

      <div className="batch-sidebar__list">
        {items.map((item) => {
          const slug = toSlug(item.customFilename) || 'image';
          return (
            <div
              key={item.id}
              className={`batch-item${item.id === activeId ? ' batch-item--active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <div className="batch-item__thumb">
                <img src={item.thumbnailUrl} alt="" />
              </div>
              <div className="batch-item__body" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={item.customFilename}
                  spellCheck={false}
                  onChange={(e) => onRename(item.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={item.originalFilename}
                />
                <span className="batch-item__slug mono" title={slug}>
                  {slug}
                </span>
              </div>
              <button
                className="batch-item__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                title="Remove"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div className="batch-sidebar__foot">
        <button className="ghost-btn" onClick={onAdd}>
          <FolderIcon size={14} />
          <span>Add more images</span>
        </button>
      </div>
    </aside>
  );
}
