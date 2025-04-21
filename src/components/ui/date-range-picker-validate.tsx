"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

const isValidDate = (date: any) => {
  return date instanceof Date && !isNaN(date.getTime());
};

export function DateRangePickerValidate({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Adicione validação das datas
  const validatedDate = {
    from: isValidDate(date?.from) ? date.from : new Date(),
    to: isValidDate(date?.to) ? date.to : new Date(),
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !validatedDate?.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {validatedDate?.from ? (
              validatedDate.to ? (
                <>
                  {format(validatedDate.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(validatedDate.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(validatedDate.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={validatedDate?.from || today}
            selected={validatedDate}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={{ before: today }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
