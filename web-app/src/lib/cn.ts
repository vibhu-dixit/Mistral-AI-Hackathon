import { clsx, type ClassValue } from "clsx";

/** Small classname helper so components don't hand-roll string concatenation. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
