/**
 * Class for computing linear-gradients,
 * from sun altitude and direction
 */
export class SkyEffect {

    static skyGradients = [
        "linear-gradient(to bottom, #00000c 0%, #00000c 100%)",
        "linear-gradient(to bottom, #020111 85%,#191621 100%)",
        "linear-gradient(to bottom, #020111 60%,#20202c 100%)",
        "linear-gradient(to bottom, #020111 10%,#3a3a52 100%)",
        "linear-gradient(to bottom, #20202c 0%,#515175 100%)",
        "linear-gradient(to bottom, #40405c 0%,#6f71aa 80%,#8a76ab 100%)",
        "linear-gradient(to bottom, #4a4969 0%,#7072ab 50%,#cd82a0 100%)",
        "linear-gradient(to bottom, #757abf 0%,#8583be 60%,#eab0d1 100%)",
        "linear-gradient(to bottom, #82addb 0%,#ebb2b1 100%)",
        "linear-gradient(to bottom, #94c5f8 1%,#a6e6ff 70%,#b1b5ea 100%)",
        "linear-gradient(to bottom, #b7eaff 0%,#94dfff 100%)",
        "linear-gradient(to bottom, #9be2fe 0%,#67d1fb 100%)",
        "linear-gradient(to bottom, #caf0ff 0%,#38a3d1 100%)",
        "linear-gradient(to bottom, #57c1eb 0%,#246fa8 100%)",
        "linear-gradient(to bottom, #2d91c2 0%,#1e528e 100%)",
        "linear-gradient(to bottom, #2473ab 0%,#1e528e 70%,#5b7983 100%)",
        "linear-gradient(to bottom, #1e528e 0%,#265889 50%,#9da671 100%)",
        "linear-gradient(to bottom, #1e528e 0%,#728a7c 50%,#e9ce5d 100%)",
        "linear-gradient(to bottom, #154277 0%,#576e71 30%,#e1c45e 70%,#b26339 100%)",
        "linear-gradient(to bottom, #163C52 0%,#4F4F47 30%,#C5752D 60%,#B7490F 80%, #2F1107 100%)",
        "linear-gradient(to bottom, #071B26 0%,#071B26 30%,#8A3B12 80%,#240E03 100%)",
        "linear-gradient(to bottom, #010A10 30%,#59230B 80%,#2F1107 100%)",
        "linear-gradient(to bottom, #090401 50%,#4B1D06 100%)",
        "linear-gradient(to bottom, #00000c 80%,#150800 100%)",
        "linear-gradient(to bottom, #00000c 0%, #00000c 100%)"
    ]

    altitude
    direction


    getBrightness () {
        const maxBrightnessAltitude = 20
        const minBrightnessAltitude = -18
        const maxBrightnessValue = Math.floor(SkyEffect.skyGradients.length / 2)
        const minBrightnessValue = 0

        if (this.altitude > maxBrightnessAltitude)
            return maxBrightnessValue

        if (this.altitude < minBrightnessAltitude)
            return minBrightnessValue

        return ((maxBrightnessValue) * (this.altitude + minBrightnessAltitude * -1)) / (maxBrightnessAltitude - minBrightnessAltitude)

    }

    getLinearGradient () // direction: true: goes up; false: goes down
    {
        const absoluteBrightness = this.getBrightness()
        const currentIndex = this.direction ? Math.floor(absoluteBrightness) : Math.floor((SkyEffect.skyGradients.length - 1) - absoluteBrightness)
        const nextIndex = Math.min(currentIndex + 1, SkyEffect.skyGradients.length - 1)
        //console.log(absoluteBrightness, currentIndex, nextIndex, absoluteBrightness % 1 === 0 ? 0 : (this.direction ? absoluteBrightness % 1 : 1 - (absoluteBrightness % 1)));
        return {
            current: SkyEffect.skyGradients[currentIndex],
            next: SkyEffect.skyGradients[nextIndex],
            nextOpacity: absoluteBrightness % 1 === 0 ? 0 : (this.direction ? absoluteBrightness % 1 : 1 - (absoluteBrightness % 1)),
        }
    }


    constructor({ altitude = 0, direction = true }) {
        this.altitude = altitude
        this.direction = direction
    }
}

export default SkyEffect