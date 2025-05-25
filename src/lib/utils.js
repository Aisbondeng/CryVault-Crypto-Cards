
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const generateMnemonic = () => {
  const words = [
    "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew",
    "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry",
    "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yuzu", "zucchini"
  ];
  let mnemonic = [];
  for (let i = 0; i < 12; i++) {
    mnemonic.push(words[Math.floor(Math.random() * words.length)]);
  }
  return mnemonic.join(" ");
};

export const generateId = (length = 16) => {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length);
  return nanoid();
};
