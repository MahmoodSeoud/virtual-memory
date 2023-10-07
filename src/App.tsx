import { useEffect, useState } from 'react'
import Box from './Box'
import './App.css'
import './vm.css'

export interface IAddressBox {
  address: string;
}

const initial_boxes: IAddressBox[] = [
  {
    address: '0x1200a'
  },
  {
    address: '0x1200b'
  },
  {
    address: '0x1200c'
  },
  {
    address: '0x1200d'
  }
];


function App() {



  const [selectedBoxes, setSelectedBoxes] = useState<IAddressBox[]>([])
  const [sizeOfBytes, setSizeOfBytes] = useState<number>(0)
  const [boxes, setBoxes] = useState<IAddressBox[]>(initial_boxes)
  const [highlightedBoxes, setHighlightedBoxes] = useState<IAddressBox[]>([])

  useEffect(() => {
    console.log(selectedBoxes)
  }, [0])


  function handleClickOnBox(box: IAddressBox) {

    if (highlightedBoxes && highlightedBoxes.length > 0 && highlightedBoxes.includes(box)) {
      // if the box is already selected, deselect it
      setHighlightedBoxes(highlightedBoxes.filter(selectedBox => selectedBox !== box))
    } else {
      // if the box is not selected, select it
      setHighlightedBoxes([...highlightedBoxes, box])
    }

  }

  // handle the malloc click
  function handleMallocClick(sizeOfBytes: number) {
    // loop through all the possible startingpoints for a possible allocation
    const unselectedBoxes = boxes.filter(box => !selectedBoxes.includes(box))
    const StartingPoint = boxes.indexOf(unselectedBoxes[0])

    //let possible Check if the starting point is possible
    let possible: IAddressBox[]
    if ((StartingPoint + sizeOfBytes) == boxes.length) {
      possible = boxes.slice(StartingPoint)
    } else {
      // startingpoint -> indexOf(startingpoint + sizeOfBytes)
      possible = boxes.slice(StartingPoint, boxes.indexOf(boxes[StartingPoint + sizeOfBytes]))
    }

    const AllocationIsPossible = sizeOfBytes <= possible.length && possible.every(box => !selectedBoxes.includes(box))
    if (sizeOfBytes > 0 && AllocationIsPossible) {
      // set the color
      setSelectedBoxes([...selectedBoxes, ...possible])
    }
  }

  // handle the free click
  function handleFreeClick(sizeOfBytes: number) {
    // loop through all the possible startingpoints for a possible allocation
    const unselectedBoxes = boxes.filter(box => !selectedBoxes.includes(box))
    const StartingPoint = boxes.indexOf(unselectedBoxes[0])

    //let possible Check if the starting point is possible
    let possible: IAddressBox[]
    if ((StartingPoint + sizeOfBytes) == boxes.length) {
      possible = boxes.slice(StartingPoint)
    } else {
      // startingpoint -> indexOf(startingpoint + sizeOfBytes)
      possible = boxes.slice(StartingPoint, boxes.indexOf(boxes[StartingPoint + sizeOfBytes]))
    }

    const AllocationIsPossible = sizeOfBytes <= possible.length && possible.every(box => !selectedBoxes.includes(box))
    if (sizeOfBytes > 0 && AllocationIsPossible) {
      // set the color
      setSelectedBoxes([...selectedBoxes, ...possible])
    }
  }




  return (
    <>
      <div className='main-frame'>
        <div className='virtual-memory-container'>
          {boxes && boxes.length > 0 && boxes.map((box) =>
            <Box
              key={box.address}
              box={box}
              handleClickOnBox={handleClickOnBox}
              selected={selectedBoxes.includes(box)}
            />
          )}

        </div>
      </div>

      <div className='alloc-buttons'>
        <div>
          <button
            className='alloc-button'
            onClick={() => handleFreeClick(sizeOfBytes)}
          >
            Free
          </button>
          <button
            className='alloc-button'
            onClick={() => handleMallocClick(sizeOfBytes)}
          >
            Malloc
          </button>
          <input
            onChange={(ev) => setSizeOfBytes(Number(ev.target.value))}
            className='input-bits'

          />
        </div>
        <p style={{ fontSize: 22 }}>Bits</p>
      </div>
      <div className='authors'>
        Mahmood & Phil - SysMentor
      </div>
    </>
  )
}

export default App
