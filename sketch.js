// Source code: 2021 studio derfunke
// for MDD
// By PinkTomate team
// https://editor.p5js.org/zilog/sketches/cEmHTFx0Z

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
]

let levels1 = {}
let levels2 = {}

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
  client.connect({
    onSuccess: onConnect,
    userName: settings.username,
    password: settings.token,
    useSSL: true,
  })
}

function draw() {
  background(255)
  
  if(Object.values(levels1 || levels2).length == 0) { 
   push() 
      textSize(42);
      fill('#0C349E');
      textFont('Big Shoulders Inline Text');
      textAlign(CENTER)
      textLeading(55);
      text('Your PRENDS MA MAIN needs \n some love & attention to get back online', width/2, height/2); 
     pop()
    }
  
    if(levels1 != undefined) {

    strokeWeight(1) 
    noFill()
    
    push()
      for( const [sensor, value] of Object.entries(levels1) ) {
        stroke('#0C349E')
        let angle = map(value, 0, 1024, 300, 0)
        for(var i = 0; i < width; i+=30) {
          for(var j = 0; j < height; j+=100) {
            ellipse(i, j, angle)
          }
        }
      }
    pop()
    
  } 
  
    if(levels2 != undefined) {
    
    strokeWeight(1) 
    noFill()
      
    push()
      for( const [sensor, value] of Object.entries(levels2) ) {
        noStroke()
        fill('#0C349E')
        let angle = map(value, 0, 1024, 0, 70)
        for(var i = 0; i < width; i+=200) {
            rectMode(CENTER)
            rect(i, height/2, angle/4, angle*2)
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
        textSize(14);
        fill('#C93E88');
        textFont('Roboto Mono');
        text('This is a virtual visual connection between two people that cannot be physically together', 60, 40); 
      pop()
  
      push()
        textSize(14);
        fill('#C93E88');
        textFont('Roboto Mono');
        text('A project by Simo Vargas Paraschivoiu & Beatrice Neacsu', windowWidth-520,windowHeight-30); 
      pop()
}

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
  // levels[message.destinationName] = parseInt(message.payloadString)
  if(message.destinationName == 'PinkTomate/light') { 
   levels1[message.destinationName] = parseInt(message.payloadString)
  } else if(message.destinationName == 'PinkTomate/light2') { 
   levels2[message.destinationName] = parseInt(message.payloadString)
  }
}


function mqttSendMessage(payload) {
  //console.log("sending: " + payload)
  let message = new Paho.MQTT.Message( payload.toString() )
  message.destinationName = topic_out
  client.send(message)
}
