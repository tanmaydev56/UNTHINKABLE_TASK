import { clsx, type ClassValue } from "clsx"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge"
import { HistoryItem } from "./types";


  

  
 
 
  
 






export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
