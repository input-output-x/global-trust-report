const modes = {
  creator: {
    title: "Creator Risk Report",
    score: 82,
    price: "Free sample",
    summary:
      "Public profiles appear consistent across creator channels. Sample signals are suitable for an early brand safety review.",
    signals: [
      "Audience and content niche can be mapped from public platforms.",
      "Public controversies should be reviewed before sponsorship approval.",
      "Engagement quality needs deeper validation for paid campaigns."
    ],
    use: "Useful for TikTok, YouTube, Instagram, X and LinkedIn creator sponsorship screening."
  },
  contractor: {
    title: "Contractor Trust Check",
    score: 76,
    price: "$9-$29",
    summary:
      "Public professional signals suggest a reasonable starting point for remote collaboration review.",
    signals: [
      "Linked public profiles can be compared with portfolio claims.",
      "GitHub, LinkedIn and website activity may support skill consistency.",
      "Final hiring decisions require interviews and direct references."
    ],
    use: "Useful before hiring remote developers, designers, operators, agencies and freelancers."
  },
  founder: {
    title: "Founder & Investor Brief",
    score: 71,
    price: "$49-$199",
    summary:
      "Public company, media and social signals can be organized into a concise diligence brief.",
    signals: [
      "Past projects and public roles can be cross-checked from open sources.",
      "News coverage and public disputes should be separated by confidence level.",
      "Corporate associations need official registry verification where available."
    ],
    use: "Useful for investor screening, partnership review and early business due diligence."
  },
  web3: {
    title: "Web3 Wallet Identity Research",
    score: 68,
    price: "Usage based",
    summary:
      "Wallet, ENS, public social and open-source signals can help build a non-custodial identity risk picture.",
    signals: [
      "Wallet activity can be grouped into visible behavior patterns.",
      "Public identity links such as ENS, X and GitHub should be treated as signals, not proof.",
      "High-risk labels require careful source citation and human review."
    ],
    use: "Useful for Web3 teams, community managers, investors, researchers and risk workflows."
  }
};

const form = document.querySelector("#report-form");
const modeButtons = [...document.querySelectorAll(".mode")];
const queryInput = document.querySelector("#query");
const depthSelect = document.querySelector("#depth");

function renderReport(modeKey) {
  const report = modes[modeKey];
  document.querySelector("#report-mode").textContent = report.title;
  document.querySelector("#report-price").textContent = report.price;
  document.querySelector("#score").textContent = report.score;
  document.querySelector("#meter-fill").style.width = `${report.score}%`;
  document.querySelector("#summary").textContent = report.summary;
  document.querySelector("#use-case").textContent = report.use;

  const signals = document.querySelector("#signals");
  signals.innerHTML = "";
  report.signals.forEach((signal) => {
    const item = document.createElement("li");
    item.textContent = signal;
    signals.appendChild(item);
  });
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderReport(button.dataset.mode);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const activeMode = document.querySelector(".mode.is-active").dataset.mode;
  const report = modes[activeMode];
  const subject = queryInput.value.trim();
  const depth = depthSelect.options[depthSelect.selectedIndex].text;

  document.querySelector("#summary").textContent =
    `${depth} sample for "${subject}": ${report.summary}`;
  document.querySelector("#reports").scrollIntoView({ behavior: "smooth", block: "start" });
});
