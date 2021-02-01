// (c) 2021 studio derfunke
// for MDD
// https://editor.p5js.org/zilog/sketches/cEmHTFx0Z

// credentials to connect to MQTT broker
let settings = {
  broker: 'connectr.cloud.shiftr.io',
  username: 'connectr',
  token: '6ouWxIIVDIJMrmdq'
}

// this is the mqtt topic that this sketch will send out to
let topic_out = "myteam/servo"
// topics that this sketch subscribes to
let subs = [
  'PinkTomate/#',  // # means subscribe to all subtopics
  // 'luis/temperature/sensor',
]


let levels = {}

// initialize the mqtt websocket connection
// see: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
client = new Paho.MQTT.Client(
  settings.broker,
  Number(443),
  "p5js-sketch"
)

// callbacks for events
client.onConnectionLost = onConnectionLost
client.onMessageArrived = onMessageArrived

function setup() {
  createCanvas(windowWidth, windowHeight)
  // background(220)
  client.connect({
    onSuccess: onConnect,
    userName: settings.username,
    password: settings.token,
    useSSL: true,
  })
}

function draw() {
  background(255)
  text("sending messages to " + topic_out, width / 2, 20)
  
  if(levels != undefined) {
    // let diameter = 100
    let grey = ('#0C349E');

    strokeWeight(1) // set the weight of our pen stroke
    noFill()
    
    push()
    //  translate(width/2, height/2)
      // go through all the sensor data we have received to visualize it
      for( const [sensor, value] of Object.entries(levels) ) {
        stroke(grey)
        let angle = map(value, 0, 1024, 300, 0)
        for(var i = 0; i < width; i+=30) {
          for(var j = 0; j < height; j+=100) {
            ellipse(i, j, angle)
          }
        }
      }
    pop()
    
    push()
    //  translate(width/2, height/2)
      // go through all the sensor data we have received to visualize it
      for( const [sensor, value] of Object.entries(levels) ) {
        noStroke()
        // strokeWeight(5)
        fill('#0C349E')
        let angle = map(value, 0, 1024, 200, 0)
        for(var i = 0; i < width; i+=200) {
          for(var j = 0; j < height; j+=300) { 
            rect(i, j, angle/8, angle/2)
          }
        }
      }
    pop()
  } 
  
    push()
      stroke(255)
      strokeWeight(200)
      rectMode(CORNER)
      rect(0,0, windowWidth, windowHeight)
    pop()

    push()
      stroke('#C93E88')
      strokeWeight(20) 
      rectMode(CENTER);
      rect(windowWidth/2,windowHeight/2, windowWidth/1.1, windowHeight/1.2)
    pop() 
  
  
      push()
        textSize(12);
        fill('#C93E88');
        textFont('Roboto Mono');
        text('This is a virtual visual connection between two people that cannot be physically together.', 60, 40); 
      pop()
  
      push()
        textSize(12);
        fill('#C93E88');
        textFont('Roboto Mono');
        text('A project by Simo Vargas Paraschivoiu & Beatrice Neacsu', windowWidth-450,windowHeight-30); 
      pop()
}


// function keyPressed() {
//   let servo_angle = 270
//   mqttSendMessage( servo_angle )
// }

function onConnect() {
  console.log("connected to shiftr")
  subs.forEach((element) => {
    console.log("subscribing to topic [" + element + "]")
    client.subscribe(element)
  })
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("lost connection to shiftr:" + responseObject.errorMessage)
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //console.log("received <- topic: " + message.destinationName + " payload:" + message.payloadString)
  // create a list with all the readings and their values so that we can do a simple visualization
  levels[message.destinationName] = parseInt(message.payloadString)
}


function mqttSendMessage(payload) {
  //console.log("sending: " + payload)
  let message = new Paho.MQTT.Message( payload.toString() )
  message.destinationName = topic_out
  client.send(message)
}
