
import React from 'react';

const TokenIcon = ({ symbol, className }) => {
  const baseClasses = "h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm";
  let specificClass = "generic-token-bg";
  let text = symbol.substring(0, 1).toUpperCase();

  if (symbol === "BTC") {
    return <div className={`${baseClasses} bitcoin-gradient ${className || 'mr-3'}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-5 w-5 text-white fill-current"><path d="M29.333 16c0-2.385-.794-4.632-2.207-6.455l-2.406-3.145-1.538.087c-2.06-.46-4.24-.704-6.515-.704s-4.455.244-6.515-.704l-1.538-.087L6.207 9.545C4.794 11.368 4 13.615 4 16s.794 4.632 2.207 6.455l2.406 3.145 1.538-.087c2.06.46 4.24.704 6.515-.704s4.455-.244 6.515-.704l1.538.087 2.406-3.145C28.539 20.632 29.333 18.385 29.333 16zM14.61 21.154v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H10.4v-1.473h1.76v-1.486h-1.76v-1.473h1.76V15.2H10.4v-1.473h1.76v-2.32c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v2.32h1.76v1.473h-1.76v1.486h1.76v1.473h-1.76v1.535h1.76v1.473h-1.76zm7.056-1.473H19.9v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H15.7v-1.473h1.76v-4.64c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v4.64h1.756v1.473z"></path></svg></div>;
  }
  if (symbol === "BNB") { specificClass = "bnb-icon-bg"; text = "BNB"; }
  if (symbol === "ETH") { specificClass = "eth-icon-bg"; text = "ETH"; }
  if (symbol === "TES") { specificClass = "bg-blue-500"; text = "TS"; }
  if (symbol === "tesla") { specificClass = "tesla-icon-bg"; text = "TSLA"; }

  return <div className={`${baseClasses} ${specificClass} ${className || 'mr-3'}`}>{text}</div>;
};

export default TokenIcon;
