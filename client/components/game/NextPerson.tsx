export default function NextPerson({
  person,
  closeNextPerson
}: {
  person: string,
  closeNextPerson: () => void
}) {
  const n = setTimeout(() => {
    closeNextPerson();
  }, 2000);

  function close() {
    clearTimeout(n);

    closeNextPerson();
  }

  return (
    <div
      className="w-full h-full absolute flex justify-center items-center z-[6] bg-zinc-700/50"
      onClick={close}
      id="gameView-nextPerson"
      data-testid="gameView-nextPerson"
    >
      <h1 className="w-[65%] text-2xl font-bold text-center bg-red-500 p-3 rounded-xl">
        {person}
      </h1>
    </div>
  )
}