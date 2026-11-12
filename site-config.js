window.JUSTIN_SITE = {
  tools: [
    {
      name: "AV Timer",
      description: "Run fullscreen timers, warnings and queued countdowns.",
      url: "https://timer.justincreative.tech/"
    },
    {
      name: "CueTime",
      description: "Build Follow and Hang Time cues for shows where timecode isn’t available or practical. Work out cue timing, running totals and EOS-ready follow times.",
      url: "https://rustinplays.github.io/CueTime/"
    },
    {
      name: "AV Planner",
      description: "Plan rooms, devices and signal flow.",
      url: "https://rustinplays.github.io/AV-Planner/"
    },
    {
      name: "Stage Deck Calculator",
      description: "Estimate deck layouts and materials.",
      url: "https://rustinplays.github.io/Stage-Deck-Calculator/"
    }
  ],
  merch: { shopUrl: "https://justincreative-shop.fourthwall.com/en-nzd", collection: "all" }
};

// Show the AV Tools button alongside "What I do" and "Start a project"
// on the homepage, using exactly the site's existing button styling.
document.addEventListener("DOMContentLoaded", function () {
  var actions = document.querySelector('body[data-page="home"] .home-hero .hero-actions');
  if (!actions || actions.querySelector('a[href="downloads.html"]')) return;

  var link = document.createElement("a");
  link.className = "button button-line";
  link.href = "downloads.html";
  link.innerHTML = 'AV Tools <span aria-hidden="true">↗</span>';
  actions.appendChild(link);
});
