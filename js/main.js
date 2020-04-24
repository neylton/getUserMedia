let media  = null;
let fullModal = null;
let video = {width: {max: 1280, ideal: 1280, min: 1},height: {max: 720, ideal: 720, min: 1}};
//height: {max: 720, ideal: 720, min: 1}
// let video = {minWidth: 2560};
let voiceCommad = new VoiceCommand();

window.addEventListener('DOMContentLoaded',function(){
    let voice = new VoiceCommand();
    voice.start();
    
    fullModal = document.querySelector('.full-modal');

    document.querySelectorAll('.open-modal').forEach(function(e){
        e.addEventListener('click',openModal);
    });

    let change = document.querySelectorAll('.js-change-camera');
    change.forEach(function(e){
        e.addEventListener('click', function(){
            if(media){
                media.setVideo().start();
            }
        })
    })

    let tiraFoto = document.querySelector('.js-tira-foto');
    tiraFoto.addEventListener('click', takePicture)


    let recordStart = document.querySelectorAll('.js-media');
    recordStart.forEach(function(e){
        e.addEventListener('click',function(){
            media.recordStart(3000);
            //js-media-play-pause
            let playPause = this.parentElement.querySelector('.js-media-play-pause');
            playPause.style.display = 'block';
            playPause.querySelector('img').src = 'css/009-pause.png';
        })
    })

    let recordStop = document.querySelectorAll('.js-media-stop');
    recordStop.forEach(function(e){
        e.addEventListener('click',function(){
            media.recordStop();
            let playPause = this.parentElement.querySelector('.js-media-play-pause');
            playPause.style.display = 'none';
            playPause.querySelector('img').src = 'css/008-play.png';
        })
    })

    let playpause = document.querySelectorAll('.js-media-play-pause');
    playpause.forEach(function(e){
        e.addEventListener('click',function(){
            media.recordPlayPause(this);
        })
    })


    document.querySelector('.full-modal').addEventListener('click',closeCamera);

    document.querySelectorAll('.modal').forEach(function(e){
        e.addEventListener('click',function(event){
            event.stopPropagation();
        })
    })

});

function closeCamera()
{
    fullModal.querySelectorAll('.modal').forEach( (e) =>{
        if(e.classList.contains('modal-hide') == false ){
            e.classList.add('modal-hide');
        }
    })
    fullModal.classList.add('full-modal-hide');
    document.querySelectorAll('.js-media-play-pause').forEach(function(e){e.style.display = 'none'});
    media.stop();
}

function takePicture()
{
    console.log('Tirando foto...');
    new Alerts({type: 'success', message: 'Foto tirada'});
    let url = '';
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let video = document.getElementById('foto');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    

    canvas.toBlob(function(blob){
        let reader = new FileReader();
        reader.addEventListener('load',function(event){
            let image = document.createElement('img');
            image.src =  event.target.result;
            createBox(image);
        })

        reader.addEventListener('progress',function(event){
            if(event.lengthComputable){
                console.log((event.loaded/event.total*100).toFixed(2),'%');
                
            }
        })
        
        reader.readAsDataURL(blob);

    }, 'image/jpeg', 0.95)
}

function openModal(action = false)
{
        //Pega action atual
        if(typeof action === 'object'){
        action = this.getAttribute('data-action');
    }

        //Pega a camera atual
        let camera = document.getElementById(action);

        //Esconde todas modal
        fullModal.querySelectorAll('.modal').forEach( (e) =>{
            if(e.classList.contains('modal-hide') == false ){
                e.classList.add('modal-hide');
            }
        })

        //Mostra Modal atual
        camera.parentElement.classList.remove('modal-hide');

        if(!media){
            switch(action){
                case 'foto':
                    media = new Media(camera,video,false);
                    break;
                case 'video':
                    media = new Media(camera,video,true);
                    break;
                case 'audio':
                    media = new Media(camera,false,true);
                    break;
            }
            media.optionCamera().then( media => media.start() );
        }else{
            media.stop();
            media.setMedia(camera);
            switch(action){
                case 'foto':
                    media.setConstraints(video, false);
                    break;
                case 'video':
                    media.setConstraints(video, true);                   
                    break;
                case 'audio':
                    media.setConstraints(false, true);                     
                    break;
            }
            media.optionCamera().then( media => media.start() );
        }
        
        fullModal.classList.remove('full-modal-hide');
}

function createBox(media)
{
    let box = document.createElement('div');
    box.setAttribute('class', 'box');
    box.appendChild(media);
    document.querySelector('.content').appendChild(box);
    
}



