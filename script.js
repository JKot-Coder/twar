
function error(text) {
    $('.column').addClass('hidden');
    $('.container').append('<p class="no-support">' + text + '</p>');
}

jQuery(function ($) {
    'use strict'
    var supportsAudio = !!document.createElement('audio').canPlayType;
	if (supportsAudio) {
  		var audioCtx;
	   	var track;
	  	var pannerR, pannerL;
	   	var splitter;
	   	var listener;

        // initialize plyr
        var player = new Plyr('#audio1', {
            controls: [
                'restart',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume'
            ]
        });

		$('[data-plyr~="play"]').on('click', function () {
			init();
        });

        // initialize playlist and controls
        var index = 0,
            playing = false,
            tracks = [{
                "track": 1,
                "name": "Eagles - Hotel California (Binaurial version by binaulab.com)",
                "duration": "6:32",
                "file": "https://cors-anywhere.herokuapp.com/https://music.wixstatic.com/mp3/a84226_890273adef0845e38a6e550081227f9e.mp3"
            }, {
                "track": 2,
                "name": "Queen - Bohemian Rhapsody (Binaurial version by binaulab.com)",
                "duration": "6:10",
                "file": "https://cors-anywhere.herokuapp.com/https://onedrive.live.com/download?cid=0B73C60A829CBF3E&resid=B73C60A829CBF3E%2119828&authkey=AJ4bOO9hG5QdUlQ"
            }, {
                "track": 3,
                "name": "WILLIAM TELL (MOUTH POPPING) (Hugo Zuccarrelli’s Aldebaran)",
                "duration": "1:17",
                "file": "https://cors-anywhere.herokuapp.com/http://s3.amazonaws.com/srobbin-binaural/William_Tell.mp3"
            }, {
                "track": 4,
                "name": "HAIRCUT-HAIRDRIER (Hugo Zuccarrelli’s Aldebaran)",
                "duration": "1:07",
                "file": "https://cors-anywhere.herokuapp.com/http://s3.amazonaws.com/srobbin-binaural/Haircut-Hairdrier.mp3"
            }, {
                "track": 5,
                "name": "MATCHES-MATCHBOX SHAKES (Hugo Zuccarrelli’s Aldebaran)",
                "duration": "1:14",
                "file": "https://cors-anywhere.herokuapp.com/http://s3.amazonaws.com/srobbin-binaural/Matches-Matchbox_Shakes.mp3"
            }],

            buildPlaylist = $(tracks).each(function(key, value) {
                var trackNumber = value.track,
                    trackName = value.name,
                    trackDuration = value.duration;
                if (trackNumber.toString().length === 1) {
                    trackNumber = '0' + trackNumber;
                }
                $('#plList').append('<li> \
                    <div class="plItem"> \
                        <span class="plNum">' + trackNumber + '.</span> \
                        <span class="plTitle">' + trackName + '</span> \
                        <span class="plLength">' + trackDuration + '</span> \
                    </div> \
                </li>');
            }),
            trackCount = tracks.length,
            npAction = $('#npAction'),
            npTitle = $('#npTitle'),
            audio = $('#audio1').on('play', function () {
                playing = true;
                npAction.text('Now Playing...');
            }).on('pause', function () {
                playing = false;
                npAction.text('Paused...');
            }).on('ended', function () {
                npAction.text('Paused...');
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }).get(0),
            li = $('#plList li').on('click', function () {
                var id = parseInt($(this).index());
                if (id !== index) {
                    playTrack(id);
                }
            }),
            init = function () {
		      	if(!audioCtx) {
					//We shoud 
					const AudioContext = window.AudioContext || window.webkitAudioContext;
					if (!AudioContext) {
						 error("Web audio API not supported");
						 return;	
					}
					audioCtx = new AudioContext();

					pannerR = audioCtx.createPanner();
					pannerR.panningModel = 'HRTF';
					pannerR.rolloffFactor = 0;
					pannerR.coneInnerAngle = 0;
					pannerR.coneOuterAngle = 90;
					pannerR.coneOuterGain = 0.0;
					pannerR.setPosition(1, 0, 0);
					pannerR.setOrientation(-1, 0, 0);

					pannerL = audioCtx.createPanner();
					pannerL.panningModel = 'HRTF';
					pannerL.rolloffFactor = 0;
					pannerL.coneInnerAngle = 0;
					pannerL.coneOuterAngle = 90;
					pannerL.coneOuterGain = 0.0;
					pannerL.setPosition(-1, 0, 0);
					pannerL.setOrientation(1, 0, 0);

					splitter = audioCtx.createChannelSplitter(2);
		        	listener = audioCtx.listener;

		        	track = audioCtx.createMediaElementSource(audio);

     				pannerL.connect(audioCtx.destination);
			        splitter.connect(pannerL, 0);

			        pannerR.connect(audioCtx.destination);
			        splitter.connect(pannerR, 1);

		        	track.connect(splitter);
		      	}
            },
            loadTrack = function (id) {
                $('.plSel').removeClass('plSel');
                $('#plList li:eq(' + id + ')').addClass('plSel');
                npTitle.text(tracks[id].name);
                index = id;
                audio.src = tracks[id].file;
            },
            playTrack = function (id) {
                loadTrack(id);
                init();
	    	 	audio.play();
            };
        loadTrack(index);

        if (!window.DeviceOrientationEvent) {
        	$('#orientation-not-supported').removeClass("hidden");
         	$('#coordinates').addClass("hidden");
	    } else {
		     window.addEventListener('deviceorientation', function(event) {
		        document.getElementById('beta').innerHTML = Math.round(event.beta);
		        document.getElementById('gamma').innerHTML = Math.round(event.gamma);
		        document.getElementById('alpha').innerHTML = Math.round(event.alpha);
		        document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";     
		       	if (listener) {
		   		    var angle = event.alpha / 180.0 * Math.PI; 
		    		listener.setOrientation(Math.sin(angle),0,-Math.cos(angle),0,1,0);
		   		}
		     });
	     }

    } else {	
    	error($('#audio1').text());
    }
});
