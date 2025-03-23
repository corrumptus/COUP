export default function NextPersonTutorial({
  person
}: {
  person: string
}) {
  return (
    <div
      className="w-full h-full absolute flex justify-center items-center z-[6] bg-zinc-700/50"
    >
      <h1 className="w-[65%] text-2xl font-bold text-center bg-red-500 p-3 rounded-xl">
        {person}
      </h1>
    </div>
  )
}