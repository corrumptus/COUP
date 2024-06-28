import Image from "next/image"

export default function FormInputImage({
  type,
  isPassVisible,
  passwordImageClickHandler
}: {
  type: "name" | "password",
  isPassVisible?: boolean,
  passwordImageClickHandler: () => void
}) {
  const imageSize: number = 25;
  const className: string = "absolute right-2 top-1 invert";

  if (type === "name")
    return (
      <Image
        src="/name-image.png"
        alt=""
        width={imageSize}
        height={imageSize}
        className={className}
        onClick={passwordImageClickHandler}
      />
    )

  if (isPassVisible)
    return (
      <Image
        src="/password-viewing-image.png"
        alt=""
        width={imageSize}
        height={imageSize}
        className={className}
        onClick={passwordImageClickHandler}
      />
    )

  return (
    <Image
      src="/password-secret-image.png"
      alt=""
      width={imageSize}
      height={imageSize}
      className={className}
      onClick={passwordImageClickHandler}
    />
  )
}