import { Dispatch, SetStateAction, useState } from 'react'

let externalSetState: Dispatch<SetStateAction<ReturnType<typeof Toaster>[]>>;

export function newToaster(children: string | JSX.Element) {
  const id = JSON.stringify(children) + Math.floor(Math.random() * 100);

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
    <div className="absolute top-0 right-0">
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
      className="bg-white rounded-2xl overflow-hidden cursor-pointer relative"
      onClick={removeToaster}
    >
      <div className="w-full max-w-[300px] p-4">
        {children}
      </div>
      <div className="w-full h-0.5 bg-green-400 animate-shrink animate-green-to-red absolute bottom-0"></div>
    </div>
  )
}