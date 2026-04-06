export const WAVE_HEIGHT = 120;
export const WAVE_PAD = 10;

function generateWavePath(invert: boolean, fillTop: boolean) {
    const points: string[] = [];
    const steps = 200;
    const sign = invert ? -1 : 1;

    for (let i = 0; i <= steps; i++) {
        const x = -WAVE_PAD + (i / steps) * (100 + WAVE_PAD * 2);
        const y = WAVE_HEIGHT / 2 + sign * Math.sin((i / steps) * Math.PI * 3) * (WAVE_HEIGHT * 0.35);
        points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }

    if (fillTop) {
        return `${points.join(" ")} L ${100 + WAVE_PAD} -${WAVE_PAD} L -${WAVE_PAD} -${WAVE_PAD} Z`;
    }
    return `${points.join(" ")} L ${100 + WAVE_PAD} ${WAVE_HEIGHT + WAVE_PAD} L -${WAVE_PAD} ${WAVE_HEIGHT + WAVE_PAD} Z`;
}

export const topWavePath = generateWavePath(false, true);
export const bottomWavePath = generateWavePath(true, false);
