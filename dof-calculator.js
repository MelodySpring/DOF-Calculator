function calculateDOF({
    focalLengthMm,
    fNumber,
    focusDistanceM,
    circleOfConfusionMm = 0.030
}) {
    const inputs = [
        focalLengthMm,
        fNumber,
        focusDistanceM,
        circleOfConfusionMm
    ];

    if (inputs.some(value => !Number.isFinite(value) || value <= 0)) {
        throw new RangeError("All inputs must be positive numbers.");
    }

    const focusMm = focusDistanceM * 1000;
    const f = focalLengthMm;

    if (focusMm <= f) {
        throw new RangeError("Focus distance must exceed the focal length.");
    }

    const h = f ** 2 / (fNumber * circleOfConfusionMm);
    const hyperfocalMm = h + f;
    const nearMm = (h * focusMm) / (h + focusMm - f);
    const farMm = focusMm >= hyperfocalMm
        ? Infinity
        : (h * focusMm) / (hyperfocalMm - focusMm);

    return {
        nearLimitM: nearMm / 1000,
        farLimitM: farMm / 1000,
        totalDepthOfFieldM: (farMm - nearMm) / 1000,
        hyperfocalDistanceM: hyperfocalMm / 1000
    };
}

// 50 mm lens at f/8, focused 3 metres away on full frame
const result = calculateDOF({
    focalLengthMm: 50,
    fNumber: 8,
    focusDistanceM: 3
});

console.log(result);