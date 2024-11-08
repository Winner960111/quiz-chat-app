const container = document.getElementById("background-container");
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split([]);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function createFloatingCharacter(char) {
    const div = document.createElement("div");
    const fontSize = `${getRandomInt(60, 220)}px`;
    const duration = `${getRandomInt(15, 30)}s`;
    const rotation = `${getRandomInt(-60, 60)}deg`;

    const startX = `${getRandomFloat(
        -window.innerWidth,
        2 * window.innerWidth
    )}px`;
    const startY = `${getRandomFloat(
        -window.innerHeight,
        2 * window.innerHeight
    )}px`;
    const endX = `${getRandomFloat(-window.innerWidth, 2 * window.innerWidth)}px`;
    const endY = `${getRandomFloat(
        -window.innerHeight,
        2 * window.innerHeight
    )}px`;
    const color = `hsl(${getRandomInt(0, 360)}, 100%, 50%)`;

    div.textContent = char;
    div.className = "floating";
    div.style.setProperty("--font-size", fontSize);
    div.style.setProperty("--duration", duration);
    div.style.setProperty("--rotation", rotation);
    div.style.setProperty("--start-x", startX);
    div.style.setProperty("--start-y", startY);
    div.style.setProperty("--end-x", endX);
    div.style.setProperty("--end-y", endY);
    div.style.setProperty("--color", "var(--theme-mix-color)");

    container.appendChild(div);
}

for (let i = 0; i < 30; i++) {
    createFloatingCharacter(chars[getRandomInt(0, chars.length - 1)]);
}
