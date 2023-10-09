import { useEffect, useState } from 'react'
import Box from './Box'
import './App.css'
import './vm.css'
import AllocationInformation from './AllocationInformation'
import Word from './Word'

export type IAddressBox = {
  address: string;
}


const ALLOCATION_CONSTANTS = {
  WORD_SIZE_32BIT: 4,
  WORD_SIZE_64BIT: 8,
} as const;

/// address : The address in which the virtual memory should start from
/// numaddresses : number of address bytes that should be present
/// baseNumber : The base number (default is 16 for hexadecimal)
export function AddressCreation(address: number, numAddresses: number, slide : number, baseNumber: number = 16): IAddressBox[] {
  const addressArr: IAddressBox[] = []
  let basePrefix = "" 
  switch (baseNumber) {
    case 2:
      basePrefix = "0b"
      break
    case 16:
      basePrefix = "0x"
      break
    default:
      break
  }

  for (let i = 0; i <= numAddresses - 1; i++) {
    addressArr.push({ address: basePrefix + (address + i*slide).toString(baseNumber) });
  }

  return addressArr;


}



function App() {
  const [selectedbytes, setSelectedbytes] = useState<IAddressBox[]>([])
  const [sizeOfBytes, setSizeOfBytes] = useState<number>(0)
  const [bytes, setbytes] = useState<IAddressBox[]>(AddressCreation(12222, 4, 32))
  const [highlightedbytes, setHighlightedbytes] = useState<IAddressBox[]>([])
  const [showError, setShowError] = useState<boolean>(false)
  const [words, setWords] = useState<IAddressBox[][]>([])

  useEffect(() => {
    console.log(selectedbytes);
    setShowError(false);
    console.log(showError);
  }, [sizeOfBytes])


  function handleClickOnBox(box: IAddressBox): boolean {
    debugger

    if (!selectedbytes.includes(box)) {
      // if the box is not selected we cannot highlight it
      return false;
    }

    if (highlightedbytes &&
      highlightedbytes.length > 0 &&
      highlightedbytes.includes(box)) {
      // if the box is already selected, deselect it
      setHighlightedbytes(highlightedbytes.filter(selectedBox => selectedBox !== box))
    } else {
      // if the box is not selected, select it
      setHighlightedbytes([...highlightedbytes, box])
    }
    return true;
  }

  // handle the malloc click
  function handleMallocClick(sizeOfBytes: number) {

    // Word = 4 bytes for 32 bit system
    // Word = 8 bytes for 64 bit system
    const mallocedMem = sizeOfBytes;


    // loop through all the possible startingpoints for a possible allocation
    const unselectedbytes = bytes.filter(box => !selectedbytes.includes(box))
    const StartingPoint = bytes.indexOf(unselectedbytes[0])
    //let possible Check if the starting point is possible
    let possible: IAddressBox[]
    if ((StartingPoint + mallocedMem) == bytes.length) {
      possible = bytes.slice(StartingPoint)
    } else {
      // startingpoint -> indexOf(startingpoint + mallocedMem)
      possible = bytes.slice(StartingPoint, bytes.indexOf(bytes[StartingPoint + mallocedMem]));
    }

    const AllocationIsPossible = mallocedMem <= possible.length && possible.every(box => !selectedbytes.includes(box))
    if (mallocedMem > 0 && AllocationIsPossible) {
      // set the color
      setSelectedbytes([...selectedbytes, ...possible]);
    } else {
      setShowError(true);
    }
  }

  // handle the free click
  function handleFreeClick() {
    debugger
    const remaining = selectedbytes.filter(box => !highlightedbytes.includes(box));
    setSelectedbytes(remaining);
    setHighlightedbytes([]);
  }




  return (
    <>
      {/* Error msg incase of too many bytes */}
      {showError &&
        <div className='error-container'>
          <p className='error-msg'>
            Not enough space for {sizeOfBytes} bytes
          </p>
        </div>}
      <div className='main-frame'>
        <h1 className='title'>Virtual Memory</h1>
        <h2>Word Allocation</h2>
        <div className='virtual-memory-container'>
            <div className='block-container'>
              <AllocationInformation allocationNumber={1} />
              <Word
                color={`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`}
                bytes={bytes}
                selectedbytes={selectedbytes}
                handleClickOnBox={handleClickOnBox}
              />
            </div>

        </div>
      </div>

      <div className='alloc-buttons'>
        <div>
          <button
            className='alloc-button'
            onClick={handleFreeClick}
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
            autoFocus
            placeholder='32'

          />
        </div>
        <p style={{ fontSize: 22 }}>Words</p>
      </div>
      <div className='authors'>
        Mahmood & Phil - SysMentor
      </div>
    </>
  )
}

export default App
