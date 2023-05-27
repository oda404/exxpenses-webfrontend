
import Image from 'next/image'

interface BigLogoProps {
    width?: number;
    height?: number;
}

export default function BigLogo({ width, height }: BigLogoProps) {
    return (
        <Image priority={true} src="/exxpenses.svg" alt="Exxpenses" width={width !== undefined ? width : 181} height={height !== undefined ? height : 51} />
    )
}
