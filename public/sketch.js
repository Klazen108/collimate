let branches;
function preload() {
  // Get the most recent earthquake in the database
  let url = '/workspaces/mipro-ui';
  httpGet(url, 'json', false, function(response) {
    // when the HTTP request completes, populate the variable that holds the
    // earthquake data used in the visualization.
    branches = response.sort((a, b) => (a.date > b.date) ? -1 : 1);
  });
}

function setup() {
  createCanvas(1600, 1600);
}

function draw() {
  textSize(16);
  fill(140);
  
  let y = 20;
  if (branches) {

    let minTime = 99999999999;
    let maxTime = 0;
    for (let branch of branches) {
      let time = new Date(branch.date).getTime() / 1000;
      minTime = Math.min(minTime,time);
      maxTime = Math.max(maxTime,time);
    }

    for (let branch of branches) {
      let time = new Date(branch.date).getTime() / 1000;
      //time -= minTime;
      //time = ((time/60)/60)/24;

      const maxPixWidth = 1200;
      let left = 10+maxPixWidth*(time-minTime)/(maxTime-minTime);
      let width = maxPixWidth*(maxTime-time)/(maxTime-minTime)
      text(branch.dest, 10, y);
      text(branch.date, 400, y);
      text(""+time, 800,y);
      text(""+width, 1200,y);
      rect(left,y+4,width,4)
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