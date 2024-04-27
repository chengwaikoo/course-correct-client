export function labelPrice(price: number) {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function labelDuration(hours: number) {
  return hours.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function labelApproxDuration(hours: number) {
  if (hours < 35) {
    return "";
  }

  let label = "(~";
  if (hours < 35 * 3.5) {
    const weeks = Math.round(hours / 35);
    label += `${weeks} ${weeks > 1 ? "weeks" : "week"}`;
  } else if (hours < 140 * 11.5) {
    const months = Math.round(hours / 140);
    label += `${months} ${months > 1 ? "months" : "month"}`;
  } else {
    const years = Math.round(hours / 1680);
    label += `${years} ${years > 1 ? "years" : "year"}`;
  }
  label += ")";
  return label;
}

export function labelTrainingMode(mode: string) {
  if (mode === "PT") {
    return "Part-time";
  } else if (mode === "FT") {
    return "Full-time";
  } else if (mode === "FP") {
    return "Part-time and full-time";
  }
}
