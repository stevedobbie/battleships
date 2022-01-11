// Remember to console log and check if your JS is connected properly

function init() {
  
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

  //console.log(playerVessels)

  // store target (vessel with length of 1) in a separate array
  const target = {
    name: 'target',
    length: 1,
    position: [0],
  }

  const targetArray = [target]
  
  // for ai and player store hitsRemaining = total length of all vessels
  const playerHitsRemaining = 5 + 4 + 3 + 3 + 2
  const aiHitsRemaining = 5 + 4 + 3 + 3 + 2

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
  let deployCounter = 0
  let playerDeployment = false

  // Ai deployment variables
  let aiCell = 0

  // rotation
  let orientation = 0 // starting position in vertical, 1 is horizontal
  let rotationToggle = 0

  // Event variables
  const playerTargetingGrid = document.querySelector('.playerTargetingGrid')
  const playerOceanGrid = document.querySelector('.playerOceanGrid')
  const aiTargetingGrid = document.querySelector('.aiTargetingGrid')
  const aiOceanGrid = document.querySelector('.aiOceanGrid')
  const rotateButton = document.querySelector('#rotate')

  // Timeout to ensure functions do not skip steps
  let timeOut
  
  function timer() {
    console.log('Time out')
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
  //console.log(playerOcean)

  // MAIN FUNCTIONS
  //gameStart()
  
  playerDeploy()

  function gameStart() {
    playerDeploy(playerDeploymentCheck)
    console.log('player deploy ->', playerDeployment)

  }
    

  
  


  //console.log(gridArrayPlayerOcean)
  //console.log(gridArrayAiOcean)

  // MODULAR FUNCTIONS

  // generates the length of the vessel from looking up the object array
  function vesselLength (name, player) {
    return player.filter(vessel => vessel.name === name)[0].length
  }

  //console.log(playerVessels[0].length)
  //console.log(vesselLength('carrier', playerVessels))
  //console.log(vesselLength(playerVessels[3].name, playerVessels))
  
  // generates the position array for the vessel from looking up the object array
  // two arguments are passed in... 
  // name is the name of the vessel
  //player is the name of the player or ai vessel array
  function vesselPosition (name, player) {
    return player.filter(vessel => vessel.name === name)[0].position
  }
  

  //console.log(gridArrayPlayerOcean[0])

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
    console.log(grid[position])
    console.log(grid, position, name, player)
    const vessel = vesselPosition(name, player)
    
    const bow = playerDeployment === false ? parseInt(start.id) : aiCell 
    console.log(bow)
    vessel[0] = bow // updates the vessel array with the id of the mouse pointer position
    start.classList.remove('sea')
    start.classList.add(name) // adds class to the mouse pointer position
    
    console.log(start)
    console.log(length)
    console.log(vessel)
    console.log('bow ->', bow)
    console.log(name)
    console.log(grid[position])
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
      // console.log(vessel.length)
      // console.log(bow)
      let nextSection = 0
      for (let i = 0; i < vessel.length; i++) {
        vessel[i] = bow + nextSection
        //console.log(vessel[i])
        grid[bow + nextSection].classList.remove('sea')
        grid[bow + nextSection].classList.add(name)
        nextSection += 1 // adds 1 on to cell for the next iteration
      }
    }  

    
    
    //console.log(vessel)
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
    //console.log(vessel)
    for (let i = 1; i < vessel.length; i++) {
      vessel[i] = vessel[i] - (i * columns) + i
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
  function moveVessel (event, aiCell) {
    
  
    if (playerDeployment === false) {
      mousePointer = event.target.id
    } if (playerDeployment === true) {
      mousePointer = aiCell
      console.log(position)
      console.log(mousePointer)
      console.log(name) 
      console.log(player)
    }
    
    position = mousePointer
    
    
    
    //console.log(maxCells)
    
    const length = vesselLength(name, player)
    console.log(length)
    const maxCells = cells - (length - 1) * columns // max numbers to avoid scrolling off screen
    const maxWidth = columns - length
    //console.log(length, maxCells, maxWidth)
    
    // const name = playerVessels[1].name
    // const player = playerVessels
    // const length = vesselLength(name, player)
    //console.log(maxCells) 
    //console.log(maxWidth)
    if (mousePointer % columns <= maxWidth && deploy === true && orientation === 1){
      removeVessel(name)
      addVessel(grid, position, name, player)
    } else if (mousePointer % columns > maxWidth && deploy === true && orientation === 1) {
      position = Math.min(mousePointer, Math.floor(mousePointer / columns) * columns + maxWidth) 
      //console.log('postion ->', position)
      removeVessel(name)
      addVessel(grid, position, name, player)
    }
    if (mousePointer < maxCells && deploy === true && orientation === 0){
      removeVessel(name)
      addVessel(grid, position, name, player)
    } else if (mousePointer >= maxCells && deploy === true && orientation === 0) {
      position = Math.min(mousePointer, maxCells - columns + mousePointer % columns) 
      //console.log('postion ->', position)
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
    console.log(player)
    console.log(player[index])
    const vesselArray = player[index].position
    
    let classes = []
    const checkSea = []
    let invalidCell = null
    for (let i = 0; i < vesselArray.length; i++) {
      classes = grid[vesselArray[i]].classList
      //console.log(classes[0])
      for (let i = 0; i < classes.length; i++) {
        checkSea.push(classes[i])
        //console.log(checkSea)
      }
    }

    //console.log(checkSea)
    const removeSelf = checkSea.filter(item => item !== player[index].name)
    //console.log('removeSelf ->', removeSelf)
    const cellCollision = removeSelf.filter(item => item === 'carrier' || item === 'battleship' || item === 'destroyer' || item === 'submarine' || item === 'minesweeper')
    
    //console.log(cellCollision)
    //console.log(index)
    //console.log(playerVessels[index].name)
    //console.log(cellCollision.length)

    if (index === 0) {
      invalidCell = false
    }
    if (cellCollision.length === 0) {
      invalidCell = false
    }
    
    for (let i = 0; i < cellCollision.length; i++) {
      if (cellCollision[i] === 'carrier' || cellCollision[i] === 'battleship' || cellCollision[i] === 'destroyer' || cellCollision[i] === 'submarine' || cellCollision[i] === 'minesweeper') {
        //console.log(cellCollision[i])
        invalidCell = true
      } else {
        invalidCell = false
      }
    }
  
    // console.log(grid[22].classList[1])
    
    // const sausage = checkSea.forEach(item => grid[item].classList)
    
    if (index <= player.length - 2 && deployCounter === 0 && invalidCell === false) {
      //console.log(playerVessels.length - 1)
      
      index += 1
      console.log(index)

      //console.log(index)
      name = player[index].name
      //console.log(playerVessels[index].name)
    } else if  (index > player.length - 2 && deployCounter === 0 & invalidCell === false) {
      // console.log(name)
      // console.log(playerVessels[index].name)
      // console.log(player)
      // console.log(playerVessels[index].position[0])
      // console.log('index ->', index)
      addVessel(grid, player[index].position[0], player[index].name, player)
        
      deploy = false
      
      // stops the deployment
      deployCounter += 1
      //console.log(index)
      //console.log(deployCounter)

      if (deployCounter === 1 && index === 4 && grid === gridArrayPlayerOcean) {
        gridArrayAiTargeting = grid 
        //console.log(gridArrayAiTargeting)
        playerDeployment = true
        
        console.log(playerDeployment)
      }
      if (deployCounter === 1 && index === 4 && grid === gridArrayAiOcean) {
        gridArrayPlayerTargeting = grid 
        //console.log(gridArrayPlayerTargeting)
      }
    }
    playerDeploymentCheck()
  }
  
  function rotateToggle () {
    orientation === 0 ? orientation += 1 : orientation -= 1
    //console.log(orientation)
    // const vessel = vesselPosition(name, player)
    // for (let i = 0; i < vessel.length; i++) {
    //   toggle = grid[vessel[i]].classList.toggle('horizontal')
    // }
  }
  
  
  // allows the player to deploy each vessel on the player's oceanGrid looping through the array
  // once added successfully remove the vessel from the array then loop back until array is empty
  // calls the moveVessel function
  function playerDeploy () {
    removeVessel(name)
    deploy = true
  }

  function playerDeploymentCheck() {
    if (playerDeployment === true) {
      aiDeploy()
    }
  }

  // select a random cell for the ai vessel
  function randomCell () {
    aiCell = Math.floor(Math.random() * cells)
  }

  // select a random orientation for the ai vessel
  function randomOrientation () {
    orientation = Math.floor(Math.random() * 2)
  }
  
  // remove event listeners (to be added back at the end of the ai's turn)
  function removeEventListeners () {
    playerOcean.forEach(div => div.removeEventListener('mouseenter', moveVessel))
    playerOcean.forEach(div => div.removeEventListener('click', deployVessel))
    rotateButton.removeEventListener('click', rotateToggle)
  }
  
  // uses the moveVessel function to place the ai vessels on empty cells on the ai's oceanGrid 
  // randomly select an orientation and starting cell
  // select again if there is a collision
  // remove vessels which have been added successfully from the array
  // loop through until all the vessels are added
  function aiDeploy () {
    index = 0 // reset the vessel index
    grid = gridArrayAiOcean // ai's ocean grid
    name = aiVessels[index].name // starting name for first vessel to be deployed ('carrier')
    player = aiVessels // array which stores the ai's vessels
    let deployCounter = 0
    
    removeEventListeners()

    randomOrientation()
    console.log(orientation)

    randomCell()
    console.log(aiCell)

    

    // *** ADD AT cell 0 
    // then rotate
    // then move vessel to random point
    // then deploy
    // maybe create some code to select the random point (accounting for ) 
    position = 0

    addVessel(grid, position, name, player)
    rotateVessel(orientation)
    position = aiCell
    moveVessel(event, aiCell)
  }
  
  

  //function targetSelection (event)
  // target can be selected using mouse 
  // confirm target selection (y/n)
  
  //function playerAttack ()
  // on player's targetingGrid use the moveVessel function to add the target using the array created earlier
  // if cell selected on player's targetingGrid == vessel location on ai's oceanGrid: 
      // push 'hit' into playerShots array 
      // add hit class to cell on player's targetingGrid and ai's oceanGrid
      // decrement ai's hitsRemaining variable by 1
  // if cell selected on player's targetingGrid != vessel location on ai's oceanGrid:
      // push 'miss' into playerShots array
      // add miss class to cell on player's targetingGrid and ai's oceanGrid
  // calls the targetSelection function
  
  //function sunk ()
  // after playerAttack and aiKill checks whether the vessel is sunk
  // i.e. counts the cells for each vessel class on the ai/player oceanGrid 
  // if count for any vessel is zero then display message `This ${vessel.name} has been sunk`
  // increment sunk variable from 0 to 1
  
  //function huntGrid [note this will be expanded later to a more statistical approach, if time allows]
  // creates an array of the ai targetGrid where class is not hit or miss
  
  //function aiHunt ()
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
  
  //function aiKill ()
  // select random adjacent cell based on hitCell array
  // if only 1 array value then randomly select an adjacent cell (i.e. 1 up, 1 down, 1 left or 1 right)
  // if 2 values in array check whether they are aligned vertically or horizontally and choose cell accordingly 
  // could be 1 before the first or last cell in the hitCell array
  // if last aiShots was 'miss' try again based on whether there is one or 2 values in the array (as above)
  // call sunk()
  
  //function aiAttack
  // logic for determine whether ai should hunt or kill
  // if sunk variable = 1, reset kill and sunk variables to 0
  // if kill variable = 1 execute aiKill() 
  // otherwise execute aiHunt()
  
  //function endGame ()
  // game keeps looping through playerAttack and aiAttack until either ai or player's hitsRemaining == 0
  
  
  
  // EVENT LISTENERS
  playerOcean.forEach(div => div.addEventListener('mouseenter', moveVessel))
  playerOcean.forEach(div => div.addEventListener('click', deployVessel))
  rotateButton.addEventListener('click', rotateToggle)
}

window.addEventListener('DOMContentLoaded', init)