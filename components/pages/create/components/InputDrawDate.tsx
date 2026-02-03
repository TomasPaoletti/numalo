"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InputDrawDateProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

const InputDrawDate = ({ value, onChange, disabled }: InputDrawDateProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange(undefined);
      return;
    }

    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0
      );
      setSelectedDate(newDate);
      onChange(newDate);
    } else {
      const newDate = new Date(date);
      newDate.setHours(12, 0, 0, 0);
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDate) return;

    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);

    setSelectedDate(newDate);
    onChange(newDate);
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd/MM/yyyy - HH:mm", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Card className="w-fit">
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="p-0"
                locale={es}
              />
            </CardContent>
            <CardFooter className="bg-card border-t">
              <Field>
                <FieldLabel htmlFor="draw-time">Hora del sorteo</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="draw-time"
                    type="time"
                    value={
                      selectedDate ? format(selectedDate, "HH:mm") : "12:00"
                    }
                    onChange={handleTimeChange}
                    disabled={disabled || !selectedDate}
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <Clock className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default InputDrawDate;
