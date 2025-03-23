import Image from "next/image";
import { Card } from "@type/game";
import { CardVersion } from "@type/gameUI";

export default function InfluenceCard({
  card,
  cardVersion,
  className,
  width,
  height
}: {
  card: Card | undefined,
  cardVersion: CardVersion,
  className?: string,
  width?: number,
  height?: number
}) {
  const cardWidth = width === undefined || width < 0 ? 100 : width;
  const cardHeight = height === undefined || height < 0 ? 130 : height;

  if (card === Card.DUQUE && cardVersion === 0) return (
    <Image
      src="/duque1.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.DUQUE && cardVersion === 1) return (
    <Image
      src="/duque2.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.DUQUE && cardVersion === 2) return (
    <Image
      src="/duque3.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )

  if (card === Card.CAPITAO && cardVersion === 0) return (
    <Image
      src="/capitao1.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.CAPITAO && cardVersion === 1) return (
    <Image
      src="/capitao2.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.CAPITAO && cardVersion === 2) return (
    <Image
      src="/capitao3.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )

  if (card === Card.ASSASSINO && cardVersion === 0) return (
    <Image
      src="/assassino1.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.ASSASSINO && cardVersion === 1) return (
    <Image
      src="/assassino2.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.ASSASSINO && cardVersion === 2) return (
    <Image
      src="/assassino3.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )

  if (card === Card.CONDESSA && cardVersion === 0) return (
    <Image
      src="/condessa1.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.CONDESSA && cardVersion === 1) return (
    <Image
      src="/condessa2.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.CONDESSA && cardVersion === 2) return (
    <Image
      src="/condessa3.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )

  if (card === Card.EMBAIXADOR && cardVersion === 0) return (
    <Image
      src="/embaixador1.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.EMBAIXADOR && cardVersion === 1) return (
    <Image
      src="/embaixador2.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.EMBAIXADOR && cardVersion === 2) return (
    <Image
      src="/embaixador3.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )

  if (card === Card.INQUISIDOR && cardVersion === 0) return (
    <Image
      src="/inquisidor1.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.INQUISIDOR && cardVersion === 1) return (
    <Image
      src="/inquisidor2.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
  if (card === Card.INQUISIDOR && cardVersion === 2) return (
    <Image
      src="/inquisidor3.png"
      alt="carta"
      title={card}
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )

  return (
    <Image
      src="/default-card.png"
      alt="carta"
      title="desconhecida"
      className={className}
      width={cardWidth}
      height={cardHeight}
    />
  )
}