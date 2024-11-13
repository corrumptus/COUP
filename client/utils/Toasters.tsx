import { Dispatch, SetStateAction, useState } from "react";

let externalSetState: Dispatch<SetStateAction<ReturnType<typeof Toaster>[]>>;

export function newToaster(children: string | JSX.Element) {
  const id: string = Math.floor(Math.random() * 10000).toString();

  function removeToaster() {
    externalSetState(prev => prev.filter(t => t.key !== id));
  }

  externalSetState(prev => {
    const toasters = [...prev];

    if (prev.length === 3)
      toasters.splice(0, 1);

    return [...toasters, <Toaster children={children} key={id} removeToaster={removeToaster}/>];
  });

  setTimeout(removeToaster, 3000);
}

export default function Toasters() {
  const [ toasters, setToasters ] = useState<ReturnType<typeof Toaster>[]>([]);

  externalSetState = setToasters;

  return (
    <div className="flex flex-col gap-2 absolute top-1 right-1 z-50">
      {toasters}
    </div>
  )
}

function Toaster({
  children,
  removeToaster
}: {
  children: string | JSX.Element,
  removeToaster: () => void
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer relative p-1.5"
      onClick={removeToaster}
      id="toaster"
      data-testid="toaster"
    >
      <div className="w-full max-w-[250px] max-h-[150px] overflow-hidden p-1.5">
        {children}
      </div>
      <div className="h-0.5 absolute bottom-0 animate-toast"></div>
    </div>
  )
}