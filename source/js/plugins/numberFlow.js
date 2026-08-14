import "number-flow";

const timing = {
  duration: 400,
  easing: "ease-in-out",
};

const digitLimits = {
  minutes: { 1: { max: 5 } },
  seconds: { 1: { max: 5 } },
};

export default function initNumberFlow() {
  document.querySelectorAll("number-flow[data-number-value]").forEach((element) => {
    element.transformTiming = timing;
    element.spinTiming = timing;

    const unit = element.dataset.numberUnit;
    if (unit) {
      element.trend = 1;
      element.digits = digitLimits[unit];
    }

    element.update(Number(element.dataset.numberValue));
  });
}
