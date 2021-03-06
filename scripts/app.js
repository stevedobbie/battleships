// Remember to console log and check if your JS is connected properly

function init() {
  
  // **** IMPROVEMENTS
  // Refactor AI logic - fix repetitive hits and breakout into smaller functions
  // Add logic for vessels at the edge of the grid (e.g. in column 9)
  // Add visualisation of AI targeting and remove extra grid
  // Refactor to resolve issue with vessel objects and include hit and sunk rather than additional variables for these
  // Refactor to make more functions reusable
  // Turn counts and player statistics
  // Stronger AI - probabilistic simulation 
  
  // GLOBAL VARIABLES
  
  // Grid variables
  const columns = 10
  const cells = columns * columns // each grid is 10 x 10
  let gridArrayPlayerTargeting = [] // array for selecting target cells for the player
  const gridArrayPlayerOcean = [] // array for position of player's vessels
  let gridArrayAiTargeting = [] // array for selecting target cells for the AI
  const gridArrayAiOcean = [] // array for position of AI's vessels

  // Vessel variables 
  // vessels are objects with name, length, class 
  const carrier = {
    name: 'carrier',
    length: 5,
    position: [0, 10, 20, 30, 40],
  }
  
  const battleship = {
    name: 'battleship',
    length: 4,
    position: [0, 10, 20, 30],
  }
  
  const destroyer = {
    name: 'destroyer',
    length: 3,
    position: [0, 10, 20],
  }
  
  const submarine = {
    name: 'submarine',
    length: 3,
    position: [0, 10, 20],
  }
  
  const minesweeper = {
    name: 'minesweeper',
    length: 2,
    position: [0, 10],
  }

  // store vessel objects in an array
  const playerVessels = [carrier, battleship, destroyer, submarine, minesweeper]
  const aiVessels = [carrier, battleship, destroyer, submarine, minesweeper]

  ////console.log(playerVessels)

  // store target (vessel with length of 1) in a separate array
  const targetDiv = {
    name: 'target',
    length: 1,
    position: [0],
  }

  const targetArray = [targetDiv]
  
  // for ai and player store hitsRemaining = total length of all vessels
  let playerHitsRemaining = 5 + 4 + 3 + 3 + 2
  let aiHitsRemaining = 5 + 4 + 3 + 3 + 2
  let playerVesselsRemaining = 5
  let aiVesselsRemaining = 5
  let playerCarrierHits = 5
  let playerBattleHits = 4
  let playerDestroyHits = 3
  let playerSubHits = 3
  let playerMineHits = 2
  let aiCarrierHits = 5
  let aiBattleHits = 4
  let aiDestroyHits = 3
  let aiSubHits = 3
  let aiMineHits = 2
  let sunkPlayerVessel
  let playerCarrierSunk = 0
  let playerBattleSunk = 0
  let playerDestroySunk = 0
  let playerSubSunk = 0
  let playerMineSunk = 0
  let aiCarrierSunk = 0
  let aiBattleSunk = 0
  let aiDestroySunk = 0
  let aiSubSunk = 0
  let aiMineSunk = 0

  // Mouse variables
  let mousePointer // mouse pointer cell
  let position = 0

  // start Game variable
  const start = true

  // deployment variables
  let deploy = false
  let index = 0 // sets the starting index

  // player deployment variables
  let grid = gridArrayPlayerOcean // player's ocean grid
  let name = playerVessels[index].name // starting name for first vessel to be deployed ('carrier')
  let player = playerVessels // array which stores the player's vessels
  const deployedCarrier = [] // deployed arrays which aren't over-written
  let deployedBattleship = []
  let deployedDestroyer = []
  let deployedSub = []
  let deployedMine = []
  let deployCounter = 0
  let playerDeployment = false

  // Ai deployment variables
  let aiCell = 0
  let aiDeployment = false
  let collision = [] // this is also used to check if there's a hit
  let playerCollision = []

  // target variables
  let targetGrid
  
  // ai play variables
  let aiAvailableCells = [] // cells to target after filtering for hits and misses
  const aiCellsToExclude = [] // this will store the cells which have been hit or missed
  let killMode = false 
  let shotsArray = []
  let killArray = []
  const aiPreviousTargets = []
  let killOrientation
  let aiTargetArray = []
  let newTarget
  let killCounter = 0

  let scn1Counter = 0
  let scn2Counter = 0
  let scn3Counter = 0
  let scn4Counter = 0
  let scn5Counter = 0
  let valCounter = 0

  // rotation
  let orientation = 0 // starting position in vertical, 1 is horizontal
  let rotationToggle = 0

  // game variables
  let playerTurn = 0
  let aiTurn = 0 
  let totalTurn = aiTurn + playerTurn
  let hitAiVessel
  let hitPlayerVessel
  let playerTargetResult = []
  let aiTargetResult = []
  let turnToggle = 0
  const sunkPlayer = ['carrier', 'battleship', 'destroyer', 'submarine', 'minesweeper']
  const sunkAi = ['carrier', 'battleship', 'destroyer', 'submarine', 'minesweeper']

  // test variables
  let avoidCells = []
  let choosefromCells = []
  let aiSelectionArray = []

  // text message variables
  let textPosition = 0
  let phraseIndex = 0
  const speed = 50 // milliseconds between each character
  let ms
  let messageArray = [
    'Howdy, would you like to play a game of battleships?', 
    'You really know how to turn me on. I will be a sport and you can place your vessels first',
    'Stop pushing my buttons',
    'Oh bother, you have sunk my carrier',
    'Drat, you sunk my battleship',
    'Lucky shot you sunk my destroyer',
    'Have you played this games before? You sunk my submarine',
    'My circuits are failing. You sunk my minsweeper.',
    'Disappointing I need to have a word with myself',
    `Humans are so slow... I placed my vessels in ${ms}`,
    'A victory for artificial intelligence. I sunk your carrier',
    'Practice makes perfect. I sunk your battleship',
    'Haha I have destroyed your destroyer',
    'Your submarine is sleeping with the fishes',
    'Maybe you should play minesweeper instead? I just blew one up'
  ]

  // Event variables
  const playerTargetingGrid = document.querySelector('.playerTargetingGrid')
  const playerOceanGrid = document.querySelector('.playerOceanGrid')
  const aiTargetingGrid = document.querySelector('.aiTargetingGrid')
  const aiOceanGrid = document.querySelector('.aiOceanGrid')
  const rotateButton = document.querySelector('#rotate')
  const startButton = document.querySelector('#start')
  const messagePanel = document.querySelector('#messages')


  // Timeout to ensure functions do not skip steps
  let timeOut
  
  function timer() {
    //console.log('Time out')
  }

  //function start ()
  // this starts the game when a button is pressed and then calls the functions below
  // [may also allow reset?]
  
  // creates 10x10 grid, defined using variables so it can be changed later
  // div elements, each with unique ID and 'sea'/empty class
  // grid elements stored in an array
  // there are two grids for the player - oceanGrid and targetingGrid 
  // similarly two grids for the ai 
  // (we can store all of these as different variables)
  // (for development all 4 grids will be displayed - can then hide the ai's later)
  function createGrid (gridClass, className, gridArray) {
    for (let i = 0; i < cells; i++) {
      const cell = document.createElement('div')
      cell.id = i
      cell.classList.add(className)
      cell.classList.add('sea')
      gridClass.appendChild(cell)
      gridArray.push(cell)
    }
  }

  // creates the grids
  createGrid(playerTargetingGrid, 'playerTargeting', gridArrayPlayerTargeting)
  createGrid(playerOceanGrid, 'playerOcean', gridArrayPlayerOcean)
  createGrid(aiTargetingGrid, 'aiTargeting', gridArrayAiTargeting)
  createGrid(aiOceanGrid, 'aiOcean', gridArrayAiOcean)

  // reference for the mouse pointer, needs to generated after the grids are generated
  const playerOcean = document.querySelectorAll('.playerOcean') 
  const playerTarget = document.querySelectorAll('.playerTargeting') 
  ////console.log(playerOcean)

  // MAIN FUNCTIONS


  messages()



  // playerDeploy()
  
    

  
  


  ////console.log(gridArrayPlayerOcean)
  ////console.log(gridArrayAiOcean)

  // MODULAR FUNCTIONS

  // generates the length of the vessel from looking up the object array
  function vesselLength (name, player) {
    return player.filter(vessel => vessel.name === name)[0].length
  }

  ////console.log(playerVessels[0].length)
  ////console.log(vesselLength('carrier', playerVessels))
  ////console.log(vesselLength(playerVessels[3].name, playerVessels))
  
  // generates the position array for the vessel from looking up the object array
  // two arguments are passed in... 
  // name is the name of the vessel
  //player is the name of the player or ai vessel array
  function vesselPosition (name, player) {
    ////console.log(player)
    return player.filter(vessel => vessel.name === name)[0].position
  }
  

  ////console.log(gridArrayPlayerOcean[0])

  // sleep function to enable asynchronous execution
  function sleep (milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
      currentDate = Date.now()
    } while (currentDate - date < milliseconds)
  }

  // vessel added based on vessel name passed into function
  // vessel starting position is 0 
  // vessel class is added to cells based on the vessel length 
  // e.g. if aircraft carrier, aircraft carrier class is added to cells 0, 10, 20, 30, 40
  // accepts four arguments...
  // grid = player or ai grid (e.g. gridArrayPlayerOcean)
  // position = mouse pointer cell id (e.g '46')
  // name = name of vessel/class (e.g. 'carrier')
  // player = player or ai vessel array (e.g. playerVessels)
  function addVessel (grid, position, name, player) {
    const start = grid[position]
    ////console.log(grid[position])
    ////console.log(grid[position], position, name, player)
    const vessel = vesselPosition(name, player)
    ////console.log(vessel)
    
    const bow = playerDeployment === false ? parseInt(start.id) : position 
    // //console.log(bow)
    vessel[0] = bow // updates the vessel array with the id of the mouse pointer position
    start.classList.remove('sea')
    start.classList.add(name) // adds class to the mouse pointer position
    
    // //console.log(start)
    // //console.log(length)
    // //console.log(vessel)
    // //console.log('bow ->', bow)
    // //console.log(name)
    // //console.log(grid[position])
    if (orientation === 0) {
      let nextSection = 10
      for (let i = 1; i < vessel.length; i++) {
        vessel[i] = bow + nextSection
        grid[bow + nextSection].classList.remove('sea')
        grid[bow + nextSection].classList.add(name)
        nextSection += columns // adds 10 on to cell for the next iteration
      }
    } 
    // rotates the vessel when a button is pressed in the header
    if (orientation === 1 && rotationToggle === 0) {  
      rotateVessel(name, player)
    }
    if (orientation === 1) {
      // //console.log(vessel.length)
      // //console.log(bow)
      let nextSection = 0
      for (let i = 0; i < vessel.length; i++) {
        vessel[i] = bow + nextSection
        ////console.log(vessel[i])
        grid[bow + nextSection].classList.remove('sea')
        grid[bow + nextSection].classList.add(name)
        nextSection += 1 // adds 1 on to cell for the next iteration
      }
    }  

    
    
    ////console.log(vessel)
  }

  //addVessel(gridArrayPlayerOcean, 14, playerVessels[0].name, playerVessels)
  //addVessel(gridArrayPlayerOcean, 35, playerVessels[1].name, playerVessels)

  // removes class from all cells using the vessel name passed into the function
  // name = name of vessel/class (e.g. 'carrier', playerVessels[0].name)
  function removeVessel (name) {
    const removeClass = document.querySelectorAll(`.${name}`)
    removeClass.forEach(div => div.classList.remove(name))
    removeClass.forEach(div => div.classList.add('sea'))
  }
  
  // function which can be called to rotate the vessel
  function rotateVessel (name, player) {
    const vessel = vesselPosition(name, player)
    
    for (let i = 1; i < vessel.length; i++) {
      vessel[i] = vessel[i] - (i * columns) + i
      ////console.log(vessel)
    }
    for (let i = 0; i < vessel.length; i++) {
      grid[vessel[i]].classList.remove('sea')
      grid[vessel[i]].classList.add(name)
      
    }
    rotationToggle = 1
  }

  //removeVessel(playerVessels[0].name)

  
  // vessels can be placed anywhere within the grid using the mouse
  // vessels can be translated vertically and horizontally across the grid
  // vessels can be rotated 90 degrees, needs to handle rotation towards edge of the screen
  // collision detection / logic to avoid breaking out the grid
  // collision detection / logic to avoid placement on previous vessels (e.g. if class of any cells != empty)
  // calls the addVessel and removeVessel functions
  function moveVessel (event) {
    
  
    
    mousePointer = event.target.id
    
    
    position = mousePointer
    
    
    
    ////console.log(maxCells)
    
    const length = vesselLength(name, player)
    ////console.log(length)
    const maxCells = cells - (length - 1) * columns // max numbers to avoid scrolling off screen
    const maxWidth = columns - length
    ////console.log(length, maxCells, maxWidth)
    
    // const name = playerVessels[1].name
    // const player = playerVessels
    // const length = vesselLength(name, player)
    ////console.log(maxCells) 
    ////console.log(maxWidth)
    if (mousePointer % columns <= maxWidth && deploy === true && orientation === 1){
      removeVessel(name)
      addVessel(grid, position, name, player)
    } else if (mousePointer % columns > maxWidth && deploy === true && orientation === 1) {
      position = Math.min(mousePointer, Math.floor(mousePointer / columns) * columns + maxWidth) 
      ////console.log('postion ->', position)
      removeVessel(name)
      addVessel(grid, position, name, player)
    }
    if (mousePointer < maxCells && deploy === true && orientation === 0){
      removeVessel(name)
      addVessel(grid, position, name, player)
    } else if (mousePointer >= maxCells && deploy === true && orientation === 0) {
      position = Math.min(mousePointer, maxCells - columns + mousePointer % columns) 
      ////console.log('postion ->', position)
      removeVessel(name)
      addVessel(grid, position, name, player)
    }
  }
  
  // this function places the vessels on the grid
  // checks to see if the cell is already occupied by a vessel
  // deploys vessels if the current index is less than the second last index of the array and the deployment counter is set to zero 
  // grid = player or ai grid (e.g. gridArrayPlayerOcean)
  // position = mouse pointer cell id (e.g '46')
  // name = name of vessel/class (e.g. 'carrier')
  // player = player or ai vessel array (e.g. playerVessels)
  function deployVessel () {
    

    // logic to check if the cell already occupied by a vessel ** TO BE REFACTORED **
    ////console.log(player)
    ////console.log(player[index])
    const vesselArray = player[index].position
    
    
    
    //index = 1 ? deployedBattleship = vesselArray
    // //console.log(vesselArray)
    // deployedDestroyer = player[2].position
    // deployedSub = player[3].position
    // deployedMine = player[4].position
    // //console.log(deployedCarrier, deployedBattleship, deployedDestroyer, deployedSub, deployedMine)
    
    let classes = []
    const checkSea = []
    let invalidCell = null
    for (let i = 0; i < vesselArray.length; i++) {
      classes = grid[vesselArray[i]].classList
      ////console.log(classes[0])
      for (let i = 0; i < classes.length; i++) {
        checkSea.push(classes[i])
        ////console.log(checkSea)
      }
    }

    ////console.log(checkSea)
    const removeSelf = checkSea.filter(item => item !== player[index].name)
    ////console.log('removeSelf ->', removeSelf)
    const cellCollision = removeSelf.filter(item => item === 'carrier' || item === 'battleship' || item === 'destroyer' || item === 'submarine' || item === 'minesweeper')
    
    ////console.log(cellCollision)
    ////console.log(index)
    ////console.log(playerVessels[index].name)
    ////console.log(cellCollision.length)

    if (index === 0) {
      invalidCell = false
    }
    if (cellCollision.length === 0) {
      invalidCell = false
    }
    
    for (let i = 0; i < cellCollision.length; i++) {
      if (cellCollision[i] === 'carrier' || cellCollision[i] === 'battleship' || cellCollision[i] === 'destroyer' || cellCollision[i] === 'submarine' || cellCollision[i] === 'minesweeper') {
        ////console.log(cellCollision[i])
        invalidCell = true
      } else {
        invalidCell = false
      }
    }
  
    // //console.log(grid[22].classList[1])
    
    // const sausage = checkSea.forEach(item => grid[item].classList)
    
    if (index <= player.length - 2 && deployCounter === 0 && invalidCell === false) {
      ////console.log(playerVessels.length - 1)
      
      index += 1
      ////console.log(index)
      
      ////console.log(index)
      name = player[index].name
      ////console.log(playerVessels[index].name)
    } else if  (index > player.length - 2 && deployCounter === 0 & invalidCell === false) {
      // //console.log(name)
      // //console.log(playerVessels[index].name)
      // //console.log(player)
      // //console.log(playerVessels[index].position[0])
      // //console.log('index ->', index)
      addVessel(grid, player[index].position[0], player[index].name, player)
      
      ////console.log('line 441 ->', deployedCarrier)
      //sausage = playerVessels
      deploy = false
      
      // stops the deployment
      deployCounter += 1
      ////console.log(index)
      ////console.log(deployCounter)
      

      // *** CHECK IF THIS IS NEEDED - VESSEL POSITION STORED IN OBJECT ARRAY
      // if (deployCounter === 1 && index === 4 && grid === gridArrayPlayerOcean) {
      //   gridArrayAiTargeting = grid 
      //   ////console.log(gridArrayAiTargeting)
      playerDeployment = true
        
      //   ////console.log(playerDeployment)
      // }
      // if (deployCounter === 1 && index === 4 && grid === gridArrayAiOcean) {
      //   gridArrayPlayerTargeting = grid 
      //   ////console.log(gridArrayPlayerTargeting)
      // }
    }
    
    // *** Cleanup classes ***
    // remove all classes
    
    if (playerDeployment === true) {
      const playerOceanClasses = document.querySelectorAll('.playerOcean')
      for (let i = 0; i < player.length; i++) {
        playerOceanClasses.forEach(div => div.classList.remove(playerVessels[i].name))
        playerOceanClasses.forEach(div => div.classList.add('sea'))
      }
      
      // add classes using the object array
      
      for (let j = 0; j < player.length; j++) {
        
        ////console.log(playerVessels[j])
        //deployedPlayerVessels = playerVessels
        ////console.log(deployedPlayerVessels[0])
        for (let i = 0; i < playerVessels[j].position.length; i++) {
          grid[playerVessels[j].position[i]].classList.add(playerVessels[j].name)
          grid[playerVessels[j].position[i]].classList.remove('sea')
        }
      }
    }
    ////console.log('line 488 ->', deployedCarrier)
    deploymentCheck()
  }
  
  function rotateToggle () {
    textPosition = 0
    phraseIndex = 2
    messages()
    
    orientation === 0 ? orientation += 1 : orientation -= 1
    ////console.log(orientation)
    // const vessel = vesselPosition(name, player)
    // for (let i = 0; i < vessel.length; i++) {
    //   toggle = grid[vessel[i]].classList.toggle('horizontal')
    // }
  }
  
  
  // allows the player to deploy each vessel on the player's oceanGrid looping through the array
  // once added successfully remove the vessel from the array then loop back until array is empty
  // calls the moveVessel function
  function playerDeploy () {
    
   
    

    textPosition = 0
    phraseIndex = [1]
    messages()


    

    removeVessel(name)
    deploy = true
  }

  function deploymentCheck() {
    if (playerDeployment === true && aiDeployment === false) {
      aiDeploy()
    }
    if (aiDeployment === true && playerDeployment === true) {
      targetSelection()
    }
  }

  function aiErrorHandling() {
    aiDeploy()
  }

  // select a random, valid cell for the ai vessel
  function randomCell () {
    const length = vesselLength(name, player)
    const maxCells = cells - (length - 1) * columns // max numbers to avoid scrolling off screen
    const maxWidth = columns - length
    const validCells = []
    // //console.log(name)
    // //console.log(maxWidth)
    // //console.log(length)

    for (let i = 0; i < maxCells; i++) {
      if (i % columns <= maxWidth && i < maxCells) {
        validCells.push(i)
      }
    }
    ////console.log(validCells)

    const randomIndex = Math.floor(Math.random() * validCells.length)
    aiCell = validCells[randomIndex]
    ////console.log(aiCell)
  }
    
  


  // select a random orientation for the ai vessel
  function randomOrientation () {
    orientation = Math.floor(Math.random() * 2)
  }
  
  // remove event listeners (to be removed at the start of the ai's deployment turn)
  function removeEventListeners () {
    playerOcean.forEach(div => div.removeEventListener('mouseenter', moveVessel))
    playerOcean.forEach(div => div.removeEventListener('click', deployVessel))
    playerTarget.forEach(div => div.removeEventListener('mouseenter', moveTarget))
    playerTarget.forEach(div => div.removeEventListener('click', playerAttack))
    rotateButton.removeEventListener('click', rotateToggle)
    startButton.removeEventListener('click', playerDeploy)
  }

  // add event listeners (to be added back at the start of the player's target turn)
  function addBackEventListeners () {
    playerTarget.forEach(div => div.addEventListener('mouseenter', moveTarget))
    playerTarget.forEach(div => div.addEventListener('click', playerAttack))
  }

  
  
  // uses the moveVessel function to place the ai vessels on empty cells on the ai's oceanGrid 
  // randomly select an orientation and starting cell
  // select again if there is a collision
  // remove vessels which have been added successfully from the array
  // loop through until all the vessels are added
  function aiDeploy () {
    const aiStart = new Date()
    
    index = 0 // reset the vessel index
    grid = gridArrayAiOcean // ai's ocean grid
    
    player = aiVessels // array which stores the ai's vessels
    deployCounter = 0
    
    ////console.log('line 582 ->', deployedCarrier)
    removeEventListeners()
    name = aiVessels[index].name
    

    // pops all the position arrays
    // for (let i = 0; i < aiVessels[index].position.length; i++) {
    //   aiVessels[index].position.pop()
    //   //console.log(aiVessels[index].position)
    // }
    ////console.log(playerVessels[0])

    for (let j = 0; j < player.length; j++){
      grid = gridArrayAiOcean
      name = aiVessels[index].name // starting name for first vessel to be deployed ('carrier')
      player = aiVessels
      const vessel = vesselPosition(name, player)

      position = 0
      
      //aiVessels[index].position

      //aiVessels[index]

      // remove vessel
      // removeVessel(name)

      // add vessel at cell 0
    
      addVessel(grid, position, name, player)
      
      // then rotate
      
      randomOrientation()
      
      const row = Math.floor(position / columns)

      // rotation
      if (orientation === 1 && row !== 0) {
        // for (let i = 0; i < vessel.length; i++) {
        //   grid[vessel[i]].classList.remove(name)
        //   grid[vessel[i]].classList.add('sea')
        // }
        for (let i = 1; i < vessel.length; i++) {
          vessel[i] = vessel[i] - (i * columns) + i
        }
        // for (let i = 0; i < vessel.length; i++) {
        //   grid[vessel[i]].classList.remove('sea')
        //   grid[vessel[i]].classList.add(name)
        // }
      }

      vessel[0] = position
      
      // move to a random cell
      randomCell()
      position = aiCell

      vessel[0] = position
    
      // create the new arrays
      let item = position
      if (orientation === 0) {
        for (let i = 0; i < vessel.length; i++) {
          vessel[i] = item
          item += 10
        }
      }
      if (orientation === 1) {
        for (let i = 0; i < vessel.length; i++) {
          vessel[i] = item
          item += 1
        }   
      }
      ms = Math.floor(Math.random() * 200)

      
  
      index += 1
    }
    
    // collision detection - loop until no collisions
    const carrierArray = aiVessels[0].position
    const battleshipArray = aiVessels[1].position
    const destroyerArray = aiVessels[2].position
    const submarineArray = aiVessels[3].position
    const minesweeperArray = aiVessels[4].position

    collision = carrierArray.concat(battleshipArray, destroyerArray, submarineArray, minesweeperArray)
    const checkCollision = collision.some((item, i) => collision.indexOf(item) !== i)

    if (checkCollision === true) {
      aiErrorHandling()
    }

    // remove all classes
    const aiOceanClasses = document.querySelectorAll('.aiOcean')
    for (let i = 0; i < player.length; i++) {
      aiOceanClasses.forEach(div => div.classList.remove(aiVessels[i].name))
      aiOceanClasses.forEach(div => div.classList.add('sea'))
    }
    
    // add classes using the object array
  
    for (let j = 0; j < player.length; j++) {
      for (let i = 0; i < aiVessels[j].position.length; i++) {
        grid[aiVessels[j].position[i]].classList.add(aiVessels[j].name)
        grid[aiVessels[j].position[i]].classList.remove('sea')
      }
    }
    aiDeployment = true
  
    const aiEnd = new Date()

    const aiTime = aiEnd.getTime() - aiStart.getTime()

    textPosition = 0
    phraseIndex = 9
    messageArray[9] = `Humans are so slow... I placed my vessels in ${aiTime} ms` 
    messages()

    deploymentCheck()
  }
  
  
  // *** ROLL THIS INTO ATTACK
  
  // target can be selected using mouse 
  // confirm target selection (y/n)
  // add event listeners for hover and click
  function targetSelection () {
    
    // cleanup grid before adding event listeners
    const playerTargetClasses = document.querySelectorAll('.playerTargeting')
    for (let i = 0; i < player.length; i++) {
      playerTargetClasses.forEach(div => div.classList.remove(aiVessels[i].name))
      playerTargetClasses.forEach(div => div.classList.add('sea'))
    }

    targetGrid = gridArrayPlayerTargeting // player's target grid
    
    name = targetDiv.name // target name
    player = targetDiv // array which stores the ai's vessels
    position = targetDiv.position
    
    addBackEventListeners()
    
    addTarget(targetGrid, position, name)
    
  
    
  }
  
  // add target
  function addTarget (targetGrid, position, name) {  
    const start = targetGrid[position]
    start.classList.remove('sea')
    start.classList.add(name)
  }
  
  function removeTarget () {
    const removeClass = document.querySelectorAll(`.${name}`)
    removeClass.forEach(div => div.classList.remove(name))
    removeClass.forEach(div => div.classList.add('sea'))
  }
  

  function moveTarget (event) {
    ////console.log(event.target)
    mousePointer = event.target.id
    position = mousePointer
    
    const length = 1
    
    const maxCells = cells // max numbers to avoid scrolling off screen
    const maxWidth = columns - length

    if (mousePointer % columns <= maxWidth){
      removeTarget()
      addTarget(targetGrid, position, name)
    } else if (mousePointer % columns > maxWidth) {
      position = Math.min(mousePointer, Math.floor(mousePointer / columns) * columns + maxWidth) 
      ////console.log('postion ->', position)
      removeTarget()
      addTarget(targetGrid, position, name)
    }
    if (mousePointer < maxCells){
      removeTarget()
      addTarget(targetGrid, position, name)
    } else if (mousePointer >= maxCells) {
      position = Math.min(mousePointer, maxCells - columns + mousePointer % columns) 
      ////console.log('postion ->', position)
      removeTarget()
      addTarget(targetGrid, position, name)
    }
  }
  
  // on player's targetingGrid use the moveVessel function to add the target using the array created earlier
  // if cell selected on player's targetingGrid == vessel location on ai's oceanGrid: 
  // push 'hit' into playerShots array 
  // add hit class to cell on player's targetingGrid and ai's oceanGrid
  // decrement ai's hitsRemaining variable by 1
  // if cell selected on player's targetingGrid != vessel location on ai's oceanGrid:
  // push 'miss' into playerShots array
  // add miss class to cell on player's targetingGrid and ai's oceanGrid
  // calls the targetSelection function
  function playerAttack (event) {
    
    removeEventListeners()
    
    const target = parseInt(event.target.id)
    
    // check hit or miss
    const result = collision.some(item => item === target)
    let outcome

    if (result === true) {
      outcome = 'hit'
      ////console.log('hit')
      event.target.classList.remove('sea')
      event.target.classList.add('hit')

      // check which vessel hit (not to be revealed to player until vessel is sunk)
    
      for (let j = 0; j < aiVessels.length; j++) {
        for (let i = 0; i < aiVessels[j].position.length; i++) {
          if (target === aiVessels[j].position[i]) {
            hitAiVessel = aiVessels[j].name
          }
        }
      }
      
      // updates vessel hits tallies
      if (hitAiVessel === sunkAi[0]) {
        aiCarrierHits -= 1
      }
      if (hitAiVessel === sunkAi[1]) {
        aiBattleHits -= 1
      }
      if (hitAiVessel === sunkAi[2]) {
        aiDestroyHits -= 1
      }
      if (hitAiVessel === sunkAi[3]) {
        aiSubHits -= 1
      }
      if (hitAiVessel === sunkAi[4]) {
        aiMineHits -= 1
      }

      // determines if anything sunk
      if (aiCarrierHits === 0 && aiCarrierSunk === 0) {
        aiVesselsRemaining -= 1
        console.log('CHECK ->', aiVesselsRemaining)
        textPosition = 0
        phraseIndex = 3
        messages()
        aiCarrierSunk += 1
      }
      if (aiBattleHits === 0 && aiBattleSunk === 0) {
        aiVesselsRemaining -= 1
        textPosition = 0
        phraseIndex = 4
        messages()
        aiBattleSunk += 1
      }
      if (aiDestroyHits === 0 && aiDestroySunk === 0) {
        aiVesselsRemaining -= 1
        textPosition = 0
        phraseIndex = 5
        messages()
        aiDestroySunk += 1
      }
      if (aiSubHits === 0 && aiSubSunk === 0) {
        aiVesselsRemaining -= 1
        textPosition = 0
        phraseIndex = 6
        messages()
        aiSubSunk += 1
      }
      if (aiMineHits === 0 && aiMineSunk === 0) {
        aiVesselsRemaining -= 1
        textPosition = 0
        phraseIndex = 7
        messages()
        aiMineSunk += 1
      }

      // call endGame function if winner
      if (aiVesselsRemaining === 0) {
        textPosition = 0
        phraseIndex = 8
        messages()
      }
      
    } else {
      outcome = 'miss'
      event.target.classList.remove('sea')
      event.target.classList.add('miss')
    }

    playerTargetResult.push(outcome)

    
    addBackEventListeners() // add back listeners

    // increment turn counters
    playerTurn += 1
    turnToggle += 1
    
    turnCheck()
  
  }
  
  function turnCheck () {

    if (turnToggle === 0 && aiTurn >= playerTurn) {
      addBackEventListeners()
      targetSelection()
    } else if (turnToggle === 1 && aiTurn < playerTurn) {
      removeEventListeners()
      aiAttack()
    } else {
      // failsafe back to player turn
      turnToggle = 0
      addBackEventListeners()
      targetSelection()
    }
  }


  function updateTargetCells () {
    
    if (aiCellsToExclude.length > 0) {
      for (let i = 0; i < aiCellsToExclude.length; i++) {
        aiAvailableCells = aiSelectionArray.filter(item => item !== aiCellsToExclude[i])
        aiSelectionArray = aiAvailableCells
      }
    } else {
      aiAvailableCells = aiSelectionArray
    }
    
    console.log('CHECK -->', aiSelectionArray)
    console.log('CHECK -->', aiCellsToExclude)
  }

  // logic for determine whether ai should hunt or kill
  // if sunk variable = 1, reset kill and sunk variables to 0
  // if kill variable = 1 execute aiKill() 
  // otherwise execute aiHunt()
  function aiAttack () {

    if (aiTurn === 0) {
      huntGrid()
    }

    // call update grid func
    if (aiTurn > 0 ){
      updateTargetCells()
      console.log('CHECK aiCellstoExclude Start of Turn-->', 'aiTurn ->',aiTurn, aiCellsToExclude)
      console.log('CHECK aiTargetCells Start of Turn-->', aiAvailableCells)
      console.log('CHECK aiPreviousTargets Start of Turn-->', aiPreviousTargets)
    }
    

    if (killMode === false && turnToggle === 1) {
      aiHunt()
    }
    if (killMode === true && turnToggle === 1) {
      aiKill()
    }

    // failsafe back to player turn
    turnToggle = 0
    addBackEventListeners()
    targetSelection()

  }
  
  // [note this will be expanded later to a more statistical approach, if time allows]
  // creates an array of the ai targetGrid where class is not hit or miss
  function huntGrid () {

    aiSelectionArray = [] // total cells to target (excl. hits & misses)
    const maxCells = cells
    
    for (let i = 0; i < maxCells; i++) {
      aiSelectionArray.push(i)
    }
    
  }

  
  
  
   
  // uses huntGrid array to randomly selected a cell to target
  // uses moveVessel function to place the target
  // if cell selected on ai's targetingGrid == vessel location on player's oceanGrid: 
      // push "hit" into aiShots array  
      // hit class to cell on ai's targetingGrid and player's oceanGrid
      // decrement player's hitsRemaining variable by 1
      // increment kill variable from 0 to 1
      // store hitCell number in an array
  // if cell selected on ai's targetingGrid != vessel location on players's oceanGrid:
      // push 'miss' into aiShots array 
      // register miss and add miss class to cell on ai's targetingGrid and player's oceanGrid


  function aiHunt () {
    
    // select a random cell from aiTargetCells
    const targetCell = Math.floor(Math.random() * aiAvailableCells.length)
    
    // validation of targetCell
    const restart = aiCellsToExclude.some(item => item === targetCell)
    //console.log('restart --->', restart)
    if (restart === true) {
      turnCheck()
    }

    // *** TO BE CHANGED TO RUN THE GAME 
    // const targetCell = 0

    const targetDiv = gridArrayAiTargeting[targetCell]

    // re-generate the player positions based on classes in playerOcean
    const carrier = document.querySelectorAll('.playerOcean.carrier') 
    const battle = document.querySelectorAll('.playerOcean.battleship')
    const destroyer = document.querySelectorAll('.playerOcean.destroyer')
    const sub = document.querySelectorAll('.playerOcean.submarine')
    const mine = document.querySelectorAll('.playerOcean.minesweeper') 
    
    for (let i = 0; i < carrier.length; i++) {
      deployedCarrier.push(parseInt(carrier[i].id))
    }
    for (let i = 0; i < battle.length; i++) {
      deployedBattleship.push(parseInt(battle[i].id))
    }
    for (let i = 0; i < destroyer.length; i++) {
      deployedDestroyer.push(parseInt(destroyer[i].id))
    }
    for (let i = 0; i < sub.length; i++) {
      deployedSub.push(parseInt(sub[i].id))
    }
    for (let i = 0; i < mine.length; i++) {
      deployedMine.push(parseInt(mine[i].id))
    }

    // generate collision array with player positions
    playerCollision = deployedCarrier.concat(deployedBattleship, deployedDestroyer, deployedSub, deployedMine)

    hitCheck(targetCell, targetDiv)

    // increment turn counters
    aiTurn += 1
    turnToggle -= 1
    
    // this will be used for the ai's targeting - pushes in previous hits & misses
    aiCellsToExclude.push(targetCell)

    // *** AI STATS ***
    console.log('*** AI STATS ***')
    console.log('aiTurn number -->', aiTurn, 'playerTurn number -->', playerTurn)
    console.log('toggle from within aiHunt (should be 0 as reset for player) -->', turnToggle, 'killmode ->', killMode)
    console.log('how many turns in kill mode', killCounter)
    console.log('shot array -->', shotsArray)
    console.log('kill array -->', killArray) 
    console.log('target array -->', aiTargetArray)
    console.log('Shot this turn -->', targetCell)
    console.log('outcome -->', aiTargetResult)
    console.log('previous targets -->', aiPreviousTargets)
    console.log('cells to exclude from targeting -->', aiCellsToExclude)
    console.log('potential ai targets -->', aiAvailableCells)
    console.log('player hits remaining -->', playerHitsRemaining)
    console.log('*** scenario counters ***')
    console.log(`scenario 1 -> ${scn1Counter}`)
    console.log(`scenario 2 -> ${scn2Counter}`)
    console.log(`scenario 3 -> ${scn3Counter}`)
    console.log(`scenario 4 -> ${scn4Counter}`)
    console.log(`scenario 5 -> ${scn5Counter}`)
    console.log(`validation -> ${valCounter}`)
    
    
    turnCheck()
  }

  // this function validates the hit
  // target = the cell number to be targeted
  // element = div to be targeted
  function hitCheck (target, element) {
    // check hit or miss
    const result = playerCollision.some(item => item === target)

    let outcome 
    aiPreviousTargets.push(target)

    if (result === true) {
      killMode = true
      killArray.push(target)
      shotsArray.push(target)
      
      outcome = 'hit'
      playerHitsRemaining -= 1
      
      element.classList.remove('sea')
      element.classList.add('hit')

      // check which vessel hit (not to be used by ai until vessel is sunk)
      if (deployedCarrier.some(item => item === target) === true) {
        playerCarrierHits -= 1
        hitPlayerVessel = 'carrier'
      }
      if (deployedBattleship.some(item => item === target) === true) {
        playerBattleHits -= 1
        hitPlayerVessel = 'battleship'
      }
      if (deployedDestroyer.some(item => item === target) === true) {
        playerDestroyHits -= 1
        hitPlayerVessel = 'destroyer'
      }
      if (deployedSub.some(item => item === target) === true) {
        playerSubHits -= 1
        hitPlayerVessel = 'submarine'
      }
      if (deployedMine.some(item => item === target) === true) {
        playerMineHits -= 1
        hitPlayerVessel = 'minesweeper'
      }

      // check if vessel sunk
      // determines if anything sunk
      if (playerCarrierHits === 0 && playerCarrierSunk === 0) {
        playerVesselsRemaining -= 1
        killMode = false
        sunkPlayerVessel = sunkPlayer[0]
        killArray = []
        shotsArray = []
        aiTargetArray = []
        playerCarrierSunk += 1
        killCounter = 0
        textPosition = 0
        phraseIndex = 10
        messages()
      }
      if (playerBattleHits === 0 && playerBattleSunk === 0) {
        playerVesselsRemaining -= 1
        killMode = false
        sunkPlayerVessel = sunkPlayer[1]
        killArray = []
        shotsArray = []
        aiTargetArray = []
        playerBattleSunk += 1
        killCounter = 0
        textPosition = 0
        phraseIndex = 11
        messages()
      }
      if (playerDestroyHits === 0 && playerDestroySunk === 0) {
        playerVesselsRemaining -= 1
        killMode = false
        sunkPlayerVessel = sunkPlayer[2]
        killArray = []
        shotsArray = []
        aiTargetArray = []
        playerDestroySunk += 1
        killCounter = 0
        textPosition = 0
        phraseIndex = 12
        messages()
      }
      if (playerSubHits === 0 && playerSubSunk === 0) {
        playerVesselsRemaining -= 1
        killMode = false
        sunkPlayerVessel = sunkPlayer[3]
        killArray = []
        shotsArray = []
        aiTargetArray = []
        playerSubSunk += 1
        killCounter = 0
        textPosition = 0
        phraseIndex = 13
        messages()
      }
      if (playerMineHits === 0 && playerMineSunk === 0) {
        playerVesselsRemaining -= 1
        killMode = false
        sunkPlayerVessel = sunkPlayer[4]
        killArray = []
        shotsArray = []
        aiTargetArray = []
        playerMineSunk += 1
        killCounter = 0
        textPosition = 0
        phraseIndex = 14
        messages()
      }

      // call endGame function if winner
      if (aiVesselsRemaining === 0) {
        // *** endGame()
      }
    
    } 

    if (result === false) {
      outcome = 'miss'
      // //console.log(outcome)
      element.classList.remove('sea')
      element.classList.add('miss')
    }

    aiTargetResult.push(outcome)
  }
  
  function validateTargets (aiTargetArray) { 
    
    // validate values to filter if any values are < 0 && > 99
    const updateArray = aiTargetArray.filter(item => item !== item < 0 || item !== item > 99)
    aiTargetArray = updateArray
    
    // filter any array values not in aiAvailableCells
    const checkShot = aiAvailableCells.filter(item => aiTargetArray.indexOf(item) > -1)
    
    aiTargetArray = checkShot
  }

  function aiKillOne () {
    
    aiTargetArray = [0, 0] // reset target array

    scn1Counter += 1
    
    const previousHit = killArray[killArray.length - 1] // find the last cell with a hit

    // options are +1, -1, +10, -10 around cell
    aiTargetArray = [previousHit + 1, previousHit - 1, previousHit + 10, previousHit - 10]
    console.log('Scn1: Target array before validation -->', aiTargetArray)

    validateTargets(aiTargetArray)    
    
    // random index
    const randomIndex = Math.floor(Math.random() * aiTargetArray.length)
    
    // new Target
    newTarget = aiTargetArray[randomIndex]
    console.log('Scn1: Target array after validation -->', aiTargetArray, 'target value -->', newTarget)

    // validating cells to exclude
    avoidCells.push(newTarget)
    choosefromCells = aiSelectionArray.filter(item => item !== newTarget)
    console.log('Scn1: choosefromCells -->', choosefromCells)
  }

  // select random adjacent cell based on hitCell array
  // if only 1 array value then randomly select an adjacent cell (i.e. 1 up, 1 down, 1 left or 1 right)
  // if 2 values in array check whether they are aligned vertically or horizontally and choose cell accordingly 
  // could be 1 before the first or last cell in the hitCell array
  // if last aiShots was 'miss' try again based on whether there is one or 2 values in the array (as above)
  // call sunk()
  function aiKill () {

    killCounter += 1

    console.log('*** AI STATS ***')

    // *** KILL STAGE 1 (1 hit) ***
    // Scenario 1: kill array has 1 item and last shot is hit, pick from 4 targets in targetArray
    if (killArray.length === 1 && aiTargetResult[aiTargetResult.length - 1] === 'hit') {
      
      console.log('Killmode scenario -> scenario 1')

      aiKillOne()      

    } 
    
    // Scenario 2: kill array has 1 item and last shot is miss, filter last shot and pick from next 3 targets in targetArray, etc  
    if (killArray.length === 1 && aiTargetResult[aiTargetResult.length - 1] === 'miss') {
    
      console.log('Killmode scenario -> scenario 2')

      scn2Counter += 1

      // filter last shot from aiTargetArray
      const lastShot = shotsArray[shotsArray.length - 1]
      const filteredArray = aiTargetArray.filter(item => item !== lastShot)
  
      // random index
      const randomIndex = Math.floor(Math.random() * filteredArray.length)

      // update target array
      aiTargetArray = filteredArray
      console.log('Scn2: Target array before validation -->', aiTargetArray,'target value -->', newTarget)  

      // new target
      newTarget = aiTargetArray[randomIndex]
      
      // validate values to filter if any values are < 0 && > 99
      const updateArray = aiTargetArray.filter(item => item !== item < 0 || item !== item > 99)
      aiTargetArray = updateArray
      newTarget = aiTargetArray[randomIndex] 
      
      console.log('Scn2: Target array after validation -->', aiTargetArray, 'target value -->', newTarget)
    
    } 
    
    // *** KILL STAGE 2 (2 or more hits) ***
    // Scenario 3: kill array has 2 or more items and last shot is hit  
    if (killArray.length >= 2 && aiTargetResult[aiTargetResult.length - 1] === 'hit') {

      console.log('Killmode scenario -> scenario 3')
      scn3Counter += 1
      killCounter += 1

      // determine orientation, if last value in kill array is +1 or -1 from previous value then horizontal
      const previousHit = killArray[killArray.length - 1]
      const previousX2Hit = killArray[killArray.length - 2]
      console.log('Previous hit -->', previousHit)
      console.log('PreviousX2 hit -->', previousX2Hit)

      // if horizontal, new target is smallest value  -1 or largest value +1 in kill array
      // if vertical, new target is either smallest value -10 or largest value +10 

      // determine kill array length
      const length = killArray.length
      
      // array is aligned horizontally and last hit is smaller
      if (Math.abs(previousHit - previousX2Hit) === 1 && previousHit < previousX2Hit) {
        aiTargetArray = [previousHit - 1, previousHit + length * 1]
        newTarget = aiTargetArray[0]
      }
      console.log('Scn3: Target array before validation1 -->', aiTargetArray,'target value -->', newTarget) 

      // array is aligned horizontally and last hit is larger
      if (Math.abs(previousHit - previousX2Hit) === 1 && previousHit > previousX2Hit) {
        aiTargetArray = [previousHit + 1, previousHit - length * 1]
        newTarget = aiTargetArray[0]
      }
      console.log('Scn3: Target array before validation2 -->', aiTargetArray,'target value -->', newTarget) 
      // array is aligned vertically and last hit is smallest
      if (Math.abs(previousHit - previousX2Hit) === 10 && previousHit < previousX2Hit) {
        // select previousHit, generate array and target
        aiTargetArray = [previousHit - 10, previousHit + length * 10]
        newTarget = aiTargetArray[0]
      }
      console.log('Scn3: Target array before validation3 -->', aiTargetArray,'target value -->', newTarget) 
      // array is aligned vertically and last hit is larger
      if (Math.abs(previousHit - previousX2Hit) === 10 && previousHit > previousX2Hit) {
        aiTargetArray = [previousHit + 10, previousHit - length * 10]
        newTarget = aiTargetArray[0]
      }
      console.log('Scn3: Target array before validation4 -->', aiTargetArray,'target value -->', newTarget) 

      // random index
      const randomIndex = Math.floor(Math.random() * aiTargetArray.length)

      // validate values to filter if any values are < 0 && < 99
      const updateArray = aiTargetArray.filter(item => item !== item < 0 || item !== item > 99)
      aiTargetArray = updateArray
      newTarget = aiTargetArray[randomIndex] 

      console.log('Scn3: Target array after validation -->', aiTargetArray, 'target value -->', newTarget)

    } 

    // Scenario 4: kill array has 2 or more items and last shot is miss
    if (killArray.length >= 2 && aiTargetResult[aiTargetResult.length - 1] === 'miss') {

      scn4Counter += 1
      killCounter += 1
      
      console.log('Killmode scenario -> scenario 4')

      // filter last shot from aiTargetArray
      const lastShot = newTarget
      const filteredArray = aiTargetArray.filter(item => item !== lastShot)
    
      // random index
      const randomIndex = Math.floor(Math.random() * filteredArray.length)

      // update target array
      aiTargetArray = filteredArray  
      
      // new target
      newTarget = aiTargetArray[randomIndex]
      //console.log('selected shot ->', newTarget)
      
    } 
    
    // *** KILL STAGE 3 (handling other odd scenarios) ***
    // Scenario 5: if 2 boats lie parallel to each other then possible to have got the orientation wrong. This would happen when kill array has 2 or more items and last 2 shots are misses. Future improvement to detect in this scenario and pick one of the hit cells and select the alternative orientation
    // Scenario n: other error handling
    if ( (killArray.length > 1 && aiTargetArray.length === 0) || killCounter > 5 || killArray.length === 0 ) {
      // || (killArray.length > 1 && aiTargetResult[aiTargetResult.length - 1] === 'miss' && aiTargetResult[aiTargetResult.length - 2] === 'miss') 
      scn5Counter += 1
      killCounter += 1

      console.log('Killmode scenario -> enter error handling')

      // choose random cell from remaining array
      const randomShot = Math.floor(Math.random() * aiAvailableCells.length)

      newTarget = aiAvailableCells[randomShot]

      // reset killArray, shotsArray and targetArray
      killArray = []
      aiTargetArray = []
      shotsArray = []
      killMode = false
      killCounter = 0
    }

    valCounter += 1

    // validation - check cell is not in shots array, loop recursively if it is
    const restart = aiPreviousTargets.some(item => item === newTarget)
    //console.log('restart -->', restart)

    if (restart === true || newTarget > cells - 1 || newTarget < 0) {
      turnCheck()
    }

    // target element
    const targetDiv = gridArrayAiTargeting[newTarget]

    hitCheck(newTarget, targetDiv)

    // this will be used for the ai's targeting - pushes in previous hits & misses
    aiCellsToExclude.push(newTarget)

    // increment turn counters
    aiTurn += 1
    turnToggle -= 1
    
    // *** AI STATS ***
    
    console.log('aiTurn number -->', aiTurn, 'playerTurn number -->', playerTurn)
    console.log('toggle from within aiKill (should be 0 as reset for player) -->', turnToggle, 'killmode ->', killMode)
    console.log('how many turns in kill mode', killCounter)
    console.log('shot array -->', shotsArray)
    console.log('kill array -->', killArray) 
    console.log('target array -->', aiTargetArray)
    console.log('Shot this turn -->', newTarget)
    console.log('outcome -->', aiTargetResult)
    console.log('previous targets -->', aiPreviousTargets)
    console.log('cells to exclude from targeting -->', aiCellsToExclude)
    console.log('potential ai targets -->', aiAvailableCells)
    console.log('player hits remaining -->', playerHitsRemaining)
    console.log('*** scenario counters ***')
    console.log(`scenario 1 -> ${scn1Counter}`)
    console.log(`scenario 2 -> ${scn2Counter}`)
    console.log(`scenario 3 -> ${scn3Counter}`)
    console.log(`scenario 4 -> ${scn4Counter}`)
    console.log(`scenario 5 -> ${scn5Counter}`)
    console.log(`validation -> ${valCounter}`)
    
    turnCheck()
  }
  
  function messages() {
    
    messagePanel.innerHTML = messageArray[phraseIndex].substring(0, textPosition) + '\u25AE'
    
    if (textPosition++ !== messageArray[phraseIndex].length)
      setTimeout(messages, speed)
  }
  
  //function endGame () *** NOT IMPLEMENTED YET ***
  // game keeps looping through playerAttack and aiAttack until either ai or player's hitsRemaining == 0
  
  // EVENT LISTENERS
  playerOcean.forEach(div => div.addEventListener('mouseenter', moveVessel))
  playerOcean.forEach(div => div.addEventListener('click', deployVessel))
  rotateButton.addEventListener('click', rotateToggle)
  startButton.addEventListener('click', playerDeploy)
}

window.addEventListener('DOMContentLoaded', init)
