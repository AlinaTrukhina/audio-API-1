// window.onload = function() {

//     console.log('loaded');

//     const file = document.getElementById("thefile");
//     const audio = document.getElementById("audio");

//     file.onchange = () => {
//         let files = this.files;
//         audio.src = URL.createObjectURL(files[0]); // creates a URL representing the file
//         audio.load();
//         audio.play();

//         let context = new AudioContext();
//         let src = context.createMediaElementSource(audio);
//         let analyzer = context.createAnalyzer();

//         // create canvas and define dimensions
//         let canvas = document.getElementById("canvas"); 
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         let ctx = canvas.getContext("2d"); // will create 2d canvas

//         // connect the audio nodes source to the analyzer
//         src.connect(analyzer);
//         analyzer.connect(context.destination);

//         analyzer.fftSize = 256;

//         let bufferLength = analyzer.frequencyBinCount;
//         console.log("buffer length is", bufferLength);
//     }

// };


window.onload = function() {
  
    console.log('loaded window');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia(
            // constraints - only audio needed for this app
            {
              audio: true,
            },
          )
      
          // Success callback
          .then((stream) => {})
      
          // Error callback
          .catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`);
          });
    } else {
    console.log("getUserMedia not supported on your browser!");
    }
      


      const file = document.getElementById("file");
      const audio = document.getElementById("audio");
      
      file.onchange = function() {
        const files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        const context = new AudioContext();
        const src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
    
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");
    
        src.connect(analyser);
        analyser.connect(context.destination);
    
        analyser.fftSize = 256;
    
        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
    
        var dataArray = new Uint8Array(bufferLength);
    
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
    
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
    
        function renderFrame() {
          requestAnimationFrame(renderFrame);
    
          x = 0;
    
          analyser.getByteFrequencyData(dataArray);
    
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
          for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            
            var r = barHeight + (25 * (i/bufferLength));
            var g = 250 * (i/bufferLength);
            var b = 50;
    
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    
            x += barWidth + 1;
          }
        }
    
        audio.play();
        renderFrame();
      };
    };