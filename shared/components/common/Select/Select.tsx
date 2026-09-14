import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '@/shared/components/icons';
import { useEscapeKey } from '@/shared/hooks';
import type { SelectProps } from './select.type';

interface MenuPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

function nextEnabledIndex(
  options: SelectProps['options'],
  from: number,
  direction: 1 | -1
): number {
  if (options.length === 0) return -1;

  let index = from;
  for (let i = 0; i < options.length; i += 1) {
    index = (index + direction + options.length) % options.length;
    if (!options[index].disabled) return index;
  }

  return from;
}

export function Select({
  id,
  name,
  label,
  value,
  options,
  error,
  disabled,
  className,
  placeholder,
  onChange,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const margin = 8;
    const menuHeight = Math.min(options.length * 40 + 8, 240);
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, openUpward ? spaceAbove : spaceBelow);

    setMenuPosition({
      top: openUpward ? undefined : rect.bottom + 4,
      bottom: openUpward ? window.innerHeight - rect.top + 4 : undefined,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  }, [options.length]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      close();
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, close, updateMenuPosition]);

  useEscapeKey(close, open);

  useEffect(() => {
    if (!open) return;

    const option = menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[highlightedIndex];
    option?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open]);

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;

    onChange?.({
      target: {
        name: name ?? '',
        value: option.value,
      },
    });
    close();
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(options, -1, 1));
          setOpen(true);
        } else {
          setHighlightedIndex((index) => nextEnabledIndex(options, index, 1));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(options, options.length, -1));
          setOpen(true);
        } else {
          setHighlightedIndex((index) => nextEnabledIndex(options, index, -1));
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) {
          setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(options, -1, 1));
          setOpen(true);
        } else {
          selectOption(highlightedIndex);
        }
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(nextEnabledIndex(options, -1, 1));
        if (!open) setOpen(true);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(nextEnabledIndex(options, options.length, -1));
        if (!open) setOpen(true);
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  const menu =
    open && menuPosition
      ? createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={selectId}
            style={{
              top: menuPosition.top,
              bottom: menuPosition.bottom,
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
            }}
            className="fixed z-[80] overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
          >
            {options.map((option, index) => {
              const selected = option.value === value;
              const highlighted = index === highlightedIndex;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  data-highlighted={highlighted || undefined}
                  onMouseEnter={() => {
                    if (!option.disabled) setHighlightedIndex(index);
                  }}
                  onClick={() => selectOption(index)}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors ${
                    option.disabled
                      ? 'cursor-not-allowed text-gray-300'
                      : selected
                        ? 'bg-brand-lightest font-medium text-brand-main'
                        : highlighted
                          ? 'bg-gray-50 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>,
          document.body
        )
      : null;

  return (
    <div className={`w-full ${className ?? ''}`}>
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}

      <button
        ref={triggerRef}
        type="button"
        id={selectId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => {
          if (disabled) return;
          if (open) {
            close();
            return;
          }
          setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(options, -1, 1));
          setOpen(true);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`relative flex h-12 w-full items-center rounded-xl border px-4 pr-10 text-left text-sm outline-none transition-all ${
          error
            ? 'border-red-400 bg-red-50/20'
            : open
              ? 'border-primary-500 bg-white'
              : 'border-transparent bg-form-element-bg focus:border-primary-500 focus:bg-white'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedOption?.label ?? placeholder ?? ''}
        </span>
        <ChevronDownIcon
          size={16}
          className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {menu}
    </div>
  );
}

export default Select;
