import replaceall from "replaceall"

export default function perlin_wobble(AMP: number = 0.2, FREQ: number = 0.43, INV_SPEED: number = 60.0): string{
    let VERTEX_SHADER = require("raw-loader!./perlin_wobble.vert").default;

    // settings
    VERTEX_SHADER = replaceall("<AMP>", AMP.toString(), VERTEX_SHADER);
    VERTEX_SHADER = replaceall("<FREQ>", FREQ.toString(), VERTEX_SHADER);
    VERTEX_SHADER = replaceall("<INV_SPEED>", INV_SPEED.toString(), VERTEX_SHADER);

    return VERTEX_SHADER;
}