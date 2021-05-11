let branches;
function preload() {
  // Get the most recent earthquake in the database
  let url = '/workspaces/mipro-ui';
  httpGet(url, 'json', false, function(response) {
    // when the HTTP request completes, populate the variable that holds the
    // earthquake data used in the visualization.
    branches = response.sort((a, b) => (a.date > b.date) ? 1 : -1);
  });
}

function setup() {
  createCanvas(1600, 1600);
}

function draw() {
  textSize(16);
  
  let y = 20;
  if (branches) {
    for (let branch of branches) {
      text(branch.dest, 10, y);
      text(branch.date, 400, y);
      y+=40;
    }
  }

  // if (mouseIsPressed) {
  //   fill(0);
  // } else {
  //   fill(255);
  // }
  // ellipse(mouseX, mouseY, 80, 80);

  //   fill(0);textSize(16);
  // text("test", 10, y);
  // let y = 20;
  // for (let branch of branches) {
  //   text(branch.commit.line, 10, y);
  //   y+=20;
  // }
}