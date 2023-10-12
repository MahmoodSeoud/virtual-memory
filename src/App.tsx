import { useEffect, useState } from 'react'
import './App.css'
import './vm.css'
import AllocationInformation from './AllocationInformation'
import Word from './Word'

export type IWordGroup = {
  words: IWord[]
  color: string;
}


export type IWord = {
  address: string;
}


const ALLOCATION_CONSTANTS = {
  WORD_SIZE_32BIT: 4,
  WORD_SIZE_64BIT: 8,
} as const;


export function createAdddress(address: number, addressCount: number, slide: number, baseNumber: number = 16): IWord[] {
  /* 
  address : The address in which the virtual memory should start from
  addressCount : number of address words that should be present
  baseNumber : The base number (default is 16 for hexadecimal)
  */
  const addressArr: IWord[] = []
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

  for (let i = 0; i <= addressCount - 1; i++) {
    addressArr.push({ address: basePrefix + (address + i * slide).toString(baseNumber) });
  }

  return addressArr;


}



function App() {
  const [allocatedWords, setAllocatedWords] = useState<IWord[]>([])
  const [amountToAllocate, setAmountToAllocate] = useState<number>(0)
  const [words, setWords] = useState<IWord[]>(createAdddress(12222, 4, 32))
  const [highlightedWords, setHighlightedWords] = useState<IWord[]>([])
  const [showError, setShowError] = useState<boolean>(false)
  const [groupedWords, setGroupedWords] = useState<IWordGroup[]>([{ words: [], color: 'red' }])

  useEffect(() => {
    setShowError(false);
  }, [amountToAllocate])


  useEffect(() => {
    console.log(groupedWords)
  }, [groupedWords])

  function handleClickOnBox(word: IWord): boolean {

    if (!allocatedWords.includes(word)) {
      // if the box is not selected we cannot highlight it
      return false;
    }

    if (highlightedWords.includes(word)) {
      // if the box is already selected, deselect it
      setHighlightedWords(highlightedWords.filter(selectedBox => selectedBox !== word))
    } else {
      // if the box is not selected, select it
      setHighlightedWords([...highlightedWords, word])
    }
    return true;
  }

  // handle the malloc click
  function handleAllocateClick() {

    // loop through all the wordsToAllocate startingpoints for a wordsToAllocate allocation
    const availableWords = words.filter(word => !allocatedWords.includes(word))
    const startIndex = words.indexOf(availableWords[0])

    //let wordsToAllocate Check if the starting point is wordsToAllocate
    let wordsToAllocate: IWord[] = words.slice(startIndex, startIndex + amountToAllocate);
    const AllocationIsPossible = amountToAllocate > 0 &&
      wordsToAllocate.length >= amountToAllocate &&
      wordsToAllocate.every(word => !allocatedWords.includes(word))

    if (AllocationIsPossible) {
      // set the color
      // Allocation is possible
      setAllocatedWords([...allocatedWords, ...wordsToAllocate]);
      setGroupedWords([...groupedWords, { words: wordsToAllocate, color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` }])

    } else {
      // show error
      // Allocation is NOT possible
      setShowError(true);
    }
  }

  // handle the free click
  function handleFreeClick() {
    debugger
    const remaining = allocatedWords.filter(word => !highlightedWords.includes(word));
    setAllocatedWords(remaining);
    setHighlightedWords([]);
  }




  return (
    <>
      {/* Error msg incase of too many words */}
      {showError &&
        <div className='error-container'>
          <p className='error-msg'>
            Not enough space for {amountToAllocate} words
          </p>
        </div>}
      <div className='main-frame'>
        <h1 className='title'>Virtual Memory</h1>
        <h2>32 bit words</h2>
        <div className='virtual-memory-container'>
          <div className='block-container'>
            <AllocationInformation allocationNumber={1} />
            {words && words.length > 0 && words.map((word, index) => {
              const allocated = allocatedWords.includes(word);
              const group = groupedWords.find(group => group.words.includes(word));
              const color = allocated && group ? group.color : 'transparent';
              return (
                <Word
                  key={index}
                  box={word}
                  color={color}
                  handleClickOnBox={handleClickOnBox}
                  selected={allocated}
                />
              );
            })}

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
            onClick={handleAllocateClick}
          >
            Malloc
          </button>
          <input
            onChange={(ev) => setAmountToAllocate(Number(ev.target.value))}
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
