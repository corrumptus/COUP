import { Dispatch, SetStateAction, useId, useState } from 'react'

let externalToasters: ReturnType<typeof Toaster>[];
let externalSetState: Dispatch<SetStateAction<ReturnType<typeof Toaster>[]>>;

export function newToaster(children: string | JSX.Element) {
  const newId = useId();
  const newToast = <Toaster children={children} percentage={100} key={newId}/>

  if (externalToasters.length === 3)
    externalToasters.shift();

  setTimeout(() => {
    const index = externalToasters.findIndex(t => t.key === newId);

    if (index === -1)
      return;

    externalToasters.splice(index, 1);

    externalSetState(externalToasters);
  }, 3000);

  externalSetState([...externalToasters, newToast]);
}

export default function Toasters() {
  const [ toasters, setToasters ] = useState<ReturnType<typeof Toaster>[]>([]);

  externalToasters = [...toasters];
  externalSetState = setToasters;

  return (
    <div className="absolute top-0 right-0">
      {toasters}
    </div>
  )
}

function Toaster({
  children,
  percentage
}: {
  children: string | JSX.Element,
  percentage: number
}) {
  return (
    <div className="flex items-end">
      <div className={`h-[${percentage}%] w-1 bg-green-400 animate-shrink`}></div>
      <div className="w-[200px] h-[70px] p-4">
        {children}
      </div>
    </div>
  )
}