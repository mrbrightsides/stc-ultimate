'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  id?: string;
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disablePastDates?: boolean;
  className?: string;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Select a date",
  disabled = false,
  disablePastDates = true,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const disabledDays = disablePastDates 
    ? { before: today }
    : undefined;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-black/50 border-purple-500/50 text-white hover:bg-purple-500/10 hover:border-purple-400",
            !value && "text-gray-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-black border-purple-500/50" 
        align="start"
      >
        <DayPicker
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabledDays}
          initialFocus
          className="p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-white",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-purple-500/20 rounded-md"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal text-white hover:bg-purple-500/20 hover:text-white rounded-md",
              "aria-selected:opacity-100"
            ),
            day_selected: "bg-purple-500 text-white hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white",
            day_today: "bg-purple-500/20 text-purple-300 font-semibold",
            day_outside: "text-gray-600 opacity-50",
            day_disabled: "text-gray-600 opacity-30 cursor-not-allowed",
            day_range_middle: "aria-selected:bg-purple-500/20 aria-selected:text-white",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: ({ ...props }) => <CalendarIcon className="h-4 w-4" />,
            IconRight: ({ ...props }) => <CalendarIcon className="h-4 w-4 rotate-180" />,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}