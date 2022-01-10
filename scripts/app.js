// Remember to console log and check if your JS is connected properly

function init() {
  
  // GLOBAL VARIABLES
  
  // Grid variables
  const columns = 10
  const cells = columns * columns // each grid is 10 x 10
  const gridArrayPlayerTargeting = [] // array for selecting target cells for the player
  const gridArrayPlayerOcean = [] // array for position of player's vessels
  const gridArrayAiTargeting = [] // array for selecting target cells for the AI
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
  
  // for ai and player store hitsRemaining = total length of all vessels
  const playerHitsRemaining = 5 + 4 + 3 + 3 + 2
  const aiHitsRemaining = 5 + 4 + 3 + 3 + 2

  let currentPosition = []

  // Mouse variables
  let mousePointer

  // Event variables
  const playerTargetingGrid = document.querySelector('.playerTargetingGrid')
  const playerOceanGrid = document.querySelector('.playerOceanGrid')
  const aiTargetingGrid = document.querySelector('.aiTargetingGrid')
  const aiOceanGrid = document.querySelector('.aiOceanGrid')

  

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
  console.log(playerOcean)

  //console.log(gridArrayPlayerOcean)
  //console.log(gridArrayAiOcean)

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
    const length = vesselLength(name, player)
    const vessel = vesselPosition(name, player)
    const bow = parseInt(start.id)
    vessel[0] = bow // updates the vessel array with the id of the mouse pointer position
    start.classList.add(name) // adds class to the mouse pointer position
    console.log(start)
    console.log(length)
    console.log(vessel)
    console.log('bow ->', bow)
    console.log(name)
    console.log(grid[position])
    let nextSection = 10
    for (let i = 1; i < vessel.length; i++) {
      vessel[i] = bow + nextSection
      grid[bow + nextSection].classList.add(name)
      nextSection += columns // adds 10 on to cell for the next iteration
    }
    console.log(vessel)
  }

  addVessel(gridArrayPlayerOcean, 14, playerVessels[0].name, playerVessels)
  addVessel(gridArrayPlayerOcean, 35, playerVessels[1].name, playerVessels)

  // removes class from all cells using the vessel name passed into the function
  // name = name of vessel/class (e.g. 'carrier', playerVessels[0].name)
  function removeVessel (name) {
    const removeClass = document.querySelectorAll(`.${name}`)
    removeClass.forEach(div => div.classList.remove(name))
  }
  
  //removeVessel(playerVessels[0].name)

  // rotates the vessel when a button is pressed in the header
  // name = name of vessel/class (e.g. 'carrier')
  // player = player or ai vessel array (e.g. playerVessels)
  // grid = player or ai grid (e.g. gridArrayPlayerOcean)
  function rotateVessel (name, player, grid) {
    const vessel = vesselPosition(name, player)
    removeVessel(name)
    for (let i = 1; i < vessel.length; i++) {
      vessel[i] = vessel[i] - (i * columns) + i
    }
    for (let i = 0; i < vessel.length; i++) {
      grid[vessel[i]].classList.add(name)
    }
    console.log(vessel)
  }

  //rotateVessel(playerVessels[1].name, playerVessels, gridArrayPlayerOcean)

  function mouseHover (event) {
    mousePointer = event.target.id
    console.log(mousePointer)
  }
  
  //function moveVessel (event)
  // vessels can be placed anywhere within the grid using the mouse
  // vessels can be translated vertically and horizontally across the grid
  // vessels can be rotated 90 degrees, needs to handle rotation towards edge of the screen
  // collision detection / logic to avoid breaking out the grid
  // collision detection / logic to avoid placement on previous vessels (e.g. if class of any cells != empty)
  // calls the addVessel and removeVessel functions
  
  //function playerDeploy
  // allows the player to deploy each vessel on the player's oceanGrid looping through the array
  // once added successfully remove the vessel from the array then loop back until array is empty
  // calls the moveVessel function
  
  //function aiDeploy
  // uses the moveVessel function to place the ai vessels on empty cells on the ai's oceanGrid 
  // randomly select a vessel, orientation and starting cell
  // select again if there is a collision
  // remove vessels which have been added successfully from the array
  // loop through until all the vessels are added
  
  //function targetSelection (event)
  // target can be selected using space or enter [or on-screen buttons]
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
  playerOcean.forEach(div => div.addEventListener('mouseenter', mouseHover))
  
  
}

window.addEventListener('DOMContentLoaded', init)