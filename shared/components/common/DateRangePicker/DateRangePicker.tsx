import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { DayPicker, type DateRange as DayPickerRange } from '@daypicker/react';
import '@daypicker/react/style.css';
import { CalendarIcon, ChevronDownIcon } from '@/shared/components/icons';
import { Button } from '@/shared/components/common/Button';
import { useEscapeKey } from '@/shared/hooks';
import type { DateRangePickerProps } from './date-range-picker.type';
import {
  formatDisplayDate,
  parseISODate,
  rangeForPreset,
  toISODate,
  type DateRangePresetId,
} from './date-range';

const PRESETS: DateRangePresetId[] = [
  'thisMonth',
  'last30Days',
  'last3Months',
  'last6Months',
  'yearToDate',
];

interface PopoverPosition {
  top?: number;
  bottom?: number;
  left: number;
  maxHeight: number;
}

function toPickerRange(start: string, end: string): DayPickerRange {
  return {
    from: parseISODate(start),
    to: parseISODate(end),
  };
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = '',
}: DateRangePickerProps) {
  const t = useTranslations('shared');
  const locale = useLocale();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DayPickerRange | undefined>(() =>
    toPickerRange(startDate, endDate)
  );
  const [month, setMonth] = useState(() => parseISODate(startDate));
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  const close = useCallback(() => {
    setOpen(false);
    setPosition(null);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const margin = 8;
    const months = window.matchMedia('(min-width: 640px)').matches ? 2 : 1;
    const estimatedWidth = months === 2 ? 608 : 320;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUpward = spaceBelow < 320 && spaceAbove > spaceBelow;
    const width = Math.min(estimatedWidth, window.innerWidth - margin * 2);
    let left = rect.right - width;
    left = Math.min(Math.max(margin, left), window.innerWidth - width - margin);

    setNumberOfMonths(months);
    setPosition({
      top: openUpward ? undefined : rect.bottom + 4,
      bottom: openUpward ? window.innerHeight - rect.top + 4 : undefined,
      left,
      maxHeight: Math.max(240, openUpward ? spaceAbove : spaceBelow),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return;
      }
      close();
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, close, updatePosition]);

  useEscapeKey(close, open);

  const openPicker = () => {
    if (open) {
      close();
      return;
    }

    setDraft(toPickerRange(startDate, endDate));
    setMonth(parseISODate(startDate));
    setOpen(true);
  };

  const applyPreset = (id: DateRangePresetId) => {
    const range = rangeForPreset(id);
    setDraft(toPickerRange(range.start, range.end));
    setMonth(parseISODate(range.start));
  };

  const canApply = Boolean(draft?.from && draft?.to);

  const handleApply = () => {
    if (!draft?.from || !draft?.to) return;
    onChange({ start: toISODate(draft.from), end: toISODate(draft.to) });
    close();
  };

  const summary = `${formatDisplayDate(startDate, locale)} – ${formatDisplayDate(endDate, locale)}`;
  const draftSummary =
    draft?.from && draft?.to
      ? `${formatDisplayDate(toISODate(draft.from), locale)} – ${formatDisplayDate(toISODate(draft.to), locale)}`
      : t('dateRange.pickEnd');

  const popover =
    open && position
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={t('dateRange.label')}
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              maxHeight: position.maxHeight,
            }}
            className="fixed z-[80] w-[min(calc(100vw-2rem),38rem)] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="flex gap-1.5 overflow-x-auto border-b border-gray-100 px-3 py-2.5">
              {PRESETS.map((id) => {
                const range = rangeForPreset(id);
                const active =
                  draft?.from &&
                  draft?.to &&
                  range.start === toISODate(draft.from) &&
                  range.end === toISODate(draft.to);

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyPreset(id)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-brand-main text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t(`dateRange.presets.${id}`)}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center overflow-x-auto p-3 sm:p-4">
              <DayPicker
                mode="range"
                selected={draft}
                onSelect={setDraft}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={numberOfMonths}
                ISOWeek
                resetOnSelect
                navLayout="around"
                className="finking-date-range"
                labels={{
                  labelPrevious: () => t('dateRange.previousMonth'),
                  labelNext: () => t('dateRange.nextMonth'),
                }}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-gray-700">{draftSummary}</p>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={close}>
                  {t('dateRange.cancel')}
                </Button>
                <Button variant="primary" size="sm" onClick={handleApply} disabled={!canApply}>
                  {t('dateRange.apply')}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className={`relative w-full sm:w-auto ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('dateRange.label')}
        className="flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 text-left shadow-xs transition-colors hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
      >
        <CalendarIcon size={16} className="shrink-0 text-brand-main" />
        <span className="min-w-0 truncate text-sm font-medium text-gray-900">{summary}</span>
        <ChevronDownIcon
          size={16}
          className={`ml-1 shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {popover}
    </div>
  );
}

export default DateRangePicker;
