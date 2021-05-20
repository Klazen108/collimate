let branches;

const branchHeight = 40;
const maxPixWidth = 1200;
const startLeft = 180;

function preload() {
  let url = '/workspaces/mipro-ui';
  httpGet(url, 'json', false, function(response) {
    branches = response.sort((a, b) => (a.date > b.date) ? -1 : 1);
    let y = 60 + branchHeight * branches.length
    resizeCanvas(2000,y)
  });
}

function setup() {
  createCanvas(2000, 1600);
}

function draw() {
  textSize(16);
  fill(20);
  strokeWeight(3);
  
  let y = 60;
  if (branches) {
    let bounds = getTimeBounds(branches);

    const rise = 60;
    const run = -10
    const slope = run/rise;

    for (let branch of branches) {
      drawBranch(branch,bounds,y,slope);
      y+=branchHeight;
    }
    
    line(10,4,maxPixWidth+startLeft,4);
    stroke(255);
    text("development", 10, 24);
  }
}

function drawBranch(branch,bounds,y,slope) {
  let time = new Date(branch.date).getTime() / 1000;
  //time -= minTime;
  //time = ((time/60)/60)/24;

  let left = startLeft+maxPixWidth*(time-bounds.minTime)/(bounds.maxTime-bounds.minTime);
  let width = maxPixWidth*(bounds.maxTime-time)/(bounds.maxTime-bounds.minTime)
  stroke(255);
  text(branch.dest.replace("origin/",""), left, y+24);
  text(branch.date, left+200, y+24);
  //text(""+time, 800,y);
  //text(""+width, 1200,y);
  stroke(20);
  //line(left,y+4,left-20,4) //slant line
  line(left+y*slope,4,left,y+4) //slant line
  //rect(left,y+4,width,4)

  line(left,y+4,left+width,y+4) //straight line
}

function getTimeBounds(branches) {
  let minTime = 99999999999;
  let maxTime = 0;
  for (let branch of branches) {
    let time = new Date(branch.date).getTime() / 1000;
    minTime = Math.min(minTime,time);
    maxTime = Math.max(maxTime,time);
  }
  //use current date as max time
  maxTime = new Date().getTime() / 1000;
  return {minTime,maxTime};
}