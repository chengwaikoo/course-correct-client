export function renderSkill(line: string) {
  const index = line.indexOf(":");
  if (index !== -1) {
    const front = line.slice(0, index + 1);
    const back = line.slice(index + 1);
    return (
      <>
        <span className="font-semibold">{front}</span>
        <span className="font-normal">{back}</span>
      </>
    );
  }
  return line;
}
