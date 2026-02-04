"use client";

import { ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { STATUS_OPTIONS } from "@/components/pages/admin/constants";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SectionFilterRaffles = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (status: string) => {
    if (status === "all") {
      router.push("/admin");
    } else {
      router.push(`/admin?status=${status}`);
    }
  };

  const currentLabel =
    STATUS_OPTIONS.find((opt) => opt.value === currentStatus)?.label || "Todas";

  return (
    <section id="section-raffles-filters">
      <div className="md:hidden">
        <ButtonGroup>
          <Button variant="outline">{currentLabel}</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      <div className="hidden md:block">
        <ButtonGroup>
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={currentStatus === option.value ? "default" : "outline"}
              onClick={() => handleStatusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </section>
  );
};
export default SectionFilterRaffles;
