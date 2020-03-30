class Memory{
  constructor(mainElement, startButton, timerElement, triesElement, messageWinning, closeMessageWinning){
    this.mainElement = mainElement;
    this.startButton = startButton;
    this.triesElement = triesElement;
    this.messageWinning = messageWinning;
    this.closeMessageWinning = closeMessageWinning;
    this.tries = 0;
    this.matches = 0;
    this.fields = [...this.mainElement.getElementsByClassName('memory__field')];
    this.fieldsAmount = this.fields.length;
    this.clickCount = 0;
    this.clickedClassName = 'memory__field--clicked';
    this.matchedClassName = 'memory__field--matched';
    this.timer = new Timer(timerElement);
    this.checkWin();
    this.bindEvents();
  }
  
  startNewGame = () => {
    this.tries = 0;
    this.matches = 0;
    this.updateTriesElement();
    this.clickCount = 0;
    this.clickTotal = 0;
    this.setColors();
    this.timer.stopTimer();
    this.timer.resetTimer();
  }
  
  shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  setColors = () => {
    const shuffledFields = this.shuffle([...this.fields]);
    
    let i = 0;
    let iColor = 0;
    
    shuffledFields.map(field => {
      field.className = '';
      field.classList.add('memory__field');
      field.classList.add('memory__field--' + iColor)
      field.dataset.color = iColor;
      if(i % 2){
        iColor += 1;
      }
      i += 1;
    });
    
  }
  
  onClickStart = () => {
    this.bindCardClick();
    this.mainElement.classList.remove('memory--started');
    setTimeout(() => {
      this.mainElement.classList.add('memory--started');
    }, 250);
    this.startNewGame();
  }
  
  bindCardClick = () => {
    this.fields.map(field => {
      field.addEventListener('click', this.onClickField);
    });
  }
  
  unbindCardClick = () => {
    this.fields.map(field => {
      field.removeEventListener('click', this.onClickField);
    });
  }
  
  bindEvents = () => {
    this.startButton.addEventListener('click', this.onClickStart);
    this.closeMessageWinning.addEventListener('click', () => {
      this.messageWinning.style.display = 'none';
    })
  }
  
  onClickField = (e) => {
    e.stopPropagation();
    const currentField = e.currentTarget;
    
    if(!currentField.classList.contains(this.clickedClassName)){
      if(this.clickTotal == 0){
        this.timer.startTimer();
        this.clickTotal += 1;
      }
      this.clickCount += 1;
      currentField.classList.add(this.clickedClassName);

      if(this.clickCount >= 2){
        this.unbindCardClick();
        this.checkMatch();
        this.clickCount = 0;
        this.tries += 1;
        this.updateTriesElement();
      }
    }
    
  }
  
  updateTriesElement = () => {
    this.triesElement.textContent = this.tries;
  }
  
  checkMatch = () => {
    let match = false;
    const clickedFields = [...document.getElementsByClassName(this.clickedClassName)];
    if(clickedFields.length >= 2){
      if(clickedFields[0].dataset.color == clickedFields[1].dataset.color){
        match = true;
        this.matches += 1;
      }

      clickedFields.map(field => {
        if(match){
          field.classList.add(this.matchedClassName);
          field.classList.remove(this.clickedClassName);
          this.checkWin();
          this.bindCardClick();
        }
        else{
          setTimeout(() => {
            field.classList.remove(this.clickedClassName);
            this.bindCardClick();
          }, 1000);
        }
      });
      
    }
  }
  
  checkWin = () => {
    if(this.matches == this.fields.length / 2){
      this.timer.stopTimer();
      setTimeout(() => {
        this.messageWinning.style.display = 'flex';
        const link = document.getElementById('tellYourMum');
        const bodyArray = [
          '¡Hola',         
          'realizado',
          'en',
          this.timer.seconds,
          'segundos',
          'o',
          this.tries,
          'intentos!',        
          'Muchas',
          'gracias.'
        ];
        const bodyString = bodyArray.join('%20');
        link.href = 'mailto:contacto@venca.es?subject=Memory%20game%20on%20Landing&body=' + bodyString;
      }, 1000);
    }
  }
}

class Timer{
  constructor(mainElement){
    this.seconds = 0;
    this.mainElement = mainElement;
  };
  
  startTimer = () => {
    this.loop = setInterval(() => {
      this.seconds += 1;
      
      const length = 60;
      let seconds = (this.seconds % length).toString();
      seconds = seconds.length === 1 ? '0' + seconds : seconds;
      let minutes = (Math.floor(this.seconds / length)).toString();
      minutes = minutes.length === 1 ? '0' + minutes : minutes;
      const string = minutes + ':' + seconds;
      
      this.updateTimer(string);
    }, 1000);
  }
  
  updateTimer = (string) => {
    this.mainElement.textContent = string;
  }
  
  resetTimer = () => {
    this.seconds = 0;
    this.updateTimer('00:00');
  }
  
  stopTimer = () => {
    clearInterval(this.loop);
  }
}

new Memory(
  document.getElementById('memory'),
  document.getElementById('start'),
  document.getElementById('timer'),
  document.getElementById('tries'),
  document.getElementById('messageWinning'),
  document.getElementById('closeMessageWinning'),
);