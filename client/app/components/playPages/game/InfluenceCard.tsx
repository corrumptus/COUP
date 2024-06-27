import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "./GameView";

export default function InfluenceCard({
  card,
  customStyle,
  onClick
}: {
  card?: Card,
  customStyle?: string,
  onClick?: () => void
}) {
  const [ randomCard, setRandomCard ] = useState(1)

  const imageStyle = "" + (customStyle || "");

  useEffect(() => {
    setRandomCard(Math.floor(Math.random() * 3) + 1)
  })

  if (card === Card.DUQUE && randomCard === 1) return (
    <Image
      src="/duque1.png"
      alt="carta"
      title="duque"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.DUQUE && randomCard === 2) return (
    <Image
      src="/duque2.png"
      alt="carta"
      title="duque"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.DUQUE && randomCard === 3) return (
    <Image
      src="/duque3.png"
      alt="carta"
      title="duque"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )

  if (card === Card.CAPITAO && randomCard === 1) return (
    <Image
      src="/capitao1.png"
      alt="carta"
      title="capitao"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.CAPITAO && randomCard === 2) return (
    <Image
      src="/capitao2.png"
      alt="carta"
      title="capitao"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.CAPITAO && randomCard === 3) return (
    <Image
      src="/capitao3.png"
      alt="carta"
      title="capitao"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )

  if (card === Card.ASSASSINO && randomCard === 1) return (
    <Image
      src="/assassino1.png"
      alt="carta"
      title="assassino"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.ASSASSINO && randomCard === 2) return (
    <Image
      src="/assassino2.png"
      alt="carta"
      title="assassino"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.ASSASSINO && randomCard === 3) return (
    <Image
      src="/assassino3.png"
      alt="carta"
      title="assassino"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )

  if (card === Card.CONDESSA && randomCard === 1) return (
    <Image
      src="/condessa1.png"
      alt="carta"
      title="condessa"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.CONDESSA && randomCard === 2) return (
    <Image
      src="/condessa2.png"
      alt="carta"
      title="condessa"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.CONDESSA && randomCard === 3) return (
    <Image
      src="/condessa3.png"
      alt="carta"
      title="condessa"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )

  if (card === Card.EMBAIXADOR && randomCard === 1) return (
    <Image
      src="/embaixador1.png"
      alt="carta"
      title="embaixador"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.EMBAIXADOR && randomCard === 2) return (
    <Image
      src="/embaixador2.png"
      alt="carta"
      title="embaixador"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.EMBAIXADOR && randomCard === 3) return (
    <Image
      src="/embaixador3.png"
      alt="carta"
      title="embaixador"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )

  if (card === Card.INQUISIDOR && randomCard === 1) return (
    <Image
      src="/inquisidor1.png"
      alt="carta"
      title="inquisidor"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.INQUISIDOR && randomCard === 2) return (
    <Image
      src="/inquisidor2.png"
      alt="carta"
      title="inquisidor"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
  if (card === Card.INQUISIDOR && randomCard === 3) return (
    <Image
      src="/inquisidor3.png"
      alt="carta"
      title="inquisidor"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )

  return (
    <Image
      src="/default-card.png"
      alt="carta"
      title="desconhecida"
      className={imageStyle}
      onClick={onClick}
      width={40}
      height={70}
    />
  )
}